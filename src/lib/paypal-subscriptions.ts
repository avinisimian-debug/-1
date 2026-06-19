import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { getLaunchTrialDays, isLaunchWeekActive } from "@/lib/constants";
import {
  getPayPalAccessToken,
  getPayPalBaseUrl,
  isPayPalConfigured,
  PRO_PLAN_CURRENCY,
} from "@/lib/paypal";

interface CachedPlans {
  productId?: string;
  launchPlanId?: string;
  /** Trial days baked into launchPlanId — invalidate when launch week countdown changes. */
  launchPlanTrialDays?: number;
  regularPlanId?: string;
}

const PLANS_CACHE_FILE = join(process.cwd(), "data", "paypal-plans.json");

async function readCachedPlans(): Promise<CachedPlans> {
  try {
    if (!existsSync(PLANS_CACHE_FILE)) return {};
    const raw = await readFile(PLANS_CACHE_FILE, "utf8");
    return JSON.parse(raw) as CachedPlans;
  } catch {
    return {};
  }
}

async function writeCachedPlans(plans: CachedPlans): Promise<void> {
  await mkdir(join(process.cwd(), "data"), { recursive: true });
  await writeFile(PLANS_CACHE_FILE, JSON.stringify(plans, null, 2), "utf8");
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
    throw new Error(`PayPal API error: ${path}`);
  }

  return response.json() as Promise<T>;
}

async function ensureProductId(cached: CachedPlans): Promise<string> {
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
  await writeCachedPlans(cached);
  return product.id;
}

async function createLaunchPlan(
  productId: string,
  trialDays: number,
): Promise<string> {
  const plan = await paypalFetch<{ id: string }>("/v1/billing/plans", {
    method: "POST",
    body: JSON.stringify({
      product_id: productId,
      name: "Staz AI Pro — Launch Week",
      description: `Free for ${trialDays} days, then $14.90 for the first month, then $29.90/month`,
      billing_cycles: [
        {
          frequency: { interval_unit: "DAY", interval_count: trialDays },
          tenure_type: "TRIAL",
          sequence: 1,
          total_cycles: 1,
          pricing_scheme: {
            fixed_price: { value: "0", currency_code: PRO_PLAN_CURRENCY },
          },
        },
        {
          frequency: { interval_unit: "MONTH", interval_count: 1 },
          tenure_type: "REGULAR",
          sequence: 2,
          total_cycles: 1,
          pricing_scheme: {
            fixed_price: { value: "14.90", currency_code: PRO_PLAN_CURRENCY },
          },
        },
        {
          frequency: { interval_unit: "MONTH", interval_count: 1 },
          tenure_type: "REGULAR",
          sequence: 3,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: { value: "29.90", currency_code: PRO_PLAN_CURRENCY },
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
            fixed_price: { value: "29.90", currency_code: PRO_PLAN_CURRENCY },
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

  return plan.id;
}

export async function getSubscriptionPlanId(): Promise<string> {
  if (!isPayPalConfigured()) {
    throw new Error("PayPal is not configured.");
  }

  const launch = isLaunchWeekActive();

  if (launch && process.env.PAYPAL_LAUNCH_PLAN_ID) {
    return process.env.PAYPAL_LAUNCH_PLAN_ID;
  }

  if (!launch && process.env.PAYPAL_REGULAR_PLAN_ID) {
    return process.env.PAYPAL_REGULAR_PLAN_ID;
  }

  const cached = await readCachedPlans();
  const productId = await ensureProductId(cached);

  if (launch) {
    const trialDays = getLaunchTrialDays();
    const needsNewPlan =
      !cached.launchPlanId || cached.launchPlanTrialDays !== trialDays;

    if (needsNewPlan) {
      cached.launchPlanId = await createLaunchPlan(productId, trialDays);
      cached.launchPlanTrialDays = trialDays;
      await writeCachedPlans(cached);
    }
    return cached.launchPlanId!;
  }

  if (!cached.regularPlanId) {
    cached.regularPlanId = await createRegularPlan(productId);
    await writeCachedPlans(cached);
  }
  return cached.regularPlanId;
}

export async function createPayPalSubscription(
  returnUrl: string,
  cancelUrl: string,
): Promise<string> {
  const planId = await getSubscriptionPlanId();

  const subscription = await paypalFetch<{ id: string }>(
    "/v1/billing/subscriptions",
    {
      method: "POST",
      body: JSON.stringify({
        plan_id: planId,
        application_context: {
          brand_name: "Staz AI",
          locale: "en-US",
          shipping_preference: "NO_SHIPPING",
          user_action: "SUBSCRIBE_NOW",
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
      }),
    },
  );

  return subscription.id;
}

export async function getPayPalSubscription(subscriptionId: string): Promise<{
  status: string;
  id: string;
}> {
  return paypalFetch<{ status: string; id: string }>(
    `/v1/billing/subscriptions/${subscriptionId}`,
  );
}

export async function activatePayPalSubscription(
  subscriptionId: string,
): Promise<{ status: string }> {
  const subscription = await getPayPalSubscription(subscriptionId);
  return { status: subscription.status };
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
      return "active";
  }
}

export { isPayPalConfigured };
