"use client";

import { useMemo } from "react";
import type { TimedWord } from "@/features/transcription/types";
import { cn } from "@/lib/utils";

const REGION_COLORS = [
  "rgba(99,102,241,0.75)",
  "rgba(16,185,129,0.75)",
  "rgba(245,158,11,0.75)",
  "rgba(139,92,246,0.75)",
  "rgba(14,165,233,0.75)",
];

interface SpeakerTimelineScrubberProps {
  timedWords?: TimedWord[];
  duration: number;
  currentTime: number;
  onSeek: (seconds: number) => void;
  className?: string;
}

interface Region {
  start: number;
  end: number;
  speaker: string;
  color: string;
}

function buildRegions(words: TimedWord[], duration: number): Region[] {
  if (words.length === 0 || duration <= 0) return [];

  const speakerColors = new Map<string, string>();
  let colorIdx = 0;
  const regions: Region[] = [];

  for (const word of words) {
    const speaker = word.speaker || word.speakerId || "Speaker";
    if (!speakerColors.has(speaker)) {
      speakerColors.set(
        speaker,
        REGION_COLORS[colorIdx++ % REGION_COLORS.length],
      );
    }
    const start = Math.max(0, word.start_time);
    const end = Math.max(start + 0.05, word.end_time || start + 0.2);
    const last = regions[regions.length - 1];
    if (last && last.speaker === speaker && start - last.end < 0.35) {
      last.end = end;
    } else {
      regions.push({
        start,
        end,
        speaker,
        color: speakerColors.get(speaker)!,
      });
    }
  }

  return regions;
}

export function SpeakerTimelineScrubber({
  timedWords,
  duration,
  currentTime,
  onSeek,
  className,
}: SpeakerTimelineScrubberProps) {
  const regions = useMemo(
    () => buildRegions(timedWords ?? [], duration),
    [timedWords, duration],
  );

  if (!duration || regions.length === 0) return null;

  const progress = Math.min(100, (currentTime / duration) * 100);

  return (
    <div className={cn("space-y-1.5", className)}>
      <div
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(currentTime)}
        aria-label="Speaker timeline"
        className="relative h-8 cursor-pointer overflow-hidden rounded-lg border border-border/60 bg-muted/40"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const ratio = (e.clientX - rect.left) / rect.width;
          onSeek(Math.max(0, Math.min(duration, ratio * duration)));
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") onSeek(Math.min(duration, currentTime + 2));
          if (e.key === "ArrowLeft") onSeek(Math.max(0, currentTime - 2));
        }}
      >
        {regions.map((region, i) => {
          const left = (region.start / duration) * 100;
          const width = ((region.end - region.start) / duration) * 100;
          return (
            <div
              key={`${region.start}-${i}`}
              title={region.speaker}
              className="absolute inset-y-1 rounded-sm"
              style={{
                insetInlineStart: `${left}%`,
                width: `${Math.max(width, 0.2)}%`,
                backgroundColor: region.color,
              }}
            />
          );
        })}
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-foreground"
          style={{ insetInlineStart: `${progress}%` }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground">
        Color blocks = speaker turns · click to seek
      </p>
    </div>
  );
}
