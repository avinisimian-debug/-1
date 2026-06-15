"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Crown,
  History,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { TrustSection } from "@/components/trust/TrustSection";
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
    .toUpperCase() ?? "SA";

  return (
    <aside
      className={cn(
        "relative z-10 flex h-full w-64 flex-col border-r border-zinc-200 bg-white",
        className,
      )}
    >
      <div className="border-b border-zinc-200 px-5 py-5">
        <Logo size="md" showTagline />
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
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
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-600",
                )}
              />
              {label}
            </Link>
          );
        })}

        {session?.user?.isAdmin && (
          <Link
            href="/admin/users"
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname.startsWith("/admin")
                ? "bg-zinc-100 text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
            )}
          >
            <Users className="h-4 w-4 text-zinc-400 group-hover:text-zinc-600" />
            {t.navUsers}
          </Link>
        )}
      </nav>

      <div className="px-3 pb-2">
        <TrustSection variant="sidebar" />
      </div>

      <div className="space-y-3 border-t border-zinc-200 p-4">
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-center gap-2">
            {isPro && <Crown className="h-3.5 w-3.5 text-indigo-600" />}
            <p className="text-xs font-semibold text-zinc-800">
              {isPro ? t.planPro : t.planFree}
            </p>
          </div>
          <p className="mt-1.5 text-[11px] text-zinc-500">
            {limits.maxFileSizeLabel} · {limits.maxDurationLabel}
          </p>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-zinc-200">
            <div
              className="h-full rounded-full bg-zinc-900 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-1.5 text-[10px] text-zinc-500">
            {count} / {limit} {t.planUsed}
          </p>
          {!isPro && (
            <Link
              href="/settings"
              onClick={onNavigate}
              className="btn-cinema mt-3 flex w-full items-center justify-center rounded-md px-3 py-2 text-xs font-medium"
            >
              {t.planUpgrade}
            </Link>
          )}
        </div>

        {session?.user && (
          <div className="flex items-center gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-zinc-800">
                {session.user.name}
              </p>
              <p className="truncate text-[10px] text-zinc-500">
                {session.user.email}
              </p>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              aria-label={t.navSignOut}
              className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
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
        className="absolute inset-0 bg-zinc-900/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 start-0 w-64 bg-white shadow-xl">
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="absolute end-3 top-4 z-10 rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100"
        >
          <X className="h-5 w-5" />
        </button>
        <Sidebar onNavigate={onClose} className="h-full" />
      </div>
    </div>
  );
}
