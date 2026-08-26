"use client";

import { Pricing, type PricingPlan } from "@/components/blocks/pricing";

/** Demo plans from the public Codehagen / 21st.dev usage example (not live Staz prices). */
export const demoPlans: PricingPlan[] = [
  {
    name: "STARTER",
    price: "50",
    yearlyPrice: "40",
    period: "per month",
    features: [
      "Up to 10 projects",
      "Basic analytics",
      "48-hour support response time",
      "Limited API access",
      "Community support",
    ],
    description: "Perfect for individuals and small projects",
    buttonText: "Start Free Trial",
    href: "/#signup",
    isPopular: false,
  },
  {
    name: "PROFESSIONAL",
    price: "99",
    yearlyPrice: "79",
    period: "per month",
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "24-hour support response time",
      "Full API access",
      "Priority support",
      "Team collaboration",
      "Custom integrations",
    ],
    description: "Ideal for growing teams and businesses",
    buttonText: "Get Started",
    href: "/#signup",
    isPopular: true,
  },
  {
    name: "ENTERPRISE",
    price: "299",
    yearlyPrice: "239",
    period: "per month",
    features: [
      "Everything in Professional",
      "Custom solutions",
      "Dedicated account manager",
      "1-hour support response time",
      "SSO Authentication",
      "Advanced security",
      "Custom contracts",
      "SLA agreement",
    ],
    description: "For large organizations with specific needs",
    buttonText: "Contact Sales",
    href: "/#signup",
    isPopular: false,
  },
];

export function PricingBasic() {
  return (
    <div className="min-h-[800px] overflow-y-auto rounded-lg bg-background p-6">
      <Pricing
        plans={demoPlans}
        title="Simple, Transparent Pricing"
        description={
          "Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support."
        }
      />
      <p className="mx-auto mt-8 max-w-xl text-center text-xs text-muted-foreground">
        Demo only — live Staz pricing on the landing page is Free + Pro.
      </p>
    </div>
  );
}

export default PricingBasic;
