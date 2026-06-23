"use client";

import { useCallback, useMemo } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TranscriptEntry } from "@/features/transcription/types";
import { useAudioPlayback } from "../hooks/useAudioPlayback";
import {
  buildSpeakerIndexMap,
  getSpeakerInitials,
  getSpeakerStyle,
} from "../lib/speaker-style";
import { findActiveLineIndex, secondsToTimestamp, timestampToSeconds } from "../lib/timestamp";

export interface AudioTranscriptPlayerProps {
  entries: TranscriptEntry[];
  audioSrc?: string;
  className?: string;
  /** Auto-scroll active line while playing */
  followPlayback?: boolean;
}

/**
 * Apple-inspired synchronized audio + transcript player.
 * - Highlights the active line during playback
 * - Click any line to seek
 */
export function AudioTranscriptPlayer({
  entries,
  audioSrc,
  className,
  followPlayback = true,
}: AudioTranscriptPlayerProps) {
  const playback = useAudioPlayback(audioSrc);
  const timestamps = useMemo(() => entries.map((e) => e.timestamp), [entries]);
  const activeIndex = useMemo(
    () => findActiveLineIndex(timestamps, playback.currentTime),
    [timestamps, playback.currentTime],
  );
  const speakerIndexMap = useMemo(
    () => buildSpeakerIndexMap(entries.map((e) => e.speaker)),
    [entries],
  );

  const lineRef = useCallback(
    (index: number, node: HTMLButtonElement | null) => {
      if (!followPlayback || !node) return;
      if (index === activeIndex && playback.isPlaying) {
        node.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    },
    [activeIndex, followPlayback, playback.isPlaying],
  );

  const progress =
    playback.duration > 0 ? (playback.currentTime / playback.duration) * 100 : 0;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm",
        "[font-family:var(--font-inter),var(--font-geist-sans),system-ui,sans-serif]",
        className,
      )}
    >
      {audioSrc && (
        <audio ref={playback.audioRef} src={audioSrc} preload="metadata" className="hidden" />
      )}

      {/* Transport */}
      <div className="border-b border-border/50 bg-muted/20 px-5 py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={playback.togglePlay}
            disabled={!audioSrc}
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all",
              audioSrc
                ? "bg-foreground text-background shadow-md hover:scale-[1.02] active:scale-[0.98]"
                : "bg-muted text-muted-foreground",
            )}
            aria-label={playback.isPlaying ? "Pause" : "Play"}
          >
            {playback.isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="ms-0.5 h-4 w-4" />
            )}
          </button>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="relative h-1 overflow-hidden rounded-full bg-border/80">
              <div
                className="absolute inset-y-0 start-0 rounded-full bg-foreground transition-[width] duration-150"
                style={{ width: `${progress}%` }}
              />
              <input
                type="range"
                min={0}
                max={playback.duration || 100}
                step={0.1}
                value={playback.currentTime}
                disabled={!audioSrc || !playback.ready}
                onChange={(e) => playback.seekTo(Number(e.target.value))}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>
            <div className="flex justify-between font-mono text-[11px] tracking-wide text-muted-foreground">
              <span>{secondsToTimestamp(playback.currentTime)}</span>
              <span>
                {playback.duration > 0
                  ? secondsToTimestamp(playback.duration)
                  : "00:00"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript */}
      <div className="max-h-[28rem] space-y-2 overflow-y-auto px-4 py-5 sm:px-6">
        {entries.map((entry, index) => {
          const speakerIdx = speakerIndexMap.get(entry.speaker) ?? 0;
          const isRight = speakerIdx % 2 === 1;
          const style = getSpeakerStyle(entry.speaker);
          const isActive = index === activeIndex;

          return (
            <div
              key={`${index}-${entry.timestamp}`}
              className={cn(
                "flex gap-3",
                isRight ? "flex-row-reverse" : "flex-row",
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ring-1 ring-inset",
                  style.bg,
                  style.text,
                  style.ring,
                )}
              >
                {getSpeakerInitials(entry.speaker)}
              </div>

              <button
                type="button"
                ref={(node) => lineRef(index, node)}
                onClick={() => playback.seekTo(timestampToSeconds(entry.timestamp))}
                className={cn(
                  "max-w-[82%] rounded-2xl border px-4 py-3 text-start transition-all duration-200",
                  style.bubble,
                  isActive
                    ? "scale-[1.01] border-foreground/15 shadow-md ring-2 ring-foreground/10"
                    : "hover:border-foreground/10 hover:shadow-sm",
                  isRight ? "rounded-tr-md" : "rounded-tl-md",
                )}
              >
                <p className="mb-1 flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  <span className="text-foreground/80">{entry.speaker}</span>
                  <span className="font-mono normal-case">{entry.timestamp}</span>
                </p>
                <p className="text-[15px] leading-relaxed text-foreground/90">
                  {entry.text}
                </p>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
