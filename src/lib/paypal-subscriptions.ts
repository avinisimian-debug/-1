import {
  isLaunchWeekActive,
  PRO_PLAN_INTRO_PRICE,
  PRO_PLAN_REGULAR_PRICE,
} from "@/lib/constants";
import {
  readPayPalPlanCache,
  writePayPalPlanCache,
  type CachedPayPalPlans,
} from "@/lib/paypal-plan-cache";
import {
  getPayPalAccessToken,
  getPayPalBaseUrl,
  isPayPalConfigured,
  PRO_PLAN_CURRENCY,
} from "@/lib/paypal";

/**
 * PayPal allows at most 2 TRIAL cycles and 1 REGULAR cycle per plan.
 * v5: launch week charges $9.99/mo immediately (no free period).
 */
const LAUNCH_PLAN_SCHEMA_VERSION = 5;

class PayPalApiError extends Error {
  constructor(
    message: string,
    readonly details?: string,
  ) {
    super(message);
    this.name = "PayPalApiError";
  }
}

async function paypalFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getPayPalAccessToken();
  const response = await fetch(`${getPayPalBaseUrl()}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const details = await response.text();
    console.error(`PayPal ${path} error:`, details);
    throw new PayPalApiError(`PayPal request failed (${path})`, details);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

async function getPlanStatus(planId: string): Promise<string> {
  const plan = await paypalFetch<{ status: string }>(
    `/v1/billing/plans/${planId}`,
  );
  return plan.status;
}

async function activateBillingPlan(planId: string): Promise<void> {
  const status = await getPlanStatus(planId);
  if (status === "ACTIVE") return;

  if (status === "CREATED" || status === "INACTIVE") {
    await paypalFetch(`/v1/billing/plans/${planId}/activate`, {
      method: "POST",
    });
    return;
  }

  throw new PayPalApiError(`Billing plan is not usable (status: ${status})`);
}

async function ensureProductId(cached: CachedPayPalPlans): Promise<string> {
  if (process.env.PAYPAL_PRODUCT_ID) return process.env.PAYPAL_PRODUCT_ID;
  if (cached.productId) return cached.productId;

  const product = await paypalFetch<{ id: string }>("/v1/catalogs/products", {
    method: "POST",
    body: JSON.stringify({
      name: "Staz AI Pro",
      description: "Professional transcription and meeting intelligence",
      type: "SERVICE",
      category: "SOFTWARE",
    }),
  });

  cached.productId = product.id;
  await writePayPalPlanCache(cached);
  return product.id;
}

async function createLaunchPlan(productId: string): Promise<string> {
  const plan = await paypalFetch<{ id: string }>("/v1/billing/plans", {
    method: "POST",
    body: JSON.stringify({
      product_id: productId,
      name: "Staz AI Pro — Launch Week",
      description: `Launch week: $${PRO_PLAN_INTRO_PRICE}/month, then $${PRO_PLAN_REGULAR_PRICE}/month`,
      billing_cycles: [
        {
          frequency: { interval_unit: "MONTH", interval_count: 1 },
          tenure_type: "TRIAL",
          sequence: 1,
          total_cycles: 1,
          pricing_scheme: {
            fixed_price: {
              value: PRO_PLAN_INTRO_PRICE,
              currency_code: PRO_PLAN_CURRENCY,
            },
          },
        },
        {
          frequency: { interval_unit: "MONTH", interval_count: 1 },
          tenure_type: "REGULAR",
          sequence: 2,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: PRO_PLAN_REGULAR_PRICE,
              currency_code: PRO_PLAN_CURRENCY,
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3,
      },
    }),
  });

  await activateBillingPlan(plan.id);
  return plan.id;
}

async function createRegularPlan(productId: string): Promise<string> {
  const plan = await paypalFetch<{ id: string }>("/v1/billing/plans", {
    method: "POST",
    body: JSON.stringify({
      product_id: productId,
      name: "Staz AI Pro — Monthly",
      description: "Staz AI Pro monthly subscription",
      billing_cycles: [
        {
          frequency: { interval_unit: "MONTH", interval_count: 1 },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: { value: PRO_PLAN_REGULAR_PRICE, currency_code: PRO_PLAN_CURRENCY },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3,
      },
    }),
  });

  await activateBillingPlan(plan.id);
  return plan.id;
}

async function resolveActivePlanId(planId: string): Promise<string> {
  await activateBillingPlan(planId);
  return planId;
}

export async function getSubscriptionPlanId(): Promise<string> {
  if (!isPayPalConfigured()) {
    throw new Error("PayPal is not configured.");
  }

  const launch = isLaunchWeekActive();
  const cached = await readPayPalPlanCache();
  const productId = await ensureProductId(cached);

  if (launch) {
    const needsNewPlan =
      !cached.launchPlanId ||
      cached.launchPlanSchemaVersion !== LAUNCH_PLAN_SCHEMA_VERSION;

    if (needsNewPlan) {
      cached.launchPlanId = await createLaunchPlan(productId);
      cached.launchPlanSchemaVersion = LAUNCH_PLAN_SCHEMA_VERSION;
      await writePayPalPlanCache(cached);
    } else if (cached.launchPlanId) {
      await activateBillingPlan(cached.launchPlanId);
    }

    if (cached.launchPlanId) {
      return cached.launchPlanId;
    }

    if (process.env.PAYPAL_LAUNCH_PLAN_ID) {
      return resolveActivePlanId(process.env.PAYPAL_LAUNCH_PLAN_ID);
    }

    throw new Error("Failed to resolve launch subscription plan.");
  }

  if (!cached.regularPlanId) {
    if (process.env.PAYPAL_REGULAR_PLAN_ID) {
      cached.regularPlanId = process.env.PAYPAL_REGULAR_PLAN_ID;
      await writePayPalPlanCache(cached);
    } else {
      cached.regularPlanId = await createRegularPlan(productId);
      await writePayPalPlanCache(cached);
    }
  } else {
    await activateBillingPlan(cached.regularPlanId);
  }

  return cached.regularPlanId;
}

export function getAppBaseUrl(): string {
  if (process.env.AUTH_URL) {
    return process.env.AUTH_URL.replace(/\/$/, "");
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export async function createPayPalSubscription(
  returnUrl: string,
  cancelUrl: string,
): Promise<string> {
  const planId = await getSubscriptionPlanId();

  const body: Record<string, unknown> = {
    plan_id: planId,
    application_context: {
      brand_name: "Staz AI",
      locale: "en-US",
      shipping_preference: "NO_SHIPPING",
      user_action: "SUBSCRIBE_NOW",
      return_url: returnUrl,
      cancel_url: cancelUrl,
    },
  };

  const subscription = await paypalFetch<{ id: string }>(
    "/v1/billing/subscriptions",
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );

  return subscription.id;
}

export async function getPayPalSubscription(subscriptionId: string): Promise<{
  status: string;
  id: string;
  start_time?: string;
  subscriber?: { email_address?: string };
  links?: Array<{ rel: string; href: string }>;
}> {
  return paypalFetch<{
    status: string;
    id: string;
    start_time?: string;
    subscriber?: { email_address?: string };
    links?: Array<{ rel: string; href: string }>;
  }>(`/v1/billing/subscriptions/${subscriptionId}`);
}

export async function verifySubscriptionForUser(
  subscriptionId: string,
  userEmail: string,
): Promise<{ status: string }> {
  const subscription = await getPayPalSubscription(subscriptionId);
  const subEmail = subscription.subscriber?.email_address?.toLowerCase();
  const normalized = userEmail.toLowerCase();

  if (subEmail && subEmail !== normalized) {
    throw new PayPalApiError("Subscription does not belong to this account.");
  }

  const allowed = new Set([
    "APPROVAL_PENDING",
    "APPROVED",
    "ACTIVE",
  ]);

  if (!allowed.has(subscription.status)) {
    throw new PayPalApiError(
      `Subscription is not active (status: ${subscription.status}).`,
    );
  }

  return { status: subscription.status };
}

export async function activatePayPalSubscription(
  subscriptionId: string,
  userEmail: string,
): Promise<{ status: string }> {
  return verifySubscriptionForUser(subscriptionId, userEmail);
}

export function mapPayPalSubscriptionStatus(
  paypalStatus: string,
): "trialing" | "active" | "cancelled" | "past_due" {
  switch (paypalStatus) {
    case "APPROVAL_PENDING":
    case "APPROVED":
      return "trialing";
    case "ACTIVE":
      return "active";
    case "SUSPENDED":
      return "past_due";
    case "CANCELLED":
    case "EXPIRED":
      return "cancelled";
    default:
      return "cancelled";
  }
}

export function formatPayPalError(error: unknown): string {
  if (error instanceof PayPalApiError) {
    try {
      const parsed = JSON.parse(error.details ?? "{}") as {
        message?: string;
        details?: Array<{ issue?: string; description?: string }>;
      };
      const issue = parsed.details?.[0];
      if (issue?.description) return issue.description;
      if (parsed.message) return parsed.message;
    } catch {
      // fall through
    }
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Failed to create subscription.";
}

export { isPayPalConfigured };
