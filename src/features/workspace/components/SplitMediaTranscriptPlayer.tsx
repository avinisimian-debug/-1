"use client";

import { useEffect, useMemo } from "react";
import type { TimedWord, TranscriptEntry } from "@/features/transcription/types";
import type { useMediaPlayback } from "../hooks/useMediaPlayback";
import { collectTimedWords } from "../lib/word-timing";
import { MediaPlayerPane } from "./MediaPlayerPane";
import { WordTimedTranscript } from "./WordTimedTranscript";

type MediaPlayback = ReturnType<typeof useMediaPlayback>;

export interface SplitMediaTranscriptPlayerProps {
  entries: TranscriptEntry[];
  timedWords?: TimedWord[];
  mediaSrc?: string;
  mediaKind?: "audio" | "video";
  playback: MediaPlayback;
  query?: string;
  onQueryChange?: (query: string) => void;
  editable?: boolean;
  onEntryTextChange?: (index: number, text: string) => void;
  fallbackNotice?: string | null;
  className?: string;
}

/**
 * Split interactive player — media on the left, clickable word-level transcript on the right.
 */
export function SplitMediaTranscriptPlayer({
  entries,
  timedWords,
  mediaSrc,
  mediaKind = "audio",
  playback,
  query,
  onQueryChange,
  editable,
  onEntryTextChange,
  fallbackNotice,
  className,
}: SplitMediaTranscriptPlayerProps) {
  const words = collectTimedWords(entries, timedWords);

  const silenceGaps = useMemo(() => {
    if (words.length < 2) return [] as Array<{ start: number; end: number }>;
    const gaps: Array<{ start: number; end: number }> = [];
    for (let i = 0; i < words.length - 1; i++) {
      const end = words[i].end_time;
      const next = words[i + 1].start_time;
      if (next - end >= 0.85) {
        gaps.push({ start: end, end: next });
      }
    }
    return gaps;
  }, [words]);

  useEffect(() => {
    if (!playback.skipSilence || !playback.isPlaying) return;
    const gap = silenceGaps.find(
      (g) =>
        playback.currentTime >= g.start &&
        playback.currentTime < g.end - 0.05,
    );
    if (gap) {
      playback.seekTo(gap.end);
    }
  }, [
    playback.skipSilence,
    playback.isPlaying,
    playback.currentTime,
    playback.seekTo,
    silenceGaps,
  ]);

  const handleWordClick = (startTime: number) => {
    playback.seekTo(startTime);
    void playback.mediaRef.current?.play();
  };

  return (
    <div
      className={`grid gap-4 lg:grid-cols-2 lg:gap-6 ${className ?? ""}`}
    >
      <MediaPlayerPane
        mediaRef={playback.mediaRef}
        mediaSrc={mediaSrc}
        mediaKind={mediaKind}
        currentTime={playback.currentTime}
        duration={playback.duration}
        isPlaying={playback.isPlaying}
        ready={playback.ready}
        errorMessage={playback.error ? playback.errorMessage : null}
        fallbackNotice={fallbackNotice}
        playbackRate={playback.playbackRate}
        onPlaybackRateChange={playback.setPlaybackRate}
        skipSilence={playback.skipSilence}
        onSkipSilenceChange={playback.setSkipSilence}
        timedWords={words}
        onTogglePlay={playback.togglePlay}
        onSeek={playback.seekTo}
      />

      <WordTimedTranscript
        entries={entries}
        timedWords={words}
        currentTime={playback.currentTime}
        isPlaying={playback.isPlaying}
        onWordClick={handleWordClick}
        query={query}
        onQueryChange={onQueryChange}
        editable={editable}
        onEntryTextChange={onEntryTextChange}
      />
    </div>
  );
}
