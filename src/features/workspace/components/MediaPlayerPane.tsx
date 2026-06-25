"use client";

import { Pause, Play } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";
import { secondsToTimestamp } from "../lib/timestamp";

interface MediaPlayerPaneProps {
  mediaRef: React.RefObject<HTMLMediaElement | null>;
  mediaSrc?: string;
  mediaKind?: "audio" | "video";
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  ready: boolean;
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
  onTogglePlay,
  onSeek,
  className,
}: MediaPlayerPaneProps) {
  const { t } = useLocale();
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isVideo = mediaKind === "video";

  return (
    <div
      className={cn(
        "flex h-full min-h-[280px] flex-col rounded-xl border border-border bg-card shadow-sm",
        className,
      )}
    >
      <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-t-xl bg-black/95">
        {mediaSrc ? (
          isVideo ? (
            <video
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              src={mediaSrc}
              preload="metadata"
              playsInline
              className="max-h-[min(50vh,420px)] w-full object-contain"
              onClick={onTogglePlay}
            />
          ) : (
            <>
              <audio
                ref={mediaRef as React.RefObject<HTMLAudioElement>}
                src={mediaSrc}
                preload="metadata"
                className="hidden"
              />
              <div className="flex flex-col items-center gap-3 px-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                  <span className="text-2xl font-semibold text-white/90">♪</span>
                </div>
                <p className="max-w-xs text-xs text-white/60">{t.workspaceAudioMode}</p>
              </div>
            </>
          )
        ) : (
          <p className="px-6 text-center text-sm text-white/50">{t.workspaceNoAudio}</p>
        )}
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onTogglePlay}
            disabled={!mediaSrc}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
              mediaSrc
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
                className="absolute inset-y-0 start-0 rounded-full bg-foreground transition-[width] duration-75"
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
      </div>
    </div>
  );
}
