import {
  isLaunchWeekActive,
  PRO_PLAN_INTRO_PRICE,
  PRO_PLAN_REGULAR_PRICE,
} from "@/lib/constants";
import {
  envPayPalRegularPlanId,
  isExpectedProMonthlyOffer,
  regularBillingCycleFromPlan,
} from "@/lib/paypal-plan-inspect";
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
 * v7: intro month as TRIAL ($9.99) + one REGULAR ($24.90) — v6 used two REGULAR (rejected by API).
 */
const LAUNCH_PLAN_SCHEMA_VERSION = 7;

export { LAUNCH_PLAN_SCHEMA_VERSION };

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
  if (process.env.PAYPAL_PRODUCT_ID?.trim()) {
    return process.env.PAYPAL_PRODUCT_ID.trim();
  }
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
      taxes: {
        percentage: "0",
        inclusive: false,
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
      taxes: {
        percentage: "0",
        inclusive: false,
      },
    }),
  });

  await activateBillingPlan(plan.id);
  return plan.id;
}

export interface CreatedPayPalSubscription {
  id: string;
  approveUrl?: string;
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
    // Prefer pinned Live plan ID from env (source of truth) over Blob auto-create.
    const envLaunch = process.env.PAYPAL_LAUNCH_PLAN_ID?.trim();
    if (envLaunch) {
      return resolveActivePlanId(envLaunch);
    }

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

    throw new Error("Failed to resolve launch subscription plan.");
  }

  const envRegular = envPayPalRegularPlanId();
  if (!cached.regularPlanId) {
    if (envRegular) {
      cached.regularPlanId = envRegular;
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
  subscriberEmail: string,
): Promise<CreatedPayPalSubscription> {
  const email = subscriberEmail.trim().toLowerCase();
  if (!email) {
    throw new PayPalApiError("Authenticated account email is required.");
  }

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
    subscriber: { email_address: email },
    custom_id: email,
  };

  const subscription = await paypalFetch<{
    id: string;
    links?: Array<{ rel: string; href: string }>;
  }>("/v1/billing/subscriptions", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const approveUrl = subscription.links?.find((link) => link.rel === "approve")
    ?.href;

  return { id: subscription.id, approveUrl };
}

export async function getPayPalSubscription(subscriptionId: string): Promise<{
  status: string;
  id: string;
  custom_id?: string;
  start_time?: string;
  subscriber?: { email_address?: string };
  links?: Array<{ rel: string; href: string }>;
}> {
  return paypalFetch<{
    status: string;
    id: string;
    custom_id?: string;
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
  const normalized = userEmail.toLowerCase();
  const customId = subscription.custom_id?.trim().toLowerCase();
  const subEmail = subscription.subscriber?.email_address?.toLowerCase();

  if (customId && customId !== normalized) {
    throw new PayPalApiError("Subscription does not belong to this account.");
  }
  if (!customId && subEmail && subEmail !== normalized) {
    throw new PayPalApiError("Subscription does not belong to this account.");
  }
  if (!customId && !subEmail) {
    throw new PayPalApiError("Subscription is not bound to an account.");
  }

  const allowed = new Set(["APPROVED", "ACTIVE"]);

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
    case "APPROVED":
      // Buyer approved checkout — treat as active Pro once verified (never APPROVAL_PENDING).
      return "active";
    case "ACTIVE":
      return "active";
    case "SUSPENDED":
      return "past_due";
    case "CANCELLED":
    case "EXPIRED":
    case "APPROVAL_PENDING":
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

export function usesManualPayPalPlan(): boolean {
  if (isLaunchWeekActive()) {
    return Boolean(process.env.PAYPAL_LAUNCH_PLAN_ID);
  }
  return Boolean(envPayPalRegularPlanId());
}

export async function checkPayPalBillingSetup(): Promise<{
  planOk: boolean;
  planSource: "auto" | "env";
  launchWeekActive: boolean;
  schemaVersion: number;
  planId?: string;
  billedAmount?: string | null;
  currency?: string | null;
  cycle?: string | null;
  tenureType?: string | null;
  priceMatchesUi: boolean;
  error?: string;
}> {
  const launchWeekActive = isLaunchWeekActive();
  const planSource = usesManualPayPalPlan() ? "env" : "auto";

  try {
    const planId = await getSubscriptionPlanId();
    const plan = await paypalFetch<{
      billing_cycles?: Array<{
        tenure_type?: string;
        frequency?: { interval_unit?: string; interval_count?: number };
        pricing_scheme?: {
          fixed_price?: { value?: string; currency_code?: string };
        };
      }>;
    }>(`/v1/billing/plans/${planId}`);
    const cycle = regularBillingCycleFromPlan(plan);
    const priceMatchesUi = isExpectedProMonthlyOffer(cycle);
    return {
      planOk: true,
      planSource,
      launchWeekActive,
      schemaVersion: LAUNCH_PLAN_SCHEMA_VERSION,
      planId,
      billedAmount: cycle.amount,
      currency: cycle.currency,
      cycle:
        cycle.intervalUnit && cycle.intervalCount
          ? `${cycle.intervalUnit}/${cycle.intervalCount}`
          : null,
      tenureType: cycle.tenureType,
      priceMatchesUi,
    };
  } catch (error) {
    return {
      planOk: false,
      planSource,
      launchWeekActive,
      schemaVersion: LAUNCH_PLAN_SCHEMA_VERSION,
      priceMatchesUi: false,
      error: formatPayPalError(error),
    };
  }
}

export { isPayPalConfigured };
export {
  regularBillingAmountFromPlan,
  isExpectedProMonthlyAmount,
} from "@/lib/paypal-plan-inspect";
