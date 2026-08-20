"use client";

import { LANDING } from "@/lib/landing-copy";

export function StazFooter() {
  return (
    <footer className="mx-auto mt-20 max-w-6xl border-t border-[var(--staz-border)] px-4 py-10 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="font-brand text-lg tracking-[0.14em] text-[var(--staz-text)]">STAZ</p>
        <p className="text-sm text-[var(--staz-muted)]">{LANDING.footer.tagline}</p>
      </div>
    </footer>
  );
}
