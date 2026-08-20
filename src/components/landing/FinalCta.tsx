"use client";

import { LANDING } from "@/lib/landing-copy";

type FinalCtaProps = {
  onDemo: () => void;
  onSignup: () => void;
};

export function FinalCta({ onDemo, onSignup }: FinalCtaProps) {
  const copy = LANDING.final;

  return (
    <section className="mx-auto mt-24 max-w-3xl px-2 text-center sm:mt-28">
      <p className="text-sm text-[var(--staz-green-soft)]">{copy.line}</p>
      <h2 className="mt-4 font-brand text-3xl tracking-tight text-[var(--staz-text)] sm:text-4xl">
        {copy.headline}
      </h2>
      <p className="mt-3 text-lg text-[var(--staz-muted)]">{copy.subhead}</p>
      <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <button type="button" onClick={onDemo} className="staz-btn-primary w-full sm:w-auto">
          {copy.cta}
        </button>
        <button type="button" onClick={onSignup} className="staz-btn-secondary w-full sm:w-auto">
          {copy.secondary}
        </button>
      </div>
    </section>
  );
}
