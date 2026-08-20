"use client";

import Link from "next/link";
import { LANDING } from "@/lib/landing-copy";
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
    <header className="landing-header sticky top-0 z-40 border-b border-[var(--staz-border)] bg-[color-mix(in_srgb,var(--staz-bg)_82%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
        <Link
          href="/"
          className="font-brand text-xl tracking-[0.16em] text-[var(--staz-text)] sm:text-2xl"
        >
          STAZ
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="ניווט ראשי">
          <button
            type="button"
            onClick={onHow}
            className="hidden rounded-lg px-2.5 py-1.5 text-sm text-[var(--staz-muted)] transition-colors hover:text-[var(--staz-text)] md:inline-flex"
          >
            {copy.how}
          </button>
          <button
            type="button"
            onClick={onPricing}
            className="hidden rounded-lg px-2.5 py-1.5 text-sm text-[var(--staz-muted)] transition-colors hover:text-[var(--staz-text)] md:inline-flex"
          >
            {copy.pricing}
          </button>
          <button
            type="button"
            onClick={onLogin}
            className="hidden rounded-lg px-2.5 py-1.5 text-sm text-[var(--staz-muted)] transition-colors hover:text-[var(--staz-text)] sm:inline-flex"
          >
            {copy.login}
          </button>
          <select
            value={locale}
            onChange={(e) => onLocaleChange(e.target.value as Locale)}
            aria-label={langLabel}
            className="rounded-lg border border-[var(--staz-border)] bg-black/25 px-2 py-1.5 text-xs text-[var(--staz-muted)] sm:text-sm"
          >
            {locales.map((l) => (
              <option key={l} value={l} className="text-black">
                {localeLabels[l]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onDemo}
            className="staz-btn-primary !min-h-9 !px-3 !text-xs sm:!min-h-10 sm:!px-4 sm:!text-sm"
          >
            {copy.demoCta}
          </button>
        </nav>
      </div>
    </header>
  );
}
