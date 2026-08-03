"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import type { TranscriptEntry } from "@/features/transcription/types";
import {
  findActiveLineIndex,
  timestampToSeconds,
} from "@/features/workspace/lib/timestamp";
import { cn } from "@/lib/utils";

interface TranscriptTimelineProps {
  entries: TranscriptEntry[];
  currentSeconds: number;
  onSeek: (seconds: number) => void;
  highlightTimestamp?: string | null;
  ahaTargetTimestamp?: string | null;
  ahaHighlight?: boolean;
  className?: string;
}

export function TranscriptTimeline({
  entries,
  currentSeconds,
  onSeek,
  highlightTimestamp,
  ahaTargetTimestamp,
  ahaHighlight,
  className,
}: TranscriptTimelineProps) {
  const [query, setQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement | null>(null);

  const activeIndex = useMemo(() => {
    if (highlightTimestamp) {
      const t = timestampToSeconds(highlightTimestamp);
      return findActiveLineIndex(
        entries.map((e) => e.timestamp),
        t + 0.05,
      );
    }
    return findActiveLineIndex(
      entries.map((e) => e.timestamp),
      currentSeconds,
    );
  }, [entries, currentSeconds, highlightTimestamp]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries.map((e, i) => ({ e, i }));
    return entries
      .map((e, i) => ({ e, i }))
      .filter(
        ({ e }) =>
          e.text.toLowerCase().includes(q) ||
          e.speaker.toLowerCase().includes(q) ||
          e.timestamp.includes(q),
      );
  }, [entries, query]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div className="border-b border-[var(--line-subtle)] px-3 py-2.5">
        <label className="relative block">
          <Search className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[var(--ink-tertiary)]" />
          <input
            value={query}
            onChange={(ev) => setQuery(ev.target.value)}
            placeholder="חפשו בתמלול…"
            className="h-10 w-full rounded-xl border border-[var(--line-strong)] bg-[var(--bg-elevated)] pe-3 ps-8 text-sm outline-none ring-[var(--accent-glow)] placeholder:text-[var(--ink-tertiary)] focus:border-[var(--accent)] focus:ring-2"
          />
        </label>
      </div>

      <div ref={listRef} className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {filtered.map(({ e, i }) => {
          const isActive = i === activeIndex;
          const isAha =
            ahaHighlight &&
            ahaTargetTimestamp &&
            e.timestamp === ahaTargetTimestamp;
          return (
            <button
              key={`${e.timestamp}-${i}`}
              ref={isActive || isAha ? activeRef : undefined}
              type="button"
              onClick={() => onSeek(timestampToSeconds(e.timestamp))}
              className={cn(
                "lat-transcript-line w-full rounded-e-xl py-2.5 text-start transition",
                isAha && "ring-2 ring-[var(--signal)] ring-offset-2",
              )}
              data-active={isActive || isAha ? "true" : "false"}
            >
              <div className="mb-0.5 flex items-center gap-2">
                <span className="font-mono-time text-[11px] text-[var(--ink-tertiary)]">
                  {e.timestamp}
                </span>
                <span className="text-xs font-semibold text-[var(--ink-secondary)]">
                  {e.speaker}
                </span>
              </div>
              <p className="text-[15px] leading-relaxed text-[var(--ink-primary)]">
                {e.text}
              </p>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="px-3 py-8 text-center text-sm text-[var(--ink-tertiary)]">
            אין תוצאות
          </p>
        )}
      </div>
    </div>
  );
}
