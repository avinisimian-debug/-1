"use client";

import { useEffect, useState } from "react";
import { Activity, Users } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { formatSocialProofNumber } from "@/lib/social-proof-stats";
import { cn } from "@/lib/utils";

interface PublicStats {
  transcriptionsToday: number;
  totalUsers: number;
  saleActive: boolean;
}

const POLL_MS = 3 * 60 * 1000;

function useAnimatedNumber(target: number, durationMs = 900) {
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

export function LoginLiveStats({ className }: { className?: string }) {
  const { t, locale } = useLocale();
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    let active = true;

    const load = () => {
      fetch("/api/stats/public")
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

  const users = useAnimatedNumber(stats?.totalUsers ?? 0);
  const transcriptions = useAnimatedNumber(stats?.transcriptionsToday ?? 0);

  if (!stats) return null;

  const usersFormatted = formatSocialProofNumber(users, locale);
  const transcriptionsFormatted = formatSocialProofNumber(transcriptions, locale);

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center justify-center gap-4 sm:justify-between",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        {t.authLiveLabel}
      </span>

      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
        <div className="flex items-center gap-2.5 text-center sm:text-start">
          <Users className="h-5 w-5 shrink-0 text-accent" aria-hidden />
          <div>
            <p className="text-2xl font-bold tabular-nums leading-none text-foreground sm:text-3xl">
              {usersFormatted}+
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t.authLiveUsersLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-center sm:text-start">
          <Activity className="h-5 w-5 shrink-0 text-accent" aria-hidden />
          <div>
            <p className="text-2xl font-bold tabular-nums leading-none text-foreground sm:text-3xl">
              {transcriptionsFormatted}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t.authLiveTodayLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
