"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { Search } from "lucide-react";
import type { TimedWord, TranscriptEntry } from "@/features/transcription/types";
import { useLocale } from "@/context/LocaleContext";
import { Input } from "@/shared/ui/input";
import { cn } from "@/lib/utils";
import {
  buildSpeakerIndexMap,
  getSpeakerInitials,
  getSpeakerStyle,
} from "../lib/speaker-style";
import { findActiveLineIndex, timestampToSeconds } from "../lib/timestamp";
import {
  findActiveTimedWordIndex,
  indexOfWordInList,
  wordsForEntry,
} from "../lib/word-timing";
import { EditableSegmentText } from "./EditableSegmentText";

interface WordTimedTranscriptProps {
  entries: TranscriptEntry[];
  timedWords: TimedWord[];
  currentTime: number;
  isPlaying: boolean;
  onWordClick: (startTime: number) => void;
  query?: string;
  onQueryChange?: (query: string) => void;
  editable?: boolean;
  onEntryTextChange?: (index: number, text: string) => void;
  className?: string;
}

export function WordTimedTranscript({
  entries,
  timedWords,
  currentTime,
  isPlaying,
  onWordClick,
  query = "",
  onQueryChange,
  editable = true,
  onEntryTextChange,
  className,
}: WordTimedTranscriptProps) {
  const { t } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const entryRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const activeWordIndex = useMemo(
    () => findActiveTimedWordIndex(timedWords, currentTime),
    [timedWords, currentTime],
  );

  const activeEntryIndex = useMemo(
    () =>
      findActiveLineIndex(
        entries.map((e) => e.timestamp),
        currentTime,
      ),
    [entries, currentTime],
  );

  const speakerIndexMap = useMemo(
    () => buildSpeakerIndexMap(entries.map((e) => e.speaker)),
    [entries],
  );

  const filteredEntries = useMemo(() => {
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

  const setWordRef = useCallback((index: number, node: HTMLButtonElement | null) => {
    if (node) wordRefs.current.set(index, node);
    else wordRefs.current.delete(index);
  }, []);

  const setEntryRef = useCallback((index: number, node: HTMLDivElement | null) => {
    if (node) entryRefs.current.set(index, node);
    else entryRefs.current.delete(index);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    if (editable) {
      const node = entryRefs.current.get(activeEntryIndex);
      node?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }
    if (activeWordIndex < 0) return;
    const node = wordRefs.current.get(activeWordIndex);
    node?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeEntryIndex, activeWordIndex, editable, isPlaying]);

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      {onQueryChange && (
        <div className="relative mb-3 shrink-0">
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

      {editable && (
        <p className="mb-2 text-[11px] text-muted-foreground">{t.workspaceEditableHint}</p>
      )}

      <div
        ref={containerRef}
        className="min-h-[20rem] flex-1 space-y-3 overflow-y-auto rounded-xl border border-border/80 bg-muted/20 p-3 sm:p-4 lg:max-h-[min(70vh,560px)]"
      >
        {filteredEntries.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t.resNoResults}
          </p>
        ) : (
          filteredEntries.map(({ entry, index }) => {
            const speakerIdx = speakerIndexMap.get(entry.speaker) ?? 0;
            const isRight = speakerIdx % 2 === 1;
            const style = getSpeakerStyle(entry.speaker);
            const entryWords = wordsForEntry(entry, index, entries, timedWords);
            const isActiveEntry = editable && index === activeEntryIndex;

            return (
              <div
                key={`${index}-${entry.timestamp}`}
                ref={(node) => setEntryRef(index, node)}
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

                <div
                  className={cn(
                    "max-w-[88%] rounded-2xl border px-3 py-2.5 sm:max-w-[82%] sm:px-4",
                    style.bubble,
                    isRight ? "rounded-tr-sm" : "rounded-tl-sm",
                    isActiveEntry && "border-amber-300/60 shadow-sm",
                  )}
                >
                  <div
                    className={cn(
                      "mb-1.5 flex items-center gap-2 text-[10px]",
                      isRight ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    <span className="font-semibold text-foreground/90">
                      {entry.speaker}
                    </span>
                    <button
                      type="button"
                      onClick={() => onWordClick(timestampToSeconds(entry.timestamp))}
                      className="font-mono text-muted-foreground/80 transition-colors hover:text-amber-700"
                      title={t.workspaceSeek}
                    >
                      {entry.timestamp}
                    </button>
                  </div>

                  {editable ? (
                    <EditableSegmentText
                      value={entry.text}
                      onChange={(text) => onEntryTextChange?.(index, text)}
                      isActive={isActiveEntry}
                    />
                  ) : (
                    <p className="text-start leading-relaxed" dir="auto">
                      {entryWords.map((wordItem, wordIndex) => {
                        const globalIndex = indexOfWordInList(wordItem, timedWords);
                        const resolvedIndex =
                          globalIndex >= 0 ? globalIndex : wordIndex;
                        const isActive = resolvedIndex === activeWordIndex;
                        const isPast =
                          activeWordIndex >= 0 &&
                          resolvedIndex < activeWordIndex &&
                          wordItem.end_time <= currentTime;

                        return (
                          <span key={`${index}-${wordIndex}-${wordItem.word}`}>
                            <button
                              type="button"
                              ref={(node) => setWordRef(resolvedIndex, node)}
                              onClick={() => onWordClick(wordItem.start_time)}
                              className={cn(
                                "inline rounded px-0.5 py-0.5 text-[15px] transition-colors duration-100",
                                "hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
                                isActive &&
                                  "bg-amber-200/90 font-medium text-foreground shadow-sm ring-1 ring-amber-400/60",
                                !isActive && isPast && "text-foreground/75",
                                !isActive && !isPast && "text-foreground/90",
                              )}
                              title={`${wordItem.word} · ${wordItem.start_time.toFixed(1)}s`}
                            >
                              {wordItem.word}
                            </button>
                            {wordIndex < entryWords.length - 1 ? " " : null}
                          </span>
                        );
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
