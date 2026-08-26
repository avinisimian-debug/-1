"use client";

import { Logo } from "@/components/brand/Logo";
import { LANDING } from "@/lib/landing-copy";

export function StazFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#030607]">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-12 sm:flex-row sm:items-center sm:px-6">
        <Logo size="md" tone="dark" href="/" />
        <p className="text-sm text-white/40">{LANDING.footer.tagline}</p>
      </div>
    </footer>
  );
}
