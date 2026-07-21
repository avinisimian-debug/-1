"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Pause, Play } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";
import { secondsToTimestamp } from "../lib/timestamp";
import type { TimedWord } from "@/features/transcription/types";
import { SpeakerTimelineScrubber } from "./SpeakerTimelineScrubber";

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

interface MediaPlayerPaneProps {
  mediaRef: React.RefObject<HTMLMediaElement | null>;
  mediaSrc?: string;
  mediaKind?: "audio" | "video";
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  ready: boolean;
  errorMessage?: string | null;
  fallbackNotice?: string | null;
  playbackRate?: number;
  onPlaybackRateChange?: (rate: number) => void;
  skipSilence?: boolean;
  onSkipSilenceChange?: (value: boolean) => void;
  timedWords?: TimedWord[];
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  className?: string;
}

export function MediaPlayerPane({
  mediaRef,
  mediaSrc,
  mediaKind = "audio",
  currentTime,
  duration,
  isPlaying,
  ready,
  errorMessage,
  fallbackNotice,
  playbackRate = 1,
  onPlaybackRateChange,
  skipSilence = false,
  onSkipSilenceChange,
  timedWords,
  onTogglePlay,
  onSeek,
  className,
}: MediaPlayerPaneProps) {
  const { t } = useLocale();
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isVideo = mediaKind === "video";
  const [showNativeControls, setShowNativeControls] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        onTogglePlay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onTogglePlay]);

  return (
    <div
      className={cn(
        "flex h-full min-h-[280px] flex-col rounded-xl border border-border/80 bg-card/80 shadow-sm backdrop-blur-md",
        className,
      )}
    >
      <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-t-xl bg-zinc-950">
        {mediaSrc ? (
          isVideo ? (
            <video
              key={`video-${mediaSrc}`}
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              src={mediaSrc}
              preload="metadata"
              playsInline
              controls={showNativeControls}
              className="max-h-[min(50vh,420px)] w-full object-contain"
              onClick={onTogglePlay}
              onContextMenu={() => setShowNativeControls(true)}
            />
          ) : (
            <>
              <audio
                key={`audio-${mediaSrc}`}
                ref={mediaRef as React.RefObject<HTMLAudioElement>}
                src={mediaSrc}
                preload="metadata"
                className="hidden"
              />
              <div className="flex flex-col items-center gap-3 px-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 shadow-[0_0_40px_rgba(99,102,241,0.25)]">
                  <span className="text-2xl font-semibold text-white/90">♪</span>
                </div>
                <p className="max-w-xs text-xs text-white/60">
                  {fallbackNotice || t.workspaceAudioMode}
                </p>
              </div>
            </>
          )
        ) : (
          <div className="max-w-sm space-y-2 px-6 text-center">
            <p className="text-sm text-white/50">{t.workspaceNoAudio}</p>
            <p className="text-xs text-white/35">{t.workspacePlaybackTip}</p>
          </div>
        )}

        {errorMessage && mediaSrc && (
          <div className="absolute inset-x-3 bottom-3 rounded-lg border border-amber-500/40 bg-amber-950/90 px-3 py-2 text-start text-xs text-amber-100 shadow-lg backdrop-blur-sm">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              <p>{errorMessage}</p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 border-t border-border p-4">
        {timedWords && timedWords.length > 0 && (
          <SpeakerTimelineScrubber
            timedWords={timedWords}
            duration={duration}
            currentTime={currentTime}
            onSeek={onSeek}
          />
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onTogglePlay}
            disabled={!mediaSrc || Boolean(errorMessage && !ready)}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
              mediaSrc && !errorMessage
                ? "bg-foreground text-background hover:bg-foreground/90"
                : mediaSrc && ready
                  ? "bg-foreground text-background hover:bg-foreground/90"
                  : "bg-muted text-muted-foreground",
            )}
            aria-label={isPlaying ? t.workspacePause : t.workspacePlay}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="ms-0.5 h-4 w-4" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="relative h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="absolute inset-y-0 start-0 rounded-full bg-accent transition-[width] duration-75"
                style={{ width: `${progress}%` }}
              />
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.05}
                value={currentTime}
                disabled={!mediaSrc || !ready}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label={t.workspaceSeek}
              />
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted-foreground">
              <span>{secondsToTimestamp(currentTime)}</span>
              <span>{duration > 0 ? secondsToTimestamp(duration) : "00:00"}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div
            role="group"
            aria-label={t.playbackSpeed}
            className="flex flex-wrap items-center gap-1"
          >
            {PLAYBACK_RATES.map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => onPlaybackRateChange?.(rate)}
                className={cn(
                  "rounded-md px-2 py-1 text-[10px] font-semibold tabular-nums transition-colors",
                  playbackRate === rate
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {rate}x
              </button>
            ))}
          </div>

          {onSkipSilenceChange && (
            <label className="inline-flex cursor-pointer items-center gap-2 text-[10px] font-medium text-muted-foreground">
              <input
                type="checkbox"
                checked={skipSilence}
                onChange={(e) => onSkipSilenceChange(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-border accent-[var(--accent)]"
              />
              {t.playbackSkipSilence}
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
