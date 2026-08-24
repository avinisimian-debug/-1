"use client";

import { Check } from "lucide-react";
import { LANDING } from "@/lib/landing-copy";
import { getProPlanPriceLabel } from "@/lib/constants";
import { LaunchPriceStack } from "@/components/launch/LaunchPriceStack";
import { StazButton } from "@/components/landing/ui/StazButton";
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

  return (
    <section
      id="pricing"
      className={cn(
        "relative scroll-mt-24 overflow-hidden px-4 py-12 sm:px-8 sm:py-14",
        isLanding ? "staz-panel" : "rounded-3xl border border-black/5 bg-[var(--bg-canvas)]",
        className,
      )}
    >
      <div className="relative mx-auto max-w-4xl">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <h2
            className={cn(
              "text-balance tracking-tight",
              isLanding
                ? "font-brand text-2xl text-[var(--staz-ink)] sm:text-3xl"
                : "text-2xl font-bold text-foreground sm:text-3xl",
            )}
          >
            {copy.headline}
          </h2>
          <p
            className={cn(
              "mt-3 text-pretty text-sm sm:text-base",
              isLanding ? "text-[var(--staz-muted)]" : "text-muted-foreground",
            )}
          >
            {copy.subhead}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:items-stretch md:gap-6">
          <div className="flex flex-col rounded-[var(--staz-radius)] border border-[var(--staz-border)] bg-[var(--staz-surface-muted)] p-7 text-start sm:p-8">
            <div className="mb-6">
              <p className="text-xs font-medium text-[var(--staz-muted)]">{copy.freeTag}</p>
              <h3 className="mt-2 text-lg font-semibold text-[var(--staz-ink)]">
                {copy.freeTitle}
              </h3>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-[var(--staz-ink)]">
                  $0
                </span>
              </p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {copy.freeBullets.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-sm leading-relaxed text-[var(--staz-muted)]"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--staz-primary-soft)] text-[var(--staz-primary)]">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                  </span>
                  {line}
                </li>
              ))}
            </ul>

            <StazButton variant="secondary" onClick={onFreeSignup} className="w-full">
              {copy.freeCta}
            </StazButton>
            <p className="mt-3 text-center text-xs text-[var(--staz-muted)]">{copy.freeNote}</p>
          </div>

          <div className="landing-section-forest relative flex flex-col overflow-hidden rounded-[var(--staz-radius)] border-2 border-[color-mix(in_srgb,var(--staz-sage)_45%,transparent)] p-7 text-start shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset] transition duration-300 hover:shadow-[0_18px_50px_-28px_rgba(15,61,46,0.55)] sm:p-8">
            {snap.active ? (
              <span className="absolute end-4 top-4 rounded-full bg-[var(--staz-sage)]/20 px-2.5 py-1 text-[10px] font-bold tracking-[0.1em] text-[var(--staz-sage)]">
                {snap.discountPercent}% OFF
              </span>
            ) : (
              <span className="absolute end-4 top-4 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-[0.1em] text-[var(--staz-on-dark-muted)]">
                BEST VALUE
              </span>
            )}
            <div className="relative mb-6">
              <p className="text-xs font-semibold tracking-[0.14em] text-[color-mix(in_srgb,var(--staz-sage)_90%,white)]">
                PRO
              </p>
              <h3 className="mt-2 text-lg font-semibold text-[var(--staz-on-dark)]">
                {copy.proTitle}
              </h3>
              <p className="mt-2 text-sm text-[var(--staz-on-dark-muted)]">
                {copy.proValue}
              </p>
              <div className="mt-4">
                {snap.active ? (
                  <LaunchPriceStack size="lg" tone="dark" />
                ) : (
                  <p className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-4xl font-bold tracking-tight text-[var(--staz-on-dark)]">
                      {proPrice}
                    </span>
                    <span className="text-sm text-[var(--staz-on-dark-muted)]">
                      {copy.perMonth}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <ul className="relative mb-8 flex-1 space-y-3">
              {copy.proBullets.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-sm leading-relaxed text-[color-mix(in_srgb,var(--staz-on-dark)_88%,transparent)]"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/10 text-[color-mix(in_srgb,var(--staz-sage)_90%,white)]">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                  </span>
                  {line}
                </li>
              ))}
            </ul>

            <StazButton variant="onDark" onClick={handlePro} className="w-full">
              {snap.active
                ? `התחילו PRO · ${snap.launchPriceLabel}`
                : copy.proCta}
            </StazButton>
            <p className="mt-3 text-center text-xs text-[var(--staz-on-dark-muted)]">
              {snap.active ? snap.billingNoteHe : copy.proNote(proPrice)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
