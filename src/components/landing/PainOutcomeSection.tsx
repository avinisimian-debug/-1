"use client";

import { LANDING } from "@/lib/landing-copy";

export function PainOutcomeSection() {
  const copy = LANDING.pain;

  return (
    <section
      className="mx-auto mt-20 max-w-4xl sm:mt-24"
      aria-labelledby="pain-heading"
    >
      <h2
        id="pain-heading"
        className="text-center font-brand text-2xl tracking-tight text-[var(--staz-text)] sm:text-3xl"
      >
        {copy.headline}
      </h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="staz-panel p-6 sm:p-7">
          <p className="text-xs font-medium tracking-[0.12em] text-[var(--staz-muted)]">
            {copy.beforeTitle}
          </p>
          <ul className="mt-4 space-y-3">
            {copy.before.map((line) => (
              <li key={line} className="text-sm leading-relaxed text-[color-mix(in_srgb,var(--staz-muted)_85%,transparent)]">
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--staz-green)_45%,transparent)] bg-[color-mix(in_srgb,var(--staz-surface)_80%,#0e1512)] p-6 sm:p-7">
          <p className="text-xs font-medium tracking-[0.12em] text-[var(--staz-green-soft)]">
            {copy.afterTitle}
          </p>
          <ul className="mt-4 space-y-3">
            {copy.after.map((line) => (
              <li key={line} className="text-sm font-medium leading-relaxed text-[var(--staz-text)]">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
