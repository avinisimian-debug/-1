"use client";

import { useEffect, useState } from "react";
import { Activity, Download, Users } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { formatSocialProofNumber } from "@/lib/social-proof-stats";
import { cn } from "@/lib/utils";

interface PublicStats {
  transcriptionsToday: number;
  downloadsToday: number;
  totalUsers: number;
  saleActive: boolean;
}

/** Poll often enough that modest live bumps feel real. */
const POLL_MS = 50_000;

const STAT_KEYS = ["users", "downloads", "transcriptions"] as const;
type StatKey = (typeof STAT_KEYS)[number];

function useAnimatedNumber(target: number, durationMs = 700) {
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    if (target === display) return;

    const start = display;
    const delta = target - start;
    const startedAt = performance.now();

    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / durationMs);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(start + delta * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, display, durationMs]);

  return display;
}

export function usePublicStats() {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    let active = true;

    const load = () => {
      fetch("/api/stats/public", { cache: "no-store" })
        .then((res) => res.json())
        .then((body: { data?: PublicStats }) => {
          if (active && body.data) setStats(body.data);
        })
        .catch(() => {});
    };

    load();
    const interval = setInterval(load, POLL_MS);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return stats;
}

export function LoginLiveStats({ className }: { className?: string }) {
  const { t, locale } = useLocale();
  const stats = usePublicStats();
  const [highlight, setHighlight] = useState<StatKey>("users");

  const users = useAnimatedNumber(stats?.totalUsers ?? 0);
  const downloads = useAnimatedNumber(stats?.downloadsToday ?? 0);
  const transcriptions = useAnimatedNumber(stats?.transcriptionsToday ?? 0);

  useEffect(() => {
    const rotate = setInterval(() => {
      setHighlight((prev) => {
        const i = STAT_KEYS.indexOf(prev);
        return STAT_KEYS[(i + 1) % STAT_KEYS.length];
      });
    }, 6_500);
    return () => clearInterval(rotate);
  }, []);

  if (!stats) return null;

  const usersFormatted = formatSocialProofNumber(users, locale);
  const downloadsFormatted = formatSocialProofNumber(downloads, locale);
  const transcriptionsFormatted = formatSocialProofNumber(transcriptions, locale);

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center gap-4",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        {t.authLiveLabel}
      </span>

      <div className="grid w-full max-w-lg grid-cols-3 gap-3 sm:gap-6">
        <StatCell
          icon={Users}
          value={usersFormatted}
          label={t.authLiveUsersLabel}
          active={highlight === "users"}
        />
        <StatCell
          icon={Download}
          value={downloadsFormatted}
          label={t.authLiveDownloadsLabel}
          active={highlight === "downloads"}
        />
        <StatCell
          icon={Activity}
          value={transcriptionsFormatted}
          label={t.authLiveTodayLabel}
          active={highlight === "transcriptions"}
        />
      </div>
    </div>
  );
}

function StatCell({
  icon: Icon,
  value,
  label,
  active,
}: {
  icon: typeof Users;
  value: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-xl px-2 py-2 text-center transition-all duration-500",
        active
          ? "bg-white/[0.06] ring-1 ring-[#5eead4]/35"
          : "bg-transparent ring-1 ring-transparent",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 transition-colors duration-500",
          active ? "text-[#5eead4]" : "text-white/40",
        )}
        aria-hidden
      />
      <p
        className={cn(
          "text-xl font-bold tabular-nums leading-none transition-colors duration-500 sm:text-2xl",
          active ? "text-white" : "text-white/85",
        )}
      >
        {value}
      </p>
      <p className="text-[10px] leading-snug text-white/45 sm:text-xs">{label}</p>
    </div>
  );
}

/** One-line stats for sidebar / compact surfaces. */
export function CompactLiveStats({ className }: { className?: string }) {
  const { t, locale } = useLocale();
  const stats = usePublicStats();

  if (!stats) return null;

  const users = formatSocialProofNumber(stats.totalUsers, locale);
  const downloads = formatSocialProofNumber(stats.downloadsToday, locale);

  return (
    <p
      className={cn(
        "text-center text-[10px] leading-relaxed text-[var(--ink-tertiary)]",
        className,
      )}
    >
      <span className="font-medium text-[var(--ink-secondary)]">{users}</span>{" "}
      {t.authLiveUsersLabel}
      <span className="mx-1.5 text-[var(--ink-tertiary)]">·</span>
      <span className="font-medium text-[var(--ink-secondary)]">{downloads}</span>{" "}
      {t.authLiveDownloadsLabel}
    </p>
  );
}
