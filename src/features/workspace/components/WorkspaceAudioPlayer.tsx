"use client";

import { Pause, Play } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";
import { secondsToTimestamp } from "../lib/timestamp";

interface WorkspaceAudioPlayerProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audioSrc?: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  ready: boolean;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
}

export function WorkspaceAudioPlayer({
  audioRef,
  audioSrc,
  currentTime,
  duration,
  isPlaying,
  ready,
  onTogglePlay,
  onSeek,
}: WorkspaceAudioPlayerProps) {
  const { t } = useLocale();
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      {audioSrc && (
        <audio ref={audioRef} src={audioSrc} preload="metadata" className="hidden" />
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onTogglePlay}
          disabled={!audioSrc}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
            audioSrc
              ? "bg-foreground text-background hover:bg-foreground/90"
              : "bg-muted text-muted-foreground",
          )}
          aria-label={isPlaying ? t.workspacePause : t.workspacePlay}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ms-0.5 h-4 w-4" />}
        </button>

        <div className="min-w-0 flex-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            disabled={!audioSrc || !ready}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer accent-foreground"
          />
          <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>{secondsToTimestamp(currentTime)}</span>
            <span>{duration > 0 ? secondsToTimestamp(duration) : "00:00"}</span>
          </div>
        </div>
      </div>

      {!audioSrc && (
        <p className="mt-3 text-xs text-muted-foreground">{t.workspaceNoAudio}</p>
      )}
    </div>
  );
}
