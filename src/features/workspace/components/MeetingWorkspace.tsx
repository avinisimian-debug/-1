"use client";

import { useCallback, useMemo, useState } from "react";
import { Copy } from "lucide-react";
import type { MeetingChapter, TranscriptionResult } from "@/features/transcription/types";
import { useLocale } from "@/context/LocaleContext";
import { buildTranscriptText, copyToClipboard } from "@/lib/export";
import { Button } from "@/shared/ui/button";
import { useAudioPlayback } from "../hooks/useAudioPlayback";
import { timestampToSeconds } from "../lib/timestamp";
import { ChapterNavigation } from "./ChapterNavigation";
import { InteractiveTranscriptPlayer } from "./InteractiveTranscriptPlayer";
import { MeetingValueIndicator } from "./MeetingValueIndicator";
import { WorkspaceAudioPlayer } from "./WorkspaceAudioPlayer";

interface MeetingWorkspaceProps {
  result: TranscriptionResult;
  audioSrc?: string;
}

function resolveChapters(
  chapters: MeetingChapter[] | undefined,
  entries: TranscriptionResult["transcript"],
): MeetingChapter[] {
  if (chapters && chapters.length > 0) return chapters;

  if (entries.length === 0) return [];

  const titles = ["Introduction", "Discussion", "Key Points", "Action Items"];
  const step = Math.max(1, Math.floor(entries.length / titles.length));

  return titles
    .map((title, i) => {
      const entry = entries[Math.min(i * step, entries.length - 1)];
      return { timestamp: entry.timestamp, title };
    })
    .filter((ch, i, arr) => i === 0 || ch.timestamp !== arr[i - 1].timestamp);
}

function findActiveChapterIndex(chapters: MeetingChapter[], currentSeconds: number): number {
  if (chapters.length === 0) return -1;
  let active = 0;
  for (let i = 0; i < chapters.length; i++) {
    if (timestampToSeconds(chapters[i].timestamp) <= currentSeconds) {
      active = i;
    } else {
      break;
    }
  }
  return active;
}

export function MeetingWorkspace({ result, audioSrc }: MeetingWorkspaceProps) {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [scrollToIndex, setScrollToIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const playback = useAudioPlayback(audioSrc);
  const chapters = useMemo(
    () => resolveChapters(result.chapters, result.transcript),
    [result.chapters, result.transcript],
  );

  const activeChapterIndex = useMemo(
    () => findActiveChapterIndex(chapters, playback.currentTime),
    [chapters, playback.currentTime],
  );

  const handleLineClick = useCallback(
    (seconds: number) => {
      playback.seekTo(seconds);
      setScrollToIndex(null);
    },
    [playback],
  );

  const handleChapterSelect = useCallback(
    (_chapterIndex: number, timestamp: string) => {
      const seconds = timestampToSeconds(timestamp);
      playback.seekTo(seconds);
      const lineIndex = result.transcript.findIndex((e) => e.timestamp === timestamp);
      setScrollToIndex(lineIndex >= 0 ? lineIndex : null);
    },
    [playback, result.transcript],
  );

  const handleCopyTranscript = useCallback(async () => {
    const ok = await copyToClipboard(buildTranscriptText(result));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  return (
    <div className="space-y-4 [font-family:var(--font-inter),var(--font-geist-sans),system-ui,sans-serif]">
      <MeetingValueIndicator durationLabel={result.duration} />

      <WorkspaceAudioPlayer
        audioRef={playback.audioRef}
        audioSrc={audioSrc}
        currentTime={playback.currentTime}
        duration={playback.duration}
        isPlaying={playback.isPlaying}
        ready={playback.ready}
        onTogglePlay={playback.togglePlay}
        onSeek={playback.seekTo}
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <ChapterNavigation
          chapters={chapters}
          activeChapterIndex={activeChapterIndex}
          onChapterSelect={handleChapterSelect}
          variant="topbar"
        />

        <div className="flex gap-0 lg:gap-4 lg:p-4">
          <ChapterNavigation
            chapters={chapters}
            activeChapterIndex={activeChapterIndex}
            onChapterSelect={handleChapterSelect}
            variant="sidebar"
          />

          <div className="min-w-0 flex-1 p-3 sm:p-4 lg:p-0">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t.workspaceTranscript}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyTranscript}
                className="gap-2"
              >
                <Copy className="h-3.5 w-3.5" />
                {copied ? t.resCopied : t.workspaceCopyTranscript}
              </Button>
            </div>
            <InteractiveTranscriptPlayer
              entries={result.transcript}
              currentTime={playback.currentTime}
              onLineClick={handleLineClick}
              scrollToIndex={scrollToIndex}
              query={query}
              onQueryChange={setQuery}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
