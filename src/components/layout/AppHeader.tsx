"use client";

import { Globe, Menu, Search } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import type { Locale } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title: string;
  description?: string;
  onMenuOpen?: () => void;
  showMenuButton?: boolean;
  userInitials?: string;
}

function openCommandPalette() {
  window.dispatchEvent(new CustomEvent("stazai:open-command-palette"));
}

export function AppHeader({
  title,
  description,
  onMenuOpen,
  showMenuButton = true,
  userInitials = "SA",
}: AppHeaderProps) {
  const { isPro } = usePlan();
  const { t, locale, setLocale, localeLabels, locales } = useLocale();

  return (
    <header className="sticky top-0 z-20 flex h-[var(--header-height)] shrink-0 items-center justify-between border-b border-[var(--line-subtle)] bg-[color-mix(in_srgb,var(--bg-elevated)_88%,transparent)] px-4 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {showMenuButton && onMenuOpen && (
          <button
            type="button"
            aria-label="Open menu"
            onClick={onMenuOpen}
            className="rounded-xl p-2 text-[var(--ink-tertiary)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--ink-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_35%,transparent)] lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="min-w-0 text-start">
          <h1 className="truncate text-[0.9375rem] font-semibold leading-tight tracking-tight text-[var(--ink-primary)] sm:text-base">
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 hidden truncate text-xs leading-snug text-[var(--ink-tertiary)] sm:block">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle className="hidden sm:flex" />

        <div className="hidden items-center gap-1.5 sm:flex">
          <Globe className="h-3.5 w-3.5 text-[var(--ink-tertiary)]" aria-hidden />
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            aria-label={t.langLabel}
            className="rounded-full border border-[var(--line-subtle)] bg-[var(--bg-elevated)] px-2.5 py-1 text-xs text-[var(--ink-secondary)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent)_25%,transparent)]"
          >
            {locales.map((l) => (
              <option key={l} value={l}>
                {localeLabels[l]}
              </option>
            ))}
          </select>
        </div>

        {isPro && (
          <span className="hidden rounded-full border border-[color-mix(in_srgb,var(--accent)_28%,transparent)] bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)] sm:inline-block">
            Pro
          </span>
        )}

        <button
          type="button"
          onClick={openCommandPalette}
          className="hidden items-center gap-2 rounded-full border border-[var(--line-subtle)] bg-[var(--bg-subtle)] px-3 py-2 text-sm text-[var(--ink-tertiary)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--ink-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_35%,transparent)] md:inline-flex"
        >
          <Search className="h-4 w-4" aria-hidden />
          <span className="w-28 text-start lg:w-36">{t.searchPlaceholder}</span>
          <kbd className="rounded-md border border-[var(--line-subtle)] bg-[var(--bg-elevated)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--ink-tertiary)]">
            {t.commandPaletteHint}
          </kbd>
        </button>

        <button
          type="button"
          onClick={openCommandPalette}
          aria-label={t.commandPaletteTitle}
          className="rounded-xl p-2 text-[var(--ink-tertiary)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--ink-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_35%,transparent)] md:hidden"
        >
          <Search className="h-5 w-5" />
        </button>

        <div
          className={cn(
            "avatar-gradient flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold shadow-sm",
          )}
          aria-hidden
        >
          {userInitials}
        </div>
      </div>
    </header>
  );
}
