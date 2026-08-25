"use client";

import { LANDING } from "@/lib/landing-copy";
import { LandingChapter } from "@/components/landing/ui/LandingChapter";
import { SectionHeader } from "@/components/landing/ui/SectionHeader";

export function DayInLifeSection() {
  const copy = LANDING.dayInLife;

  return (
    <LandingChapter tone="product">
      <SectionHeader title={copy.headline} subtitle={copy.subhead} />

      <ol className="mx-auto mt-12 max-w-2xl space-y-0">
        {copy.steps.map((step, i) => (
          <li key={step.time} className="flex gap-4 sm:gap-5">
            <div className="flex flex-col items-center">
              <span className="font-mono-time text-xs font-medium text-[var(--staz-primary)] sm:text-sm">
                {step.time}
              </span>
              {i < copy.steps.length - 1 ? (
                <span
                  className="mt-2 h-full min-h-[2rem] w-px flex-1 bg-[color-mix(in_srgb,var(--staz-primary)_30%,transparent)]"
                  aria-hidden
                />
              ) : null}
            </div>
            <div className="pb-8">
              <p className="font-brand text-lg text-[var(--staz-ink)]">{step.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--staz-muted)]">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </LandingChapter>
  );
}
