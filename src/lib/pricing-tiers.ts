export type PricingTierId = "basic" | "pro";
export type BillingInterval = "monthly";

export interface TierPricing {
  monthly: number;
}

/** Public catalog. Pro is $24.90/month — keep in sync with PRO_PLAN_REGULAR_PRICE. */
export const TIER_PRICING: Record<PricingTierId, TierPricing> = {
  basic: { monthly: 0 },
  pro: { monthly: 24.9 },
};

export function appPlanToPricingTier(plan: "free" | "pro"): PricingTierId {
  return plan === "pro" ? "pro" : "basic";
}

export function formatPrice(amount: number): string {
  if (amount === 0) return "$0";
  return amount % 1 === 0 ? `$${amount}` : `$${amount.toFixed(2)}`;
}

export function getDisplayPrice(
  tierId: PricingTierId,
  _interval: BillingInterval = "monthly",
): { amount: number; perMonth: number; savingsPercent: number } {
  const monthly = TIER_PRICING[tierId].monthly;
  return { amount: monthly, perMonth: monthly, savingsPercent: 0 };
}
