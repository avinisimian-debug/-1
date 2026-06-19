"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Bell, Globe, Menu, Search } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import type { Locale } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";
import { MobileSidebar, Sidebar } from "./Sidebar";

interface DashboardShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function DashboardShell({
  title,
  description,
  children,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isPro } = usePlan();
  const { t, locale, setLocale, localeLabels, locales } = useLocale();
  const { data: session } = useSession();

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "SA";

  return (
    <div className="app-shell-bg flex h-screen overflow-hidden">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[var(--header-height)] shrink-0 items-center justify-between border-b border-border/80 bg-card/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-foreground">
                {title}
              </h1>
              {description && (
                <p className="hidden text-sm text-muted-foreground sm:block">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 sm:flex">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
                aria-label={t.langLabel}
                className="rounded-md border border-border bg-card px-2 py-1 text-xs text-muted-foreground transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                {locales.map((l) => (
                  <option key={l} value={l}>
                    {localeLabels[l]}
                  </option>
                ))}
              </select>
            </div>

            {isPro && (
              <span className="hidden rounded-md border border-accent/25 bg-accent-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent sm:inline-block">
                Pro
              </span>
            )}
            <div className="hidden items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-1.5 md:flex">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder={t.searchPlaceholder}
                className="w-40 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
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
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
                "avatar-gradient shadow-sm",
              )}
            >
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
