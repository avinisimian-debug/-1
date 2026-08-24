"use client";

import { LANDING } from "@/lib/landing-copy";

export function StazFooter() {
  return (
    <footer className="border-t border-[var(--staz-border)] bg-[var(--staz-bg-warm)]">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-10 sm:flex-row sm:items-center sm:px-6">
        <p className="font-brand text-lg tracking-[0.18em] text-[var(--staz-ink)]">
          STAZ
        </p>
        <p className="text-sm text-[var(--staz-muted)]">{LANDING.footer.tagline}</p>
      </div>
    </footer>
  );
}
