"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import {
  PRO_PLAN_SALE_PRICE,
  isProSaleActive,
} from "@/lib/constants";
import {
  type BillingInterval,
  type PricingTierId,
  TIER_PRICING,
  appPlanToPricingTier,
  formatPrice,
  getDisplayPrice,
  YEARLY_DISCOUNT_PERCENT,
} from "@/lib/pricing-tiers";
import type { Translations } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

interface PricingTableProps {
  currentPlan: "free" | "pro";
  onSelectPro?: () => void;
  onSelectBasic?: () => void;
  className?: string;
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
  {
    id: "enterprise",
    nameKey: "pricingEnterpriseName",
    descKey: "pricingEnterpriseDesc",
    outcomeKeys: [
      "pricingEnterpriseOutcome1",
      "pricingEnterpriseOutcome2",
      "pricingEnterpriseOutcome3",
    ],
    ctaKey: "pricingEnterpriseCta",
  },
];

function AnimatedPrice({
  value,
  interval,
  className,
}: {
  value: number;
  interval: BillingInterval;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (value === display) return;
    setAnimating(true);
    const timeout = setTimeout(() => {
      setDisplay(value);
      setAnimating(false);
    }, 150);
    return () => clearTimeout(timeout);
  }, [value, display]);

  return (
    <span
      className={cn(
        "inline-block tabular-nums transition-all duration-300",
        animating && "scale-95 opacity-0",
        !animating && "scale-100 opacity-100",
        className,
      )}
    >
      {formatPrice(display)}
      {interval === "yearly" && display > 0 && (
        <span className="text-sm font-normal text-zinc-500">/yr</span>
      )}
      {interval === "monthly" && (
        <span className="text-sm font-normal text-zinc-500">/mo</span>
      )}
    </span>
  );
}

function BillingToggle({
  interval,
  onChange,
  t,
}: {
  interval: BillingInterval;
  onChange: (v: BillingInterval) => void;
  t: Translations;
}) {
  const yearly = interval === "yearly";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-100 p-1">
        <button
          type="button"
          onClick={() => onChange("monthly")}
          className={cn(
            "rounded px-4 py-1.5 text-sm font-medium transition-all",
            !yearly
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-700",
          )}
        >
          {t.pricingMonthly}
        </button>
        <button
          type="button"
          onClick={() => onChange("yearly")}
          className={cn(
            "rounded px-4 py-1.5 text-sm font-medium transition-all",
            yearly
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-700",
          )}
        >
          {t.pricingYearly}
        </button>
      </div>
      <span
        className={cn(
          "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-all duration-500",
          yearly
            ? "discount-badge-active border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-transparent text-transparent",
        )}
      >
        {t.pricingYearlySave.replace("{percent}", String(YEARLY_DISCOUNT_PERCENT))}
      </span>
    </div>
  );
}

export function PricingTable({
  currentPlan,
  onSelectPro,
  onSelectBasic,
  className,
}: PricingTableProps) {
  const { t } = useLocale();
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const activeTier = appPlanToPricingTier(currentPlan);
  const proOnSale = isProSaleActive();

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          {t.pricingTitle}
        </h2>
        <p className="mt-2 text-sm text-zinc-500">{t.pricingSubtitle}</p>
        <div className="mt-6">
          <BillingToggle interval={interval} onChange={setInterval} t={t} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {TIERS.map((tier) => {
          const isPopular = tier.popular;
          const isCurrent = tier.id === activeTier;
          const saleMonthly =
            tier.id === "pro" && proOnSale && interval === "monthly"
              ? parseFloat(PRO_PLAN_SALE_PRICE)
              : undefined;

          const { amount, perMonth, savingsPercent } = getDisplayPrice(
            tier.id,
            interval,
            { proSaleMonthly: saleMonthly },
          );

          const showStrike =
            tier.id === "pro" &&
            proOnSale &&
            interval === "monthly" &&
            saleMonthly != null;

          return (
            <div
              key={tier.id}
              className={cn(
                "relative flex flex-col rounded-lg border bg-white p-6 transition-shadow",
                isPopular
                  ? "pricing-glow border-indigo-200 shadow-md lg:scale-[1.02] lg:-my-1"
                  : "border-zinc-200 shadow-sm",
                isCurrent && !isPopular && "ring-1 ring-zinc-300",
              )}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
                    <Sparkles className="h-3 w-3" />
                    {t.pricingMostPopular}
                  </span>
                </div>
              )}

              {isCurrent && (
                <span className="absolute end-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-3 w-3 text-emerald-700" />
                </span>
              )}

              <div className="mb-5">
                <h3 className="text-base font-semibold text-zinc-900">
                  {t[tier.nameKey] as string}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  {t[tier.descKey] as string}
                </p>
              </div>

              <div className="mb-1 min-h-[3.5rem]">
                {showStrike && (
                  <p className="text-sm text-zinc-400 line-through">
                    {formatPrice(TIER_PRICING.pro.monthly)}/mo
                  </p>
                )}
                <p className="text-3xl font-semibold text-zinc-900">
                  <AnimatedPrice value={amount} interval={interval} />
                </p>
                {interval === "yearly" && amount > 0 && (
                  <p className="mt-1 text-xs text-zinc-500">
                    {formatPrice(perMonth)}
                    {t.pricingPerMonthEquiv}
                    {savingsPercent > 0 && (
                      <span className="ms-1 font-medium text-emerald-600">
                        · {t.pricingSavePercent.replace("{percent}", String(savingsPercent))}
                      </span>
                    )}
                  </p>
                )}
                {tier.id === "pro" && proOnSale && interval === "monthly" && (
                  <p className="mt-1 text-xs font-medium text-indigo-600">
                    {t.saleFirstMonth}
                  </p>
                )}
              </div>

              <ul className="mb-6 flex-1 space-y-3 border-t border-zinc-100 pt-5">
                {tier.outcomeKeys.map((key) => (
                  <li key={key} className="flex gap-2.5 text-sm leading-snug text-zinc-600">
                    <Check
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        isPopular ? "text-indigo-600" : "text-zinc-400",
                      )}
                    />
                    {t[key] as string}
                  </li>
                ))}
              </ul>

              {tier.id === "enterprise" ? (
                <a
                  href="mailto:sales@staz.ai?subject=Enterprise%20Plan"
                  className={cn(
                    "inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors",
                    "btn-secondary",
                  )}
                >
                  {t[tier.ctaKey] as string}
                  <ArrowRight className="h-4 w-4" />
                </a>
              ) : tier.id === "pro" ? (
                <button
                  type="button"
                  onClick={onSelectPro}
                  disabled={isCurrent}
                  className={cn(
                    "inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-default disabled:opacity-60",
                    isPopular ? "btn-cinema" : "btn-secondary",
                  )}
                >
                  {isCurrent ? t.pricingCurrentPlan : (t[tier.ctaKey] as string)}
                  {!isCurrent && <ArrowRight className="h-4 w-4" />}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSelectBasic}
                  disabled={isCurrent}
                  className="btn-secondary inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium disabled:cursor-default disabled:opacity-60"
                >
                  {isCurrent ? t.pricingCurrentPlan : (t[tier.ctaKey] as string)}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
