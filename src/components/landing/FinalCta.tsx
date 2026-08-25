"use client";

import { useMemo } from "react";
import { LANDING, LANDING_CTA } from "@/lib/landing-copy";
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
      <div className="mx-auto max-w-3xl text-center landing-reveal">
        <p className="text-sm tracking-[0.12em] text-[#5eead4]">{copy.line}</p>
        <h2 className="mt-4 font-brand text-3xl tracking-tight text-white sm:text-4xl md:text-[2.75rem]">
          {copy.headline}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg">
          {copy.subhead}
        </p>

        {snap.active ? (
          <div className="landing-offer-glass mx-auto mt-8 max-w-xs rounded-2xl px-5 py-4">
            <LaunchPriceStack size="sm" tone="dark" className="text-center" />
          </div>
        ) : null}

        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <StazButton
            variant="onDark"
            onClick={onSignup}
            className="w-full sm:w-auto"
          >
            {copy.cta}
          </StazButton>
          <StazButton
            variant="ghost"
            onClick={onDemo}
            className="w-full sm:w-auto"
          >
            {copy.secondary}
          </StazButton>
        </div>
        {snap.active ? (
          <button
            type="button"
            onClick={() => {
              trackLaunchEvent("pricing_cta_click", { source: "final_cta" });
              (onLaunchOffer ?? onSignup)();
            }}
            className="mt-4 text-sm text-white/45 underline-offset-4 transition-colors hover:text-white/70 hover:underline"
          >
            או Pro ב־{snap.launchPriceLabel} · {LANDING_CTA.primary}
          </button>
        ) : null}
      </div>
    </LandingChapter>
  );
}
