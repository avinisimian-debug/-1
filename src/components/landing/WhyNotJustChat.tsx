"use client";

import { LANDING } from "@/lib/landing-copy";
import { LandingChapter } from "@/components/landing/ui/LandingChapter";
import { SectionHeader } from "@/components/landing/ui/SectionHeader";

export function WhyNotJustChat() {
  const copy = LANDING.vsChat;

  return (
    <LandingChapter tone="cool">
      <SectionHeader title={copy.headline} subtitle={copy.body} />
      <ol className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-2 sm:gap-3">
        {copy.flow.map((step, i) => (
          <li key={step} className="flex items-center gap-2 sm:gap-3">
            <span className="rounded-full border border-[var(--staz-border)] bg-[var(--staz-surface)] px-3.5 py-2 text-sm font-medium text-[var(--staz-ink)] shadow-[var(--staz-shadow-soft)]">
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
      <p className="mt-6 text-center text-xs text-[var(--staz-muted)]">{copy.note}</p>
    </LandingChapter>
  );
}
