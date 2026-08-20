"use client";

import { Check } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { getProPlanPriceLabel } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LandingPricingProps {
  onFreeSignup: () => void;
  onProSignup?: () => void;
  className?: string;
}

export function LandingPricing({
  onFreeSignup,
  onProSignup,
  className,
}: LandingPricingProps) {
  const { t } = useLocale();
  const proPrice = getProPlanPriceLabel();
  const handlePro = onProSignup ?? onFreeSignup;

  return (
    <section
      id="pricing"
      className={cn(
        "relative overflow-hidden rounded-3xl border border-black/5 bg-[var(--bg-canvas)] px-4 py-14 sm:px-8 sm:py-16",
        className,
      )}
    >
      <div className="relative mx-auto max-w-4xl">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t.landingPricingTitle}
          </h2>
          <p className="mt-3 text-pretty text-sm text-muted-foreground sm:text-base">
            Staz Pro עולה {proPrice} לחודש ושומר את הפגישות שלכם, נותן יותר נפח,
            והופך כל פגישה לסגירה מקצועית שאפשר לשלוח.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:gap-6 md:items-stretch">
          <div className="flex flex-col rounded-2xl border border-border bg-card p-7 text-start sm:p-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                {t.landingPricingFreeTitle}
              </h3>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  $0
                </span>
              </p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {[t.landingPricingFree1, t.landingPricingFree2].map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-sm leading-relaxed text-foreground/90"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  {line}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={onFreeSignup}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold"
            >
              העלו פגישה ראשונה
            </button>
          </div>

          <div className="pricing-glow relative flex flex-col overflow-hidden rounded-2xl bg-[#141816] p-7 text-start text-[#ededea] sm:p-8">
            <div className="relative mb-6">
              <div className="mb-3 inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-white">
                Pro
              </div>
              <h3 className="text-lg font-semibold text-[#ededea]">
                {t.landingPricingProTitle}
              </h3>
              <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
                <span className="text-4xl font-bold tracking-tight text-white">
                  {proPrice}
                </span>
                <span className="text-sm text-[#a8aea8]">לחודש</span>
              </p>
            </div>

            <ul className="relative mb-8 flex-1 space-y-3">
              {[
                t.landingPricingPro1,
                t.landingPricingPro2,
                t.landingPricingPro3,
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-sm leading-relaxed text-[#d5d8d4]"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1f6b5c]/40 text-[#7eb8ab]">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  {line}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={handlePro}
              className="relative w-full rounded-xl bg-[#ededea] px-4 py-3 text-sm font-semibold text-[#0e1210]"
            >
              {t.planUpgrade}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
