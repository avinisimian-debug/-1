"use client";

import { LANDING } from "@/lib/landing-copy";
import { LandingChapter } from "@/components/landing/ui/LandingChapter";
import { SectionHeader } from "@/components/landing/ui/SectionHeader";

export function TransformationFlow() {
  const copy = LANDING.transform;

  return (
    <LandingChapter tone="sand">
      <SectionHeader
        title={copy.headline}
        subtitle="אותה פגישה. שני מסלולים. רק אחד מסתיים בבהירות."
      />

      <div className="mt-12 grid overflow-hidden rounded-[var(--staz-radius)] border border-[var(--staz-border)] shadow-[var(--staz-shadow-soft)] lg:grid-cols-2">
        <div className="bg-[color-mix(in_srgb,var(--staz-bg-cool)_80%,#d5ddd8)] p-6 sm:p-8">
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--staz-muted)]">
            {copy.beforeTitle}
          </p>
          <ol className="mt-6 space-y-0">
            {copy.before.map((step, i) => (
              <li key={step} className="flex flex-col items-start">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/70 text-[11px] font-medium text-[var(--staz-muted)]">
                    {i + 1}
                  </span>
                  <p className="text-base text-[var(--staz-muted)]">{step}</p>
                </div>
                {i < copy.before.length - 1 ? (
                  <span
                    className="ms-3.5 my-1.5 h-4 w-px bg-[var(--staz-border-strong)]"
                    aria-hidden
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        <div className="border-t border-[var(--staz-border)] bg-[var(--staz-primary-soft)] p-6 sm:p-8 lg:border-t-0 lg:border-s">
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--staz-primary)]">
            {copy.afterTitle}
          </p>
          <ol className="mt-6 space-y-0">
            {copy.after.map((step, i) => (
              <li key={step} className="flex flex-col items-start">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--staz-primary)] text-[11px] font-medium text-white">
                    {i + 1}
                  </span>
                  <p className="text-base font-medium text-[var(--staz-ink)]">
                    {step}
                  </p>
                </div>
                {i < copy.after.length - 1 ? (
                  <span
                    className="ms-3.5 my-1.5 h-4 w-px bg-[color-mix(in_srgb,var(--staz-primary)_35%,transparent)]"
                    aria-hidden
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </LandingChapter>
  );
}
