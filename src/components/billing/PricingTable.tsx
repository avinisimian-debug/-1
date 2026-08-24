"use client";

import { Check, ArrowRight } from "lucide-react";
import { LaunchPriceStack } from "@/components/launch/LaunchPriceStack";
import { useLocale } from "@/context/LocaleContext";
import { getProPlanPriceLabel } from "@/lib/constants";
import {
  getLaunchCampaignSnapshot,
  trackLaunchEvent,
} from "@/lib/launch-campaign";
import {
  type PricingTierId,
  appPlanToPricingTier,
  formatPrice,
  getDisplayPrice,
} from "@/lib/pricing-tiers";
import type { Translations } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

interface PricingTableProps {
  currentPlan: "free" | "pro";
  onSelectPro?: () => void;
  onSelectBasic?: () => void;
  className?: string;
  landing?: boolean;
  onLandingSignup?: () => void;
}

type TierConfig = {
  id: PricingTierId;
  nameKey: keyof Translations;
  descKey: keyof Translations;
  outcomeKeys: [keyof Translations, keyof Translations, keyof Translations];
  ctaKey: keyof Translations;
  popular?: boolean;
};

const TIERS: TierConfig[] = [
  {
    id: "basic",
    nameKey: "pricingBasicName",
    descKey: "pricingBasicDesc",
    outcomeKeys: [
      "pricingBasicOutcome1",
      "pricingBasicOutcome2",
      "pricingBasicOutcome3",
    ],
    ctaKey: "pricingBasicCta",
  },
  {
    id: "pro",
    nameKey: "pricingProName",
    descKey: "pricingProDesc",
    outcomeKeys: [
      "pricingProOutcome1",
      "pricingProOutcome2",
      "pricingProOutcome3",
    ],
    ctaKey: "pricingProCta",
    popular: true,
  },
];

export function PricingTable({
  currentPlan,
  onSelectPro,
  onSelectBasic,
  className,
  landing = false,
  onLandingSignup,
}: PricingTableProps) {
  const { t } = useLocale();
  const activeTier = landing ? null : appPlanToPricingTier(currentPlan);
  const snap = getLaunchCampaignSnapshot();
  const proLabel = getProPlanPriceLabel();

  const handleBasicCta = () => {
    if (landing) onLandingSignup?.();
    else onSelectBasic?.();
  };

  const handleProCta = () => {
    trackLaunchEvent("pricing_cta_click", { source: "pricing_table" });
    if (landing) onLandingSignup?.();
    else onSelectPro?.();
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {t.pricingTitle}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{t.pricingSubtitle}</p>
        <p className="mt-3 text-sm font-medium text-foreground">
          {snap.active
            ? `חודש ההשקה: Pro ב־${proLabel} (במקום ${snap.originalPriceLabel})`
            : `Staz Pro הוא ${proLabel} לחודש: ספריית פגישות בענן, יותר נפח, וסגירה מקצועית שאפשר לשלוח.`}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {TIERS.map((tier) => {
          const isPopular = tier.popular;
          const isCurrent = !landing && tier.id === activeTier;
          const { amount } = getDisplayPrice(tier.id);

          return (
            <div
              key={tier.id}
              className={cn(
                "relative flex flex-col rounded-xl border bg-card p-6",
                isPopular ? "border-accent/30" : "border-border",
                isCurrent && "ring-1 ring-border",
              )}
            >
              {tier.id === "pro" && snap.active ? (
                <span className="absolute end-4 top-4 rounded-full bg-accent-muted px-2 py-0.5 text-[10px] font-bold tracking-wide text-accent">
                  LAUNCH · {snap.discountPercent}% OFF
                </span>
              ) : null}
              <div className="mb-5">
                <h3 className="text-base font-semibold text-foreground">
                  {t[tier.nameKey] as string}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {t[tier.descKey] as string}
                </p>
              </div>

              {tier.id === "pro" && snap.active ? (
                <div className="mb-4">
                  <LaunchPriceStack size="md" />
                </div>
              ) : (
                <p className="mb-1 text-3xl font-semibold text-foreground">
                  {formatPrice(amount)}
                  {tier.id === "pro" ? (
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}
                      / mo
                    </span>
                  ) : null}
                </p>
              )}

              <ul className="mb-6 flex-1 space-y-3 border-t border-border/60 pt-5">
                {tier.outcomeKeys.map((key) => (
                  <li
                    key={key}
                    className="flex gap-2.5 text-sm leading-snug text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {t[key] as string}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={tier.id === "pro" ? handleProCta : handleBasicCta}
                disabled={isCurrent}
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium disabled:opacity-60",
                  isPopular ? "btn-cinema" : "btn-secondary",
                )}
              >
                {isCurrent
                  ? t.pricingCurrentPlan
                  : tier.id === "pro" && snap.active
                    ? `התחילו PRO · ${proLabel}`
                    : (t[tier.ctaKey] as string)}
                {!isCurrent && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
