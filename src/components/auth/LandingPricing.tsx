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
          <div className="landing-reveal flex flex-col rounded-[var(--staz-radius)] border border-white/10 bg-white/[0.03] p-7 text-start backdrop-blur-sm transition duration-300 hover:border-white/18 hover:bg-white/[0.05] sm:p-8">
            <div className="mb-6">
              <p className="text-xs font-medium text-white/45">{copy.freeTag}</p>
              <h3 className="mt-2 text-lg font-semibold text-white">
                {copy.freeTitle}
              </h3>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-white">
                  $0
                </span>
              </p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {copy.freeBullets.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-sm leading-relaxed text-white/55"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-teal-400/10 text-[#5eead4]">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                  </span>
                  {line}
                </li>
              ))}
            </ul>

            <StazButton variant="secondary" onClick={onFreeSignup} className="w-full">
              {copy.freeCta}
            </StazButton>
            <p className="mt-3 text-center text-xs text-white/40">{copy.freeNote}</p>
          </div>

          <div className="landing-reveal landing-section-forest relative flex flex-col overflow-hidden rounded-[var(--staz-radius)] border border-teal-400/25 p-7 text-start shadow-[0_0_60px_-24px_rgba(45,212,191,0.45)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_80px_-20px_rgba(45,212,191,0.55)] sm:p-8" style={{ animationDelay: "80ms" }}>
            {snap.active ? (
              <span className="absolute end-4 top-4 rounded-full border border-teal-400/30 bg-teal-400/10 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-[#5eead4]">
                {snap.discountPercent}% OFF
              </span>
            ) : (
              <span className="absolute end-4 top-4 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-white/60">
                BEST VALUE
              </span>
            )}
            <div className="relative mb-6">
              <p className="text-xs font-semibold tracking-[0.18em] text-[#5eead4]">
                PRO
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">
                {copy.proTitle}
              </h3>
              <p className="mt-2 text-sm text-white/55">
                {copy.proValue}
              </p>
              <div className="mt-4">
                {snap.active ? (
                  <LaunchPriceStack size="lg" tone="dark" className="text-start" />
                ) : (
                  <p className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-4xl font-bold tracking-tight text-white">
                      {proPrice}
                    </span>
                    <span className="text-sm text-white/50">
                      {copy.perMonth}
                    </span>
                  </p>
                )}
                <p className="mt-2 text-xs leading-relaxed text-white/45">
                  {copy.underPrice}
                </p>
              </div>
            </div>

            <ul className="relative mb-8 flex-1 space-y-3">
              {copy.proBullets.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-sm leading-relaxed text-white/75"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/10 text-[#5eead4]">
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
            <p className="mt-3 text-center text-xs text-white/45">
              {snap.active ? snap.billingNoteHe : copy.proNote(proPrice)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
