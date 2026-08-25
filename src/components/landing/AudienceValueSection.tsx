"use client";

import { LANDING } from "@/lib/landing-copy";
import { LandingChapter } from "@/components/landing/ui/LandingChapter";
import { SectionHeader } from "@/components/landing/ui/SectionHeader";

export function AudienceValueSection() {
  const audience = LANDING.audience;
  const value = LANDING.value;

  return (
    <LandingChapter tone="quiet" id="audience" className="scroll-mt-24">
      <SectionHeader title={audience.headline} />

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {audience.personas.map((persona) => (
          <article
            key={persona.role}
            className="rounded-[var(--staz-radius)] border border-[var(--staz-border)] bg-[var(--staz-surface)] p-6 sm:p-7"
          >
            <p className="font-brand text-lg text-[var(--staz-primary)] sm:text-xl">
              {persona.role}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--staz-muted)] sm:text-[0.95rem]">
              {persona.body}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-14">
        <SectionHeader title={value.headline} />
        <div className="mt-8 grid gap-px overflow-hidden rounded-[var(--staz-radius)] border border-[var(--staz-border)] bg-[var(--staz-border)] sm:grid-cols-2 lg:grid-cols-4">
          {value.items.map((item) => (
            <article key={item.title} className="bg-[var(--staz-surface)] p-6">
              <p className="font-brand text-xl text-[var(--staz-primary)]">
                {item.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--staz-muted)]">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </LandingChapter>
  );
}
