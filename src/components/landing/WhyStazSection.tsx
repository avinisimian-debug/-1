"use client";

import { LANDING } from "@/lib/landing-copy";
import { LandingChapter } from "@/components/landing/ui/LandingChapter";
import { SectionHeader } from "@/components/landing/ui/SectionHeader";

export function WhyStazSection() {
  const copy = LANDING.why;

  return (
    <LandingChapter tone="cool">
      <SectionHeader
        title={
          <>
            <span className="block">{copy.headline}</span>
            <span className="mt-1 block text-[var(--staz-primary)]">
              {copy.headlineAccent}
            </span>
          </>
        }
        subtitle={copy.body}
      />
      <ol className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-2 sm:gap-3">
        {copy.flow.map((step, i) => (
          <li key={step} className="flex items-center gap-2 sm:gap-3">
            <span className="rounded-full border border-[var(--staz-border)] bg-[var(--staz-surface)] px-4 py-2.5 text-sm font-medium text-[var(--staz-ink)] shadow-[var(--staz-shadow-soft)]">
              {step}
            </span>
            {i < copy.flow.length - 1 ? (
              <span className="text-[var(--staz-primary)]" aria-hidden>
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </LandingChapter>
  );
}
