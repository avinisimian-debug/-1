"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Bell, Globe, Menu, Search } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import type { Locale } from "@/lib/i18n/translations";
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
    .toUpperCase() ?? "JD";

  return (
    <div className="cinema-bg relative flex h-screen overflow-hidden">
      <div className="relative z-10 hidden lg:block">
        <Sidebar />
      </div>

      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] bg-black/30 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-zinc-400 hover:bg-white/[0.06] hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1
                className="text-lg font-bold tracking-tight text-white"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                {title}
              </h1>
              {description && (
                <p className="hidden text-sm text-zinc-500 sm:block">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 sm:flex">
              <Globe className="h-3.5 w-3.5 text-zinc-600" />
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
                aria-label={t.langLabel}
                className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-xs text-zinc-400 focus:outline-none"
              >
                {locales.map((l) => (
                  <option key={l} value={l} className="bg-zinc-900">
                    {localeLabels[l]}
                  </option>
                ))}
              </select>
            </div>

            {isPro && (
              <span className="hidden rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-400 sm:inline-block">
                Pro
              </span>
            )}
            <div className="hidden items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 md:flex">
              <Search className="h-4 w-4 text-zinc-600" />
              <input
                type="search"
                placeholder={t.searchPlaceholder}
                className="w-40 bg-transparent text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none"
              />
            </div>
            <button
              type="button"
              aria-label="Notifications"
              className="rounded-lg p-2 text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-300"
            >
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-amber-500 text-xs font-bold text-white shadow-lg shadow-violet-600/20">
              {initials}
            </div>
          </div>
        </header>

        <main className="vignette relative flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
