export type PricingTierId = "basic" | "pro" | "enterprise";
export type BillingInterval = "monthly" | "yearly";

export const YEARLY_DISCOUNT_PERCENT = 20;

export interface TierPricing {
  monthly: number;
  yearly: number;
}

export const TIER_PRICING: Record<PricingTierId, TierPricing> = {
  basic: { monthly: 0, yearly: 0 },
  pro: { monthly: 19, yearly: 19 },
  enterprise: { monthly: 99, yearly: 948 },
};

/** Maps app plan tier to pricing table tier */
export function appPlanToPricingTier(plan: "free" | "pro"): PricingTierId {
  return plan === "pro" ? "pro" : "basic";
}

export function formatPrice(amount: number): string {
  if (amount === 0) return "$0";
  return amount % 1 === 0 ? `$${amount}` : `$${amount.toFixed(2)}`;
}

export function getDisplayPrice(
  tierId: PricingTierId,
  interval: BillingInterval,
  options?: { proSaleMonthly?: number },
): { amount: number; perMonth: number; savingsPercent: number } {
  const pricing = TIER_PRICING[tierId];
  const monthly =
    tierId === "pro" && options?.proSaleMonthly != null && interval === "monthly"
      ? options.proSaleMonthly
      : pricing.monthly;

  if (interval === "monthly") {
    return { amount: monthly, perMonth: monthly, savingsPercent: 0 };
  }

  const yearlyMonthlyEquivalent = pricing.yearly / 12;
  const savingsPercent =
    pricing.monthly > 0
      ? Math.round((1 - pricing.yearly / (pricing.monthly * 12)) * 100)
      : 0;

  return {
    amount: pricing.yearly,
    perMonth: yearlyMonthlyEquivalent,
    savingsPercent,
  };
}
