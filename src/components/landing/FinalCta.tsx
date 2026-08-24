"use client";

import { useMemo } from "react";
import { LANDING } from "@/lib/landing-copy";
import { StazButton } from "@/components/landing/ui/StazButton";
import { LandingChapter } from "@/components/landing/ui/LandingChapter";
import { LaunchPriceStack } from "@/components/launch/LaunchPriceStack";
import {
  getLaunchCampaignSnapshot,
  trackLaunchEvent,
} from "@/lib/launch-campaign";

type FinalCtaProps = {
  onDemo: () => void;
  onSignup: () => void;
  onLaunchOffer?: () => void;
};

export function FinalCta({ onDemo, onSignup, onLaunchOffer }: FinalCtaProps) {
  const copy = LANDING.final;
  const snap = useMemo(() => getLaunchCampaignSnapshot(), []);

  return (
    <LandingChapter tone="forest">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm text-[color-mix(in_srgb,var(--staz-sage)_90%,white)]">
          {copy.line}
        </p>
        <h2 className="mt-4 font-brand text-3xl tracking-tight text-[var(--staz-on-dark)] sm:text-4xl">
          {copy.headline}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-[var(--staz-on-dark-muted)] sm:text-lg">
          {copy.subhead}
        </p>

        {snap.active ? (
          <div className="mx-auto mt-6 max-w-xs rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <LaunchPriceStack size="sm" tone="dark" className="text-center [&]:items-center" />
          </div>
        ) : null}

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          {snap.active ? (
            <StazButton
              variant="onDark"
              onClick={() => {
                trackLaunchEvent("pricing_cta_click", { source: "final_cta" });
                (onLaunchOffer ?? onSignup)();
              }}
              className="w-full sm:w-auto"
            >
              קבלו PRO ב־{snap.launchPriceLabel}
            </StazButton>
          ) : (
            <StazButton variant="onDark" onClick={onDemo} className="w-full sm:w-auto">
              {copy.cta}
            </StazButton>
          )}
          <StazButton
            variant="ghost"
            onClick={snap.active ? onDemo : onSignup}
            className="w-full sm:w-auto"
          >
            {snap.active ? copy.cta : copy.secondary}
          </StazButton>
        </div>
      </div>
    </LandingChapter>
  );
}
