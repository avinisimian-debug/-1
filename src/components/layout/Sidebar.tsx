"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Crown,
  Globe,
  History,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Video,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { useUsage } from "@/hooks/useUsage";
import { NAV_ITEMS } from "@/lib/constants";
import type { Locale, Translations } from "@/lib/i18n/translations";
import {
  SETTINGS_UPGRADE_PATH,
  scrollToUpgradeWithRetry,
} from "@/lib/upgrade-navigation";
import { cn } from "@/lib/utils";

const iconMap = {
  LayoutDashboard,
  History,
  Settings,
  Video,
} as const;

interface SidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export function Sidebar({ onNavigate, className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { limits, isPro } = usePlan();
  const { count, limit, percent } = useUsage();
  const { t, locale, setLocale, localeLabels, locales } = useLocale();
  const { data: session } = useSession();

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "SA";

  const navLinkClass = (isActive: boolean) =>
    cn("nav-item", isActive && "nav-item-active");

  const handleUpgrade = () => {
    onNavigate?.();

    if (pathname === "/settings") {
      window.history.pushState(null, "", SETTINGS_UPGRADE_PATH);
      scrollToUpgradeWithRetry();
      return;
    }

    router.push(SETTINGS_UPGRADE_PATH);
  };

  return (
    <aside
      className={cn(
        "relative z-10 flex h-full w-[var(--sidebar-width)] min-h-0 flex-col overflow-y-auto border-e border-[var(--line-subtle)] bg-[var(--bg-elevated)]/95 backdrop-blur-xl",
        className,
      )}
    >
      <div className="border-b border-[var(--line-subtle)] px-5 py-5">
        <Logo size="md" showTagline />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="ניווט ראשי">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-tertiary)]">
          Workspace
        </p>
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
              className={navLinkClass(isActive)}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-[var(--accent)]" : "text-[var(--ink-tertiary)]",
                )}
              />
              {label}
            </Link>
          );
        })}

        {session?.user?.isAdmin && (
          <>
            <p className="mb-2 mt-5 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-tertiary)]">
              Admin
            </p>
            <Link
              href="/admin/users"
              onClick={onNavigate}
              className={navLinkClass(pathname === "/admin/users")}
            >
              <Users className="h-4 w-4 shrink-0 text-[var(--ink-tertiary)]" />
              {t.navUsers}
            </Link>
            <Link
              href="/admin/auth-setup"
              onClick={onNavigate}
              className={navLinkClass(pathname === "/admin/auth-setup")}
            >
              <KeyRound className="h-4 w-4 shrink-0 text-[var(--ink-tertiary)]" />
              Google Setup
            </Link>
          </>
        )}
      </nav>

      <div className="space-y-3 border-t border-[var(--line-subtle)] p-4">
        <div className="flex flex-wrap items-center gap-2 sm:hidden">
          <ThemeToggle className="flex" />
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 shrink-0 text-[var(--ink-tertiary)]" aria-hidden />
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              aria-label={t.langLabel}
              className="min-w-0 flex-1 rounded-full border border-[var(--line-subtle)] bg-[var(--bg-elevated)] px-2.5 py-1.5 text-xs text-[var(--ink-secondary)]"
            >
              {locales.map((l) => (
                <option key={l} value={l}>
                  {localeLabels[l]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          className={cn(
            "rounded-2xl border p-4",
            isPro
              ? "border-[color-mix(in_srgb,var(--accent)_22%,transparent)] bg-[var(--accent-soft)]"
              : "border-[var(--line-subtle)] bg-[var(--bg-subtle)]",
          )}
        >
          <div className="flex items-center gap-2">
            {isPro && <Crown className="h-3.5 w-3.5 text-[var(--accent)]" />}
            <p className="text-xs font-semibold text-[var(--ink-primary)]">
              {isPro ? t.planPro : t.planFree}
            </p>
          </div>
          <p className="mt-1.5 text-[11px] text-[var(--ink-tertiary)]">
            {limits.maxFileSizeLabel} · {limits.maxDurationLabel}
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--bg-mute)]">
            <div
              className="usage-bar-fill h-full"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-1.5 text-[10px] text-[var(--ink-tertiary)]">
            {count} / {limit} {t.planUsed}
          </p>
          {!isPro && (
            <button
              type="button"
              onClick={handleUpgrade}
              className="lat-btn-primary relative z-10 mt-3 w-full !min-h-9 !text-xs"
            >
              {t.planUpgrade}
            </button>
          )}
        </div>

        {session?.user && (
          <div className="flex items-center gap-3 rounded-xl border border-[var(--line-subtle)] bg-[var(--bg-elevated)] px-3 py-2.5">
            <div className="avatar-gradient flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-[var(--ink-primary)]">
                {session.user.name}
              </p>
              <p className="truncate text-[10px] text-[var(--ink-tertiary)]">
                {session.user.email}
              </p>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              aria-label={t.navSignOut}
              className="rounded-lg p-1.5 text-[var(--ink-tertiary)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--ink-primary)]"
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
        className="absolute inset-0 bg-[rgba(12,14,13,0.45)] backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 start-0 w-[var(--sidebar-width)] animate-in slide-in-from-start duration-200 bg-[var(--bg-elevated)] shadow-[var(--shadow-premium)]">
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="absolute end-3 top-4 z-10 rounded-lg p-1.5 text-[var(--ink-tertiary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--ink-primary)]"
        >
          <X className="h-5 w-5" />
        </button>
        <Sidebar onNavigate={onClose} className="h-full" />
      </div>
    </div>
  );
}
