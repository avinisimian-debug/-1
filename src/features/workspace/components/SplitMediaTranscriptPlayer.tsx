"use client";

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
  className?: string;
}

/**
 * Split interactive player — media on the left, clickable word-level transcript on the right.
 * Words use standard JSON timing: { word, start_time, end_time }.
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
  className,
}: SplitMediaTranscriptPlayerProps) {
  const words = collectTimedWords(entries, timedWords);

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
