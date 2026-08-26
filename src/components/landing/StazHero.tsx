"use client";

import { useMemo } from "react";
import { LANDING } from "@/lib/landing-copy";
import { StazButton } from "@/components/landing/ui/StazButton";
import { LaunchPriceStack } from "@/components/launch/LaunchPriceStack";
import { LandingProductTheatre } from "@/features/staz-workspace";
import HeroSection from "@/components/ui/glassmorphism-trust-hero";
import {
  getLaunchCampaignSnapshot,
  trackLaunchEvent,
} from "@/lib/launch-campaign";

type StazHeroProps = {
  onDemo: () => void;
  onSignup: () => void;
  onLaunchOffer?: () => void;
};

/**
 * First viewport uses the glassmorphism-trust-hero design command as-is,
 * then Staz product CTAs + theatre below.
 */
export function StazHero({ onDemo, onSignup, onLaunchOffer }: StazHeroProps) {
  const copy = LANDING.hero;
  const snap = useMemo(() => getLaunchCampaignSnapshot(), []);

  return (
    <>
      <div id="home-hero" className="relative scroll-mt-24">
        <HeroSection />
      </div>

      <section className="relative z-10 border-t border-white/10 bg-zinc-950 px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5eead4]">
            {copy.positioning}
          </p>
          <h2 className="mt-4 font-brand text-2xl tracking-tight text-white sm:text-3xl">
            {copy.headlineLine1}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            {copy.promise}
          </p>

          {snap.active ? (
            <div className="mt-6 w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
              <p className="text-[11px] font-semibold tracking-wide text-[#5eead4]">
                חודש השקה
              </p>
              <div className="mt-2.5 flex justify-center">
                <LaunchPriceStack size="md" tone="dark" className="text-center" />
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center sm:gap-3">
            <StazButton
              onClick={onSignup}
              className="w-full sm:min-w-[16rem] sm:w-auto"
            >
              {copy.primaryCta}
            </StazButton>
            <StazButton
              variant="secondary"
              onClick={onDemo}
              className="w-full opacity-95 sm:w-auto"
            >
              {copy.secondaryCta}
            </StazButton>
          </div>
          {snap.active ? (
            <button
              type="button"
              onClick={() => {
                trackLaunchEvent("pricing_cta_click", { source: "hero" });
                (onLaunchOffer ?? onSignup)();
              }}
              className="mt-4 text-sm text-white/45 underline-offset-4 transition-colors hover:text-white/70 hover:underline"
            >
              או חודש השקה · Pro ב־{snap.launchPriceLabel}
            </button>
          ) : null}
          <p className="mt-4 text-xs leading-relaxed text-white/40 sm:text-sm">
            {copy.trustLine}
          </p>
        </div>
      </section>

      <section
        className="relative z-10 bg-zinc-950 pb-6 sm:pb-10"
        aria-label="תצוגת מוצר"
      >
        <div className="landing-hero-stage relative mx-auto w-full max-w-[72rem] px-3 sm:px-6 lg:px-8">
          <div
            className="pointer-events-none absolute inset-x-[10%] -top-6 h-28 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.28),transparent_70%)] blur-2xl"
            aria-hidden
          />
          <LandingProductTheatre />
        </div>
      </section>
    </>
  );
}
