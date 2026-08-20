import { PRO_PLAN_REGULAR_PRICE } from "@/lib/constants";

export const PRO_PLAN_CURRENCY = "USD";

export function getPayPalMode(): "live" | "sandbox" {
  return process.env.PAYPAL_MODE?.trim() === "live" ? "live" : "sandbox";
}

export function getPayPalBaseUrl(): string {
  return getPayPalMode() === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export function envPayPalRegularPlanId(): string | undefined {
  const id =
    process.env.PAYPAL_REGULAR_PLAN_ID?.trim() ||
    process.env.PAYPAL_PLAN_ID?.trim();
  return id || undefined;
}

export type PayPalPlanCycle = {
  amount: string | null;
  currency: string | null;
  intervalUnit: string | null;
  intervalCount: number | null;
  tenureType: string | null;
};

export function regularBillingCycleFromPlan(plan: {
  billing_cycles?: Array<{
    tenure_type?: string;
    frequency?: { interval_unit?: string; interval_count?: number };
    pricing_scheme?: {
      fixed_price?: { value?: string; currency_code?: string };
    };
  }>;
}): PayPalPlanCycle {
  const cycles = plan.billing_cycles ?? [];
  const regular =
    [...cycles].reverse().find((cycle) => cycle.tenure_type === "REGULAR") ??
    cycles[0];
  const price = regular?.pricing_scheme?.fixed_price;
  return {
    amount: price?.value ?? null,
    currency: price?.currency_code ?? null,
    intervalUnit: regular?.frequency?.interval_unit ?? null,
    intervalCount: regular?.frequency?.interval_count ?? null,
    tenureType: regular?.tenure_type ?? null,
  };
}

export function regularBillingAmountFromPlan(plan: {
  billing_cycles?: Array<{
    tenure_type?: string;
    pricing_scheme?: { fixed_price?: { value?: string } };
  }>;
}): string | null {
  return regularBillingCycleFromPlan(plan).amount;
}

export function isExpectedProMonthlyOffer(cycle: PayPalPlanCycle): boolean {
  if (!cycle.amount || !cycle.currency) return false;
  if (cycle.currency.toUpperCase() !== PRO_PLAN_CURRENCY) return false;
  if (cycle.intervalUnit?.toUpperCase() !== "MONTH") return false;
  if (cycle.intervalCount !== 1) return false;
  if (cycle.tenureType && cycle.tenureType !== "REGULAR") return false;
  return (
    Number.parseFloat(cycle.amount) === Number.parseFloat(PRO_PLAN_REGULAR_PRICE)
  );
}

export function isExpectedProMonthlyAmount(value: string | null): boolean {
  if (!value) return false;
  return Number.parseFloat(value) === Number.parseFloat(PRO_PLAN_REGULAR_PRICE);
}
