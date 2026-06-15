"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Clapperboard,
  Crown,
  History,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { useUsage } from "@/hooks/useUsage";
import { NAV_ITEMS } from "@/lib/constants";
import type { Translations } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

const iconMap = {
  LayoutDashboard,
  History,
  Settings,
} as const;

interface SidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export function Sidebar({ onNavigate, className }: SidebarProps) {
  const pathname = usePathname();
  const { limits, isPro } = usePlan();
  const { count, limit, percent } = useUsage();
  const { t } = useLocale();
  const { data: session } = useSession();

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "MS";

  return (
    <aside
      className={cn(
        "relative z-10 flex h-full w-64 flex-col border-r border-white/[0.06] bg-black/40 backdrop-blur-xl",
        className,
      )}
    >
      <div className="border-b border-white/[0.06] px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-amber-500 shadow-lg shadow-violet-600/30">
            <Clapperboard className="h-5 w-5 text-white" />
          </div>
          <div>
            <p
              className="font-display text-base font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              MeetScribe
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-amber-400/80">
              {t.studioGrade}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const label = t[item.labelKey as keyof Translations] as string;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-violet-600/20 to-amber-500/10 text-white shadow-inner"
                  : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-amber-400" : "text-zinc-600 group-hover:text-violet-400",
                )}
              />
              {label}
              {isActive && (
                <span className="ms-auto h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              )}
            </Link>
          );
        })}

        {session?.user?.isAdmin && (
          <Link
            href="/admin/users"
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              pathname.startsWith("/admin")
                ? "bg-gradient-to-r from-violet-600/20 to-amber-500/10 text-white shadow-inner"
                : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200",
            )}
          >
            <Users
              className={cn(
                "h-4 w-4",
                pathname.startsWith("/admin")
                  ? "text-amber-400"
                  : "text-zinc-600 group-hover:text-violet-400",
              )}
            />
            {t.navUsers}
          </Link>
        )}
      </nav>

      <div className="border-t border-white/[0.06] p-4 space-y-3">
        <div
          className={
            isPro
              ? "gradient-border rounded-xl p-4"
              : "rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
          }
        >
          <div className="flex items-center gap-2">
            {isPro ? (
              <Crown className="h-4 w-4 text-amber-400" />
            ) : (
              <Sparkles className="h-4 w-4 text-violet-400" />
            )}
            <p
              className={cn(
                "text-xs font-semibold",
                isPro ? "text-amber-300" : "text-zinc-300",
              )}
            >
              {isPro ? t.planPro : t.planFree}
            </p>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
            {limits.maxFileSizeLabel} · {limits.maxDurationLabel}
          </p>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-amber-400 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-1.5 text-[10px] text-zinc-600">
            {count} / {limit} {t.planUsed}
          </p>
          {!isPro && (
            <Link
              href="/settings"
              onClick={onNavigate}
              className="btn-cinema mt-3 flex w-full items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold text-white"
            >
              {t.planUpgrade}
            </Link>
          )}
        </div>

        {session?.user && (
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-amber-500 text-[10px] font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-zinc-300">
                {session.user.name}
              </p>
              <p className="truncate text-[10px] text-zinc-600">
                {session.user.email}
              </p>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              aria-label={t.navSignOut}
              className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.06] hover:text-red-400"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close menu"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 start-0 w-64 shadow-2xl">
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="absolute end-3 top-4 z-10 rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <Sidebar onNavigate={onClose} className="h-full" />
      </div>
    </div>
  );
}
