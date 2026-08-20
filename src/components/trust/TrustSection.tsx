"use client";

import { LANDING } from "@/lib/landing-copy";
import { cn } from "@/lib/utils";

interface TrustSectionProps {
  variant?: "landing" | "sidebar";
  className?: string;
}

/** Honest product trust only — no fabricated logos, counts, or quotes. */
export function TrustSection({ variant = "landing", className }: TrustSectionProps) {
  const copy = LANDING.trust;

  if (variant === "sidebar") {
    return (
      <div className={cn("space-y-3 px-1", className)}>
        <p className="text-xs font-medium text-muted-foreground">{copy.headline}</p>
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
    <section className={cn("w-full", className)} aria-labelledby="trust-heading">
      <h2
        id="trust-heading"
        className="text-center font-brand text-2xl tracking-tight text-[var(--staz-text)] sm:text-3xl"
      >
        {copy.headline}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-[var(--staz-muted)] sm:text-base">
        {copy.subhead}
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {copy.items.map((item) => (
          <li key={item.title} className="staz-panel p-5 sm:p-6">
            <p className="font-semibold text-[var(--staz-text)]">{item.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--staz-muted)]">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
