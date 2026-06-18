"use client";

import { useEffect, useState } from "react";
import { Activity, Users } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

interface PublicStats {
  transcriptionsToday: number;
  totalUsers: number;
  saleActive: boolean;
}

export function LoginLiveStats({ className }: { className?: string }) {
  const { t } = useLocale();
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
    const interval = setInterval(load, 60_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (!stats) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-3 text-sm sm:justify-start",
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

      <span className="inline-flex items-center gap-1.5 text-zinc-600">
        <Activity className="h-3.5 w-3.5 text-indigo-600" aria-hidden />
        {t.authLiveToday.replace("{n}", String(stats.transcriptionsToday))}
      </span>

      <span className="inline-flex items-center gap-1.5 text-zinc-600">
        <Users className="h-3.5 w-3.5 text-indigo-600" aria-hidden />
        {t.authLiveUsers.replace("{n}", String(stats.totalUsers))}
      </span>
    </div>
  );
}
