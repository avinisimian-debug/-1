"use client";

import { LANDING } from "@/lib/landing-copy";
import { getProPlanPriceLabel } from "@/lib/constants";
import { LaunchPriceStack } from "@/components/launch/LaunchPriceStack";
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

/** Codehagen pricing structure + Staz Hebrew plans / launch pricing. */
export function LandingPricing({
  onFreeSignup,
  onProSignup,
  className,
  variant = "default",
}: LandingPricingProps) {
  const copy = LANDING.pricing;
  const snap = getLaunchCampaignSnapshot();
  const proPrice = getProPlanPriceLabel();
  const handlePro = () => {
    trackLaunchEvent("pricing_cta_click", { source: "landing_pricing" });
    (onProSignup ?? onFreeSignup)();
  };
  const isLanding = variant === "landing";

  const plans: PricingPlan[] = [
    {
      name: copy.freeTitle,
      price: "0",
      yearlyPrice: "0",
      period: "",
      description: copy.freeTag,
      features: [...copy.freeBullets],
      buttonText: copy.freeCta,
      note: copy.freeNote,
      onClick: onFreeSignup,
      isPopular: false,
      priceNode: (
        <p className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight text-white">$0</span>
        </p>
      ),
    },
    {
      name: copy.proTitle,
      price: snap.active ? snap.launchPrice : snap.originalPrice,
      yearlyPrice: snap.originalPrice,
      period: copy.perMonth,
      description: copy.proValue,
      features: [...copy.proBullets],
      buttonText: snap.active
        ? `התחילו עם Pro · ${snap.launchPriceLabel}`
        : copy.proCta,
      note: snap.active ? snap.billingNoteHe : copy.proNote(proPrice),
      badge: snap.active ? `${snap.discountPercent}% הנחה` : "הכי משתלם",
      onClick: handlePro,
      isPopular: true,
      priceNode: (
        <div>
          {snap.active ? (
            <LaunchPriceStack size="lg" tone="dark" className="text-start" />
          ) : (
            <p className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-4xl font-bold tracking-tight text-white">
                {proPrice}
              </span>
              <span className="text-sm text-white/50">{copy.perMonth}</span>
            </p>
          )}
          <p className="mt-2 text-xs leading-relaxed text-white/45">
            {copy.underPrice}
          </p>
        </div>
      ),
    },
  ];

  return (
    <section
      id="pricing"
      className={cn(
        "relative scroll-mt-24 overflow-hidden px-4 py-12 sm:px-8 sm:py-14",
        isLanding
          ? "staz-panel"
          : "rounded-3xl border border-black/5 bg-[var(--bg-canvas)]",
        className,
      )}
    >
      <div className="relative mx-auto max-w-4xl">
        <Pricing
          plans={plans}
          title={copy.headline}
          description={copy.subhead}
          showToggle={false}
          tone="stage"
        />
      </div>
    </section>
  );
}
