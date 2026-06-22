"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { Search } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { Input } from "@/shared/ui/input";
import { cn } from "@/lib/utils";
import type { TranscriptEntry } from "@/features/transcription/types";
import {
  buildSpeakerIndexMap,
  getSpeakerInitials,
  getSpeakerStyle,
} from "../lib/speaker-style";
import { findActiveLineIndex, timestampToSeconds } from "../lib/timestamp";

interface InteractiveTranscriptPlayerProps {
  entries: TranscriptEntry[];
  currentTime: number;
  onLineClick: (seconds: number) => void;
  scrollToIndex?: number | null;
  query?: string;
  onQueryChange?: (query: string) => void;
}

export function InteractiveTranscriptPlayer({
  entries,
  currentTime,
  onLineClick,
  scrollToIndex = null,
  query = "",
  onQueryChange,
}: InteractiveTranscriptPlayerProps) {
  const { t } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const timestamps = useMemo(() => entries.map((e) => e.timestamp), [entries]);
  const activeIndex = useMemo(
    () => findActiveLineIndex(timestamps, currentTime),
    [timestamps, currentTime],
  );

  const speakerIndexMap = useMemo(
    () => buildSpeakerIndexMap(entries.map((e) => e.speaker)),
    [entries],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return entries.map((entry, index) => ({ entry, index }));
    const q = query.toLowerCase();
    return entries
      .map((entry, index) => ({ entry, index }))
      .filter(
        ({ entry }) =>
          entry.text.toLowerCase().includes(q) ||
          entry.speaker.toLowerCase().includes(q),
      );
  }, [entries, query]);

  const setLineRef = useCallback((index: number, node: HTMLDivElement | null) => {
    if (node) {
      lineRefs.current.set(index, node);
    } else {
      lineRefs.current.delete(index);
    }
  }, []);

  useEffect(() => {
    if (scrollToIndex == null || scrollToIndex < 0) return;
    const node = lineRefs.current.get(scrollToIndex);
    node?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [scrollToIndex]);

  useEffect(() => {
    if (activeIndex < 0 || scrollToIndex != null) return;
    const node = lineRefs.current.get(activeIndex);
    node?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeIndex, scrollToIndex]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {onQueryChange && (
        <div className="relative mb-3">
          <Search className="absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={t.resSearchTranscript}
            className="ps-9"
          />
        </div>
      )}

      <div
        ref={containerRef}
        className="min-h-[20rem] flex-1 space-y-3 overflow-y-auto rounded-xl border border-border/80 bg-muted/20 p-3 sm:p-4 lg:max-h-[32rem]"
      >
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{t.resNoResults}</p>
        ) : (
          filtered.map(({ entry, index }) => {
            const speakerIdx = speakerIndexMap.get(entry.speaker) ?? 0;
            const isRight = speakerIdx % 2 === 1;
            const style = getSpeakerStyle(entry.speaker);
            const isActive = index === activeIndex;

            return (
              <div
                key={`${index}-${entry.timestamp}`}
                ref={(node) => setLineRef(index, node)}
                className={cn(
                  "flex w-full gap-2 sm:gap-3",
                  isRight ? "flex-row-reverse" : "flex-row",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ring-2",
                    style.bg,
                    style.text,
                    style.ring,
                  )}
                  aria-hidden
                >
                  {getSpeakerInitials(entry.speaker)}
                </div>

                <button
                  type="button"
                  onClick={() => onLineClick(timestampToSeconds(entry.timestamp))}
                  className={cn(
                    "group max-w-[85%] rounded-2xl border px-3 py-2.5 text-start shadow-xs transition-all sm:max-w-[78%] sm:px-4",
                    style.bubble,
                    isActive
                      ? "ring-2 ring-foreground/20 shadow-md"
                      : "hover:shadow-sm",
                    isRight ? "rounded-tr-sm" : "rounded-tl-sm",
                  )}
                >
                  <div
                    className={cn(
                      "mb-1 flex items-center gap-2 text-[10px]",
                      isRight ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    <span className="font-semibold text-foreground/90">{entry.speaker}</span>
                    <span className="font-mono text-muted-foreground/80">{entry.timestamp}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">{entry.text}</p>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
