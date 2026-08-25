"use client";

import Link from "next/link";
import { LANDING } from "@/lib/landing-copy";
import { StazButton } from "@/components/landing/ui/StazButton";
import type { Locale } from "@/lib/i18n/translations";

type StazNavProps = {
  locale: Locale;
  locales: Locale[];
  localeLabels: Record<Locale, string>;
  langLabel: string;
  onLocaleChange: (locale: Locale) => void;
  onDemo: () => void;
  onHow: () => void;
  onPricing: () => void;
  onLogin: () => void;
  onSignup?: () => void;
};

export function StazNav({
  locale,
  locales,
  localeLabels,
  langLabel,
  onLocaleChange,
  onDemo,
  onHow,
  onPricing,
  onLogin,
  onSignup,
}: StazNavProps) {
  const copy = LANDING.nav;

  return (
    <header className="landing-header sticky top-0 z-40 border-b border-white/[0.06] bg-[#05080a]/78 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
        <Link
          href="/"
          className="font-brand text-xl tracking-[0.28em] text-white transition-opacity hover:opacity-90 sm:text-2xl"
        >
          STAZ
        </Link>

        <nav className="flex items-center gap-1 sm:gap-1.5" aria-label="ניווט ראשי">
          <button
            type="button"
            onClick={onHow}
            className="hidden rounded-lg px-2.5 py-1.5 text-sm text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white md:inline-flex"
          >
            {copy.how}
          </button>
          <button
            type="button"
            onClick={onPricing}
            className="hidden rounded-lg px-2.5 py-1.5 text-sm text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white md:inline-flex"
          >
            {copy.pricing}
          </button>
          <button
            type="button"
            onClick={onDemo}
            className="hidden rounded-lg px-2.5 py-1.5 text-sm text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white md:inline-flex"
          >
            {copy.demo}
          </button>
          <button
            type="button"
            onClick={onLogin}
            className="hidden rounded-lg px-2.5 py-1.5 text-sm text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white sm:inline-flex"
          >
            {copy.login}
          </button>
          <select
            value={locale}
            onChange={(e) => onLocaleChange(e.target.value as Locale)}
            aria-label={langLabel}
            className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-white/70 transition-colors hover:border-white/20 focus:border-[#2dd4bf]/50 focus:outline-none sm:text-sm"
          >
            {locales.map((l) => (
              <option key={l} value={l} className="text-black">
                {localeLabels[l]}
              </option>
            ))}
          </select>
          <StazButton size="sm" onClick={onSignup ?? onLogin}>
            {LANDING.hero.primaryCta}
          </StazButton>
        </nav>
      </div>
    </header>
  );
}
