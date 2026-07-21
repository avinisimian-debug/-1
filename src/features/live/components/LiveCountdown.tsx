"use client";

import { useEffect, useState } from "react";
import { getCountdown, type CountdownParts } from "../lib/calendar";

interface LiveCountdownProps {
  startsAt: string;
  durationMinutes: number;
  liveLabel: string;
  pastLabel: string;
}

export function LiveCountdown({
  startsAt,
  durationMinutes,
  liveLabel,
  pastLabel,
}: LiveCountdownProps) {
  const [parts, setParts] = useState<CountdownParts>(() =>
    getCountdown(startsAt, durationMinutes),
  );

  useEffect(() => {
    const tick = () => setParts(getCountdown(startsAt, durationMinutes));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [startsAt, durationMinutes]);

  if (parts.isLive) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        {liveLabel}
      </div>
    );
  }

  if (parts.isPast) {
    return (
      <span className="text-xs font-medium text-muted-foreground">{pastLabel}</span>
    );
  }

  const cells = [
    { label: "d", value: parts.days },
    { label: "h", value: parts.hours },
    { label: "m", value: parts.minutes },
    { label: "s", value: parts.seconds },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5" aria-live="polite">
      {cells.map((cell) => (
        <div
          key={cell.label}
          className="min-w-[2.75rem] rounded-lg border border-border/80 bg-background px-2 py-1 text-center"
        >
          <div className="font-mono text-sm font-bold tabular-nums text-foreground">
            {String(cell.value).padStart(2, "0")}
          </div>
          <div className="text-[9px] uppercase tracking-wide text-muted-foreground">
            {cell.label}
          </div>
        </div>
      ))}
    </div>
  );
}
