"use client";

import { Check } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import {
  getProLifetimePriceLabel,
  isLaunchWeekActive,
  PRO_LIFETIME_PRICE_LABEL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LandingPricingProps {
  onFreeSignup: () => void;
  /** Logged-out Pro CTA should lead to signup, not gated /settings */
  onProSignup?: () => void;
  className?: string;
}

export function LandingPricing({
  onFreeSignup,
  onProSignup,
  className,
}: LandingPricingProps) {
  const { t } = useLocale();
  const proPrice = getProLifetimePriceLabel();
  const showLaunch = isLaunchWeekActive();
  const handlePro = onProSignup ?? onFreeSignup;

  return (
    <section
      id="pricing"
      className={cn(
        "relative overflow-hidden border-y border-border/60 bg-muted/40 px-4 py-16 sm:py-20",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t.landingPricingTitle}
          </h2>
          <p className="mt-3 text-pretty text-sm text-muted-foreground sm:text-base">
            {t.landingPricingEnterprise}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:gap-6 md:items-stretch">
          {/* Free */}
          <div
            className={cn(
              "flex flex-col rounded-2xl border border-border bg-card p-7 text-start shadow-sm",
              "transition-transform duration-300 hover:-translate-y-0.5 sm:p-8",
            )}
          >
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
                  className="flex items-start gap-3 text-sm leading-relaxed text-foreground/90 sm:text-[0.9375rem]"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                  </span>
                  {line}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={onFreeSignup}
              className={cn(
                "w-full rounded-xl border border-border bg-background px-4 py-3",
                "text-sm font-semibold text-foreground",
                "transition-colors hover:bg-muted focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              {t.authSubmit}
            </button>
          </div>

          {/* Pro — featured */}
          <div
            className={cn(
              "pricing-glow relative flex flex-col overflow-hidden rounded-2xl p-7 text-start sm:p-8",
              "bg-zinc-950 text-zinc-50 shadow-xl shadow-zinc-950/25",
              "ring-1 ring-accent/40 transition-transform duration-300 hover:-translate-y-0.5",
              "dark:bg-zinc-900 dark:ring-accent/50",
            )}
          >
            <div
              className="pointer-events-none absolute -end-16 -top-16 h-40 w-40 rounded-full bg-accent/30 blur-3xl"
              aria-hidden
            />

            <div className="relative mb-6">
              <div className="mb-3 inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-white dark:text-zinc-950">
                Pro
              </div>
              <h3 className="text-lg font-semibold text-zinc-50">
                {t.landingPricingProTitle}
              </h3>
              <p className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-4xl font-bold tracking-tight text-white">
                  {proPrice}
                </span>
                {showLaunch && (
                  <span className="text-sm text-zinc-400 line-through">
                    {PRO_LIFETIME_PRICE_LABEL}
                  </span>
                )}
              </p>
              {showLaunch && (
                <p className="mt-1 text-xs font-medium text-accent">
                  {t.pricingProLaunchNote.replace("{intro}", proPrice)}
                </p>
              )}
            </div>

            <ul className="relative mb-8 flex-1 space-y-3">
              {[
                t.landingPricingPro1,
                t.landingPricingPro2,
                t.landingPricingPro3,
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-sm leading-relaxed text-zinc-200 sm:text-[0.9375rem]"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/25 text-accent">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                  </span>
                  {line}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={handlePro}
              className={cn(
                "relative w-full rounded-xl bg-white px-4 py-3",
                "text-sm font-semibold text-zinc-950",
                "shadow-md transition-all hover:bg-zinc-100 hover:shadow-lg",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80",
                "active:scale-[0.99]",
              )}
            >
              {t.planUpgrade}
            </button>
          </div>
        </div>

        <p className="relative mt-10 text-center text-sm text-muted-foreground">
          <a
            href="mailto:sales@staz.ai?subject=Enterprise%20Plan"
            className="font-medium text-foreground underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            sales@staz.ai
          </a>
        </p>
      </div>
    </section>
  );
}
