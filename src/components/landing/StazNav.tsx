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
}: StazNavProps) {
  const copy = LANDING.nav;

  return (
    <header className="landing-header border-b border-[var(--staz-border)] bg-[color-mix(in_srgb,var(--staz-bg-warm)_90%,white)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-brand text-lg tracking-[0.18em] text-[var(--staz-ink)] sm:text-xl"
        >
          STAZ
        </Link>

        <nav className="flex items-center gap-1 sm:gap-1.5" aria-label="ניווט ראשי">
          <button
            type="button"
            onClick={onHow}
            className="hidden rounded-lg px-2 py-1.5 text-sm text-[var(--staz-muted)] transition-colors hover:text-[var(--staz-ink)] md:inline-flex"
          >
            {copy.how}
          </button>
          <button
            type="button"
            onClick={onPricing}
            className="hidden rounded-lg px-2 py-1.5 text-sm text-[var(--staz-muted)] transition-colors hover:text-[var(--staz-ink)] md:inline-flex"
          >
            {copy.pricing}
          </button>
          <button
            type="button"
            onClick={onDemo}
            className="hidden rounded-lg px-2 py-1.5 text-sm text-[var(--staz-muted)] transition-colors hover:text-[var(--staz-ink)] md:inline-flex"
          >
            {copy.demo}
          </button>
          <button
            type="button"
            onClick={onLogin}
            className="hidden rounded-lg px-2 py-1.5 text-sm text-[var(--staz-muted)] transition-colors hover:text-[var(--staz-ink)] sm:inline-flex"
          >
            {copy.login}
          </button>
          <select
            value={locale}
            onChange={(e) => onLocaleChange(e.target.value as Locale)}
            aria-label={langLabel}
            className="rounded-lg border border-[var(--staz-border)] bg-white/80 px-2 py-1.5 text-xs text-[var(--staz-muted)] sm:text-sm"
          >
            {locales.map((l) => (
              <option key={l} value={l} className="text-black">
                {localeLabels[l]}
              </option>
            ))}
          </select>
          <StazButton size="sm" onClick={onDemo}>
            {copy.demoCta}
          </StazButton>
        </nav>
      </div>
    </header>
  );
}
