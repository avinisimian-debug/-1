"use client";

import { useMemo } from "react";
import { LANDING } from "@/lib/landing-copy";
import { StazButton } from "@/components/landing/ui/StazButton";
import { LaunchPriceStack } from "@/components/launch/LaunchPriceStack";
import { LandingProductTheatre } from "@/features/staz-workspace";
import {
  getLaunchCampaignSnapshot,
  trackLaunchEvent,
} from "@/lib/launch-campaign";

type StazHeroProps = {
  onDemo: () => void;
  onSignup: () => void;
  onLaunchOffer?: () => void;
};

export function StazHero({ onDemo, onSignup, onLaunchOffer }: StazHeroProps) {
  const copy = LANDING.hero;
  const snap = useMemo(() => getLaunchCampaignSnapshot(), []);

  return (
    <section className="landing-hero relative overflow-hidden pb-6 pt-8 sm:pb-10 sm:pt-12">
      <div className="landing-hero-glow pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="landing-hero-copy mx-auto max-w-3xl text-center">
          <p className="font-brand text-3xl tracking-[0.22em] text-[var(--staz-ink)] sm:text-4xl md:text-[2.75rem]">
            {copy.brand}
          </p>
          <p className="mt-3 text-[13px] font-medium tracking-[0.08em] text-[var(--staz-primary)]">
            {copy.positioning}
          </p>
          <h1 className="mt-5 text-balance font-brand text-[1.85rem] leading-[1.18] tracking-tight text-[var(--staz-ink)] sm:mt-6 sm:text-[2.65rem] md:text-[3.15rem] md:leading-[1.08]">
            <span className="block">{copy.headlineLine1}</span>
            <span className="mt-1 block text-[color-mix(in_srgb,var(--staz-ink)_68%,var(--staz-muted))]">
              {copy.headlineLine2}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-[0.95rem] leading-[1.65] text-[var(--staz-muted)] sm:text-lg">
            {copy.subhead}
          </p>

          {snap.active ? (
            <div className="mx-auto mt-6 max-w-sm rounded-[var(--staz-radius)] border border-[var(--staz-border)] bg-white/80 px-5 py-4 text-center shadow-[var(--staz-shadow-soft)]">
              <p className="text-[11px] font-semibold tracking-[0.12em] text-[var(--staz-primary)]">
                LAUNCH MONTH
              </p>
              <div className="mt-2 flex justify-center">
                <LaunchPriceStack size="md" className="!text-center [&]:items-center" />
              </div>
            </div>
          ) : null}

          <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center">
            {snap.active ? (
              <StazButton
                onClick={() => {
                  trackLaunchEvent("pricing_cta_click", { source: "hero" });
                  (onLaunchOffer ?? onSignup)();
                }}
                className="w-full sm:min-w-[12rem] sm:w-auto"
              >
                קבלו PRO ב־{snap.launchPriceLabel}
              </StazButton>
            ) : (
              <StazButton onClick={onDemo} className="w-full sm:min-w-[12rem] sm:w-auto">
                {copy.primaryCta}
              </StazButton>
            )}
            <StazButton
              variant="secondary"
              onClick={snap.active ? onDemo : onSignup}
              className="w-full sm:w-auto"
            >
              {snap.active ? copy.primaryCta : copy.secondaryCta}
            </StazButton>
          </div>
          <p className="mt-4 text-sm text-[color-mix(in_srgb,var(--staz-muted)_80%,transparent)]">
            {copy.trustLine}
          </p>
        </div>
      </div>

      <div className="landing-hero-stage relative z-10 mx-auto mt-10 w-full max-w-[72rem] px-3 sm:mt-14 sm:px-6 lg:px-8">
        <LandingProductTheatre />
      </div>
    </section>
  );
}
