"use client";

import { LANDING } from "@/lib/landing-copy";
import { LandingChapter } from "@/components/landing/ui/LandingChapter";
import { SectionHeader } from "@/components/landing/ui/SectionHeader";
import { getProPlanPriceLabel } from "@/lib/constants";

/** Collapsed ICP strip + value economics (no standalone role-card grid). */
export function AudienceValueSection() {
  const audience = LANDING.audience;
  const value = LANDING.value;
  const price = getProPlanPriceLabel();

  return (
    <LandingChapter tone="quiet">
      <SectionHeader title={value.headline} />

      <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-[var(--staz-muted)]">
        {audience.headline}
        {": "}
        {audience.roles.join(" · ")}
      </p>

      <div className="mt-10 grid gap-px overflow-hidden rounded-[var(--staz-radius)] border border-[var(--staz-border)] bg-[var(--staz-border)] sm:grid-cols-2 lg:grid-cols-4">
        {value.items.map((item) => (
          <article key={item.title} className="bg-[var(--staz-surface)] p-6">
            <p className="font-brand text-xl text-[var(--staz-primary)]">{item.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--staz-muted)]">
              {item.body}
            </p>
          </article>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-base leading-relaxed text-[var(--staz-ink)]">
        {value.close(price)}
      </p>
    </LandingChapter>
  );
}
