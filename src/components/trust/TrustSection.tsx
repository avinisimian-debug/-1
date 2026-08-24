"use client";

import { LANDING } from "@/lib/landing-copy";
import { SectionHeader } from "@/components/landing/ui/SectionHeader";
import { DEMO_AHA_TIMESTAMP } from "@/features/staz-workspace/data/demo-meeting";
import { cn } from "@/lib/utils";

interface TrustSectionProps {
  variant?: "landing" | "sidebar";
  className?: string;
}

export function TrustSection({ variant = "landing", className }: TrustSectionProps) {
  const copy = LANDING.trust;

  if (variant === "sidebar") {
    return (
      <div className={cn("space-y-3 px-1", className)}>
        <p className="text-xs font-medium text-muted-foreground">
          {copy.headline} {copy.headlineAccent}
        </p>
        <ul className="space-y-2">
          {copy.items.map((item) => (
            <li key={item.title} className="text-xs leading-relaxed text-foreground/80">
              <span className="font-medium text-foreground">{item.title}</span>
              {" — "}
              {item.body}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <section
      className={cn(
        "landing-chapter landing-chapter--forest w-full overflow-hidden py-16 sm:py-20 md:py-24",
        className,
      )}
      aria-labelledby="trust-heading"
    >
      <div className="landing-chapter-inner">
        <SectionHeader
          id="trust-heading"
          tone="dark"
          title={
            <>
              <span className="block">{copy.headline}</span>
              <span className="mt-1 block text-[color-mix(in_srgb,var(--staz-sage)_90%,white)]">
                {copy.headlineAccent}
              </span>
            </>
          }
          subtitle={copy.subhead}
        />

        <div className="mx-auto mt-12 flex max-w-lg flex-col items-center gap-3 text-center text-sm">
          <span className="rounded-[var(--staz-radius-sm)] border border-white/10 bg-white/[0.06] px-4 py-2 font-medium text-[var(--staz-on-dark)]">
            החלטה
          </span>
          <span className="text-[color-mix(in_srgb,var(--staz-sage)_85%,white)]" aria-hidden>
            ↓
          </span>
          <span className="font-mono-time text-base text-[var(--staz-warn)]">
            {DEMO_AHA_TIMESTAMP}
          </span>
          <span className="text-[color-mix(in_srgb,var(--staz-sage)_85%,white)]" aria-hidden>
            ↓
          </span>
          <span className="rounded-[var(--staz-radius-sm)] border border-white/10 bg-white/[0.06] px-4 py-2 text-[var(--staz-on-dark-muted)]">
            ראיה בתמלול
          </span>
        </div>

        <ul className="mt-12 grid gap-3 sm:grid-cols-2">
          {copy.items.map((item) => (
            <li
              key={item.title}
              className="rounded-[var(--staz-radius)] border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="font-semibold text-[var(--staz-on-dark)]">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--staz-on-dark-muted)]">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
