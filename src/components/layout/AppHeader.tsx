"use client";

import { Bell, Globe, Menu, Search } from "lucide-react";
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
    <header className="sticky top-0 z-20 flex h-[var(--header-height)] shrink-0 items-center justify-between border-b border-border/60 bg-card/75 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {showMenuButton && onMenuOpen && (
          <button
            type="button"
            aria-label="Open menu"
            onClick={onMenuOpen}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="min-w-0 text-start">
          <h1 className="truncate text-base font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="hidden truncate text-sm text-muted-foreground sm:block">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle className="hidden sm:flex" />

        <div className="hidden items-center gap-1.5 sm:flex">
          <Globe className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            aria-label={t.langLabel}
            className="rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          >
            {locales.map((l) => (
              <option key={l} value={l}>
                {localeLabels[l]}
              </option>
            ))}
          </select>
        </div>

        {isPro && (
          <span className="hidden rounded-full border border-accent/30 bg-accent-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent sm:inline-block">
            Pro
          </span>
        )}

        <div className="hidden items-center gap-2 rounded-xl border border-border/80 bg-muted/40 px-3 py-2 shadow-xs md:flex">
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
          <input
            type="search"
            placeholder={t.searchPlaceholder}
            className="w-36 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none lg:w-40"
          />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
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
