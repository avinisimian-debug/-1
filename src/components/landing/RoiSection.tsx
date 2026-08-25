"use client";

import { LANDING } from "@/lib/landing-copy";
import { LandingChapter } from "@/components/landing/ui/LandingChapter";
import { SectionHeader } from "@/components/landing/ui/SectionHeader";

/** Credible cost-of-lost-information story — no invented dollar savings. */
export function RoiSection() {
  const copy = LANDING.roi;

  return (
    <LandingChapter tone="cool">
      <SectionHeader title={copy.headline} subtitle={copy.subhead} />

      <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-3 sm:gap-4">
        {copy.factors.map((factor, i) => (
          <div key={factor.label} className="flex items-center gap-3 sm:gap-4">
            <div className="rounded-[var(--staz-radius)] border border-[var(--staz-border)] bg-[var(--staz-surface)] px-5 py-4 text-center shadow-[var(--staz-shadow-soft)]">
              <p className="font-brand text-xl text-[var(--staz-ink)] sm:text-2xl">
                {factor.value}
              </p>
              <p className="mt-1.5 text-[11px] text-[var(--staz-muted)] sm:text-xs">
                {factor.label}
              </p>
            </div>
            {i < copy.factors.length - 1 ? (
              <span className="hidden text-[var(--staz-primary)] sm:inline" aria-hidden>
                →
              </span>
            ) : null}
          </div>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-base leading-relaxed text-[var(--staz-ink)]">
        {copy.result}
      </p>

      <ul className="mx-auto mt-8 grid max-w-3xl gap-2 sm:grid-cols-2">
        {copy.helps.map((line) => (
          <li
            key={line}
            className="rounded-xl border border-[var(--staz-border)] bg-[var(--staz-surface)] px-4 py-3 text-sm text-[var(--staz-muted)]"
          >
            {line}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-center text-xs text-[var(--staz-muted)]">{copy.note}</p>
    </LandingChapter>
  );
}
