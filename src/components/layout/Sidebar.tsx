"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Crown,
  History,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { useUsage } from "@/hooks/useUsage";
import { NAV_ITEMS } from "@/lib/constants";
import type { Translations } from "@/lib/i18n/translations";
import {
  SETTINGS_UPGRADE_PATH,
  scrollToUpgradeWithRetry,
} from "@/lib/upgrade-navigation";
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
  const router = useRouter();
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
        "relative z-10 flex h-full w-[var(--sidebar-width)] min-h-0 flex-col overflow-y-auto border-r border-border/80 bg-card/90 backdrop-blur-xl",
        className,
      )}
    >
      <div className="border-b border-border px-5 py-5">
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
              className={navLinkClass(isActive)}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-accent" : "text-muted-foreground",
                )}
              />
              {label}
            </Link>
          );
        })}

        {session?.user?.isAdmin && (
          <>
            <Link
              href="/admin/users"
              onClick={onNavigate}
              className={navLinkClass(pathname === "/admin/users")}
            >
              <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
              {t.navUsers}
            </Link>
            <Link
              href="/admin/auth-setup"
              onClick={onNavigate}
              className={navLinkClass(pathname === "/admin/auth-setup")}
            >
              <KeyRound className="h-4 w-4 shrink-0 text-muted-foreground" />
              Google Setup
            </Link>
          </>
        )}
      </nav>

      <div className="space-y-3 border-t border-border p-4">
        <div
          className={cn(
            "rounded-xl p-4",
            isPro ? "pro-plan-card" : "premium-card",
          )}
        >
          <div className="flex items-center gap-2">
            {isPro && <Crown className="h-3.5 w-3.5 text-accent" />}
            <p className="text-xs font-semibold text-foreground">
              {isPro ? t.planPro : t.planFree}
            </p>
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            {limits.maxFileSizeLabel} · {limits.maxDurationLabel}
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="usage-bar-fill h-full"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-1.5 text-[10px] text-muted-foreground">
            {count} / {limit} {t.planUsed}
          </p>
          {!isPro && (
            <button
              type="button"
              onClick={handleUpgrade}
              className="btn-cinema relative z-10 mt-3 flex w-full cursor-pointer items-center justify-center rounded-md px-3 py-2 text-xs font-medium"
            >
              {t.planUpgrade}
            </button>
          )}
        </div>

        {session?.user && (
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-xs">
            <div className="avatar-gradient flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">
                {session.user.name}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                {session.user.email}
              </p>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              aria-label={t.navSignOut}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 start-0 w-[var(--sidebar-width)] bg-card shadow-xl">
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="absolute end-3 top-4 z-10 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>
        <Sidebar onNavigate={onClose} className="h-full" />
      </div>
    </div>
  );
}
