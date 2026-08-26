"use client";

import { LANDING } from "@/lib/landing-copy";
import { Pricing, type PricingPlan } from "@/components/blocks/pricing";
import {
  getLaunchCampaignSnapshot,
  trackLaunchEvent,
} from "@/lib/launch-campaign";
import { cn } from "@/lib/utils";

interface LandingPricingProps {
  onFreeSignup: () => void;
  onProSignup?: () => void;
  className?: string;
  variant?: "default" | "landing";
}

/** Codehagen pricing command look — light surface, monthly/yearly toggle. */
export function LandingPricing({
  onFreeSignup,
  onProSignup,
  className,
}: LandingPricingProps) {
  const copy = LANDING.pricing;
  const snap = getLaunchCampaignSnapshot();
  const handlePro = () => {
    trackLaunchEvent("pricing_cta_click", { source: "landing_pricing" });
    (onProSignup ?? onFreeSignup)();
  };

  const plans: PricingPlan[] = [
    {
      name: "FREE",
      price: "0",
      yearlyPrice: "0",
      period: "per month",
      description: copy.freeTag,
      features: [...copy.freeBullets],
      buttonText: copy.freeCta,
      note: copy.freeNote,
      onClick: onFreeSignup,
      isPopular: false,
    },
    {
      name: "PRO",
      price: snap.originalPrice,
      yearlyPrice: snap.active ? snap.launchPrice : snap.originalPrice,
      period: "per month",
      description: copy.proValue,
      features: [...copy.proBullets],
      buttonText: snap.active
        ? `Get Started · ${snap.launchPriceLabel}`
        : copy.proCta,
      note: snap.active ? snap.billingNoteHe : copy.proNote(snap.originalPriceLabel),
      badge: "Most Popular",
      onClick: handlePro,
      isPopular: true,
    },
  ];

  return (
    <section
      id="pricing"
      className={cn(
        "relative scroll-mt-24 overflow-hidden rounded-2xl bg-white px-4 py-10 shadow-sm dark:bg-zinc-900 sm:px-8 sm:py-14",
        className,
      )}
    >
      <Pricing
        plans={plans}
        title="Simple, Transparent Pricing"
        description={
          "Choose the plan that works for you\nAll plans include access to our platform and dedicated support."
        }
        showToggle
        tone="default"
      />
    </section>
  );
}
