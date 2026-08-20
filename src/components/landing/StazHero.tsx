"use client";

import { LANDING } from "@/lib/landing-copy";
import { LandingProductTheatre } from "@/features/staz-workspace";

type StazHeroProps = {
  onDemo: () => void;
  onSignup: () => void;
};

export function StazHero({ onDemo, onSignup }: StazHeroProps) {
  const copy = LANDING.hero;

  return (
    <section className="landing-hero relative overflow-hidden pt-12 sm:pt-16">
      <div className="landing-hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="landing-hero-copy mx-auto max-w-3xl text-center">
          <p className="text-[13px] font-medium tracking-[0.08em] text-[var(--staz-green-soft)]">
            {copy.eyebrow}
          </p>
          <h1 className="mt-5 text-balance font-brand text-[2rem] leading-[1.12] tracking-tight text-[var(--staz-text)] sm:text-5xl md:text-[3.15rem] md:leading-[1.08]">
            <span className="block">{copy.headlineLine1}</span>
            <span className="mt-1 block text-[color-mix(in_srgb,var(--staz-text)_78%,var(--staz-muted))]">
              {copy.headlineLine2}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-[var(--staz-muted)] sm:text-lg">
            {copy.subhead}
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onDemo}
              className="staz-btn-primary w-full sm:min-w-[12rem] sm:w-auto"
            >
              {copy.primaryCta}
            </button>
            <button
              type="button"
              onClick={onSignup}
              className="staz-btn-secondary w-full sm:w-auto"
            >
              {copy.secondaryCta}
            </button>
          </div>
          <p className="mt-4 text-sm text-[color-mix(in_srgb,var(--staz-muted)_75%,transparent)]">
            {copy.trustLine}
          </p>
        </div>
      </div>

      <div className="landing-hero-stage relative z-10 mx-auto mt-12 w-full max-w-5xl px-4 sm:mt-14 sm:px-6">
        <div className="pointer-events-none absolute inset-x-8 -bottom-6 top-10 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgba(31,107,92,0.28),transparent_70%)] blur-2xl" aria-hidden />
        <LandingProductTheatre variant="hero" />
      </div>
    </section>
  );
}
