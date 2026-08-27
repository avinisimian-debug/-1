"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Logo } from "@/components/brand/Logo";
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

/** Staz brand-first hero — cinema plane + product theatre. */
export function StazHero({ onDemo, onSignup, onLaunchOffer }: StazHeroProps) {
  const copy = LANDING.hero;
  const snap = useMemo(() => getLaunchCampaignSnapshot(), []);

  return (
    <>
      <section
        id="home-hero"
        className="landing-hero relative isolate min-h-[100svh] scroll-mt-24 overflow-hidden"
      >
        <div className="absolute inset-0" aria-hidden>
          <Image
            src="/marketing/staz-hero-cinema.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="landing-hero-media object-cover object-center"
          />
          <div className="landing-hero-scrim absolute inset-0" />
          <div className="landing-hero-glow pointer-events-none absolute inset-0 opacity-70" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center px-4 pb-20 pt-24 sm:px-6 sm:pb-24 sm:pt-28">
          <div className="landing-hero-copy mx-auto max-w-3xl text-center">
            <div className="flex justify-center">
              <Logo size="xl" tone="dark" href={null} />
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5eead4] sm:text-[12px]">
              {copy.positioning}
            </p>

            <h1 className="mt-7 text-balance font-brand text-[1.85rem] leading-[1.15] tracking-tight text-white sm:mt-8 sm:text-[2.75rem] md:text-[3.25rem] md:leading-[1.08]">
              <span className="block">{copy.headlineLine1}</span>
              <span className="mt-3 block text-[1.35rem] leading-snug text-white/70 sm:mt-4 sm:text-[1.85rem] md:text-[2.15rem]">
                {copy.headlineLine2}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-pretty text-[0.95rem] leading-[1.7] text-white/60 sm:text-lg">
              {copy.subhead}
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-relaxed text-[#5eead4]/90 sm:text-base">
              {copy.promise}
            </p>

            {snap.active ? (
              <div className="landing-offer-glass landing-reveal mx-auto mt-7 max-w-sm rounded-2xl px-5 py-4 text-center">
                <p className="text-[11px] font-semibold tracking-wide text-[#5eead4]">
                  חודש השקה
                </p>
                <div className="mt-2.5 flex justify-center">
                  <LaunchPriceStack size="md" tone="dark" className="text-center" />
                </div>
              </div>
            ) : null}

            <div className="mt-9 flex flex-col items-stretch justify-center gap-2.5 sm:mt-10 sm:flex-row sm:items-center sm:gap-3">
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

          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center sm:bottom-8">
            <span
              className="landing-scroll-cue h-8 w-px bg-gradient-to-b from-teal-300/0 via-teal-300/70 to-teal-300/0"
              aria-hidden
            />
          </div>
        </div>
      </section>

      <section
        className="relative z-10 -mt-6 bg-gradient-to-b from-transparent via-[#05080a] to-[#05080a] pb-6 sm:-mt-10 sm:pb-10"
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
