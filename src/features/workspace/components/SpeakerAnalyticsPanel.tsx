"use client";

import { useMemo } from "react";
import { useLocale } from "@/context/LocaleContext";
import type { TimedWord, TranscriptEntry } from "@/features/transcription/types";
import { cn } from "@/lib/utils";
import { computeSpeakerAirtime, estimateWpm } from "../lib/speaker-airtime";
import { secondsToTimestamp } from "../lib/timestamp";

const BAR_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#0ea5e9",
  "#f43f5e",
];

interface SpeakerAnalyticsPanelProps {
  entries: TranscriptEntry[];
  timedWords?: TimedWord[];
  sentimentLabel?: string;
  sentimentOverall?: string;
  className?: string;
}

export function SpeakerAnalyticsPanel({
  entries,
  timedWords,
  sentimentLabel,
  sentimentOverall,
  className,
}: SpeakerAnalyticsPanelProps) {
  const { t } = useLocale();
  const airtime = useMemo(
    () => computeSpeakerAirtime(entries, timedWords),
    [entries, timedWords],
  );
  const wpm = useMemo(() => estimateWpm(airtime), [airtime]);

  if (airtime.length === 0) return null;

  const circumference = 2 * Math.PI * 36;
  let dashOffset = 0;

  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card/70 p-4 shadow-xs backdrop-blur-md",
        className,
      )}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t.analyticsTitle}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
          {wpm > 0 && (
            <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 tabular-nums">
              {t.analyticsWpm}: {wpm}
            </span>
          )}
          {sentimentLabel && (
            <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 capitalize">
              {t.analyticsSentiment}: {sentimentLabel}
              {sentimentOverall ? ` (${sentimentOverall})` : ""}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative mx-auto h-28 w-28 shrink-0">
          <svg viewBox="0 0 88 88" className="-rotate-90" aria-hidden>
            <circle
              cx="44"
              cy="44"
              r="36"
              fill="none"
              stroke="var(--muted)"
              strokeWidth="10"
            />
            {airtime.map((row, index) => {
              const length = (row.percent / 100) * circumference;
              const el = (
                <circle
                  key={row.speaker + String(row.speakerId)}
                  cx="44"
                  cy="44"
                  r="36"
                  fill="none"
                  stroke={BAR_COLORS[index % BAR_COLORS.length]}
                  strokeWidth="10"
                  strokeDasharray={`${length} ${circumference - length}`}
                  strokeDashoffset={-dashOffset}
                  strokeLinecap="butt"
                />
              );
              dashOffset += length;
              return el;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-semibold tabular-nums text-foreground">
              {airtime.length}
            </span>
            <span className="text-[9px] uppercase tracking-wide text-muted-foreground">
              {t.analyticsSpeakers}
            </span>
          </div>
        </div>

        <ul className="min-w-0 flex-1 space-y-2">
          {airtime.map((row, index) => (
            <li key={row.speaker + String(row.speakerId)} className="min-w-0">
              <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                <span className="flex min-w-0 items-center gap-1.5 truncate font-medium text-foreground">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: BAR_COLORS[index % BAR_COLORS.length],
                    }}
                  />
                  {row.speaker}
                </span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {row.percent}% · {secondsToTimestamp(row.seconds)}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.max(row.percent, 2)}%`,
                    backgroundColor: BAR_COLORS[index % BAR_COLORS.length],
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
