"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Loader2, Save } from "lucide-react";
import type { MeetingChapter, TranscriptionResult } from "@/features/transcription/types";
import { applySpeakerLabelOverrides } from "@/features/transcription/lib/speaker-labels";
import { useLocale } from "@/context/LocaleContext";
import { buildTranscriptText, copyToClipboard } from "@/lib/export";
import {
  updateHistorySpeakerLabels,
  updateHistoryTranscript,
} from "@/lib/history-store";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import { useMediaPlayback } from "../hooks/useMediaPlayback";
import { timestampToSeconds } from "../lib/timestamp";
import { ChapterNavigation } from "./ChapterNavigation";
import { MeetingValueIndicator } from "./MeetingValueIndicator";
import { SpeakerAnalyticsPanel } from "./SpeakerAnalyticsPanel";
import { SpeakerRenamePanel } from "./SpeakerRenamePanel";
import { SplitMediaTranscriptPlayer } from "./SplitMediaTranscriptPlayer";
import { TranscriptChatPanel } from "@/features/chat/components/TranscriptChatPanel";

type SaveStatus = "saved" | "saving" | "unsaved";

interface MeetingWorkspaceProps {
  result: TranscriptionResult;
  mediaSrc?: string;
  mediaKind?: "audio" | "video";
  onSpeakerLabelsChange?: (labels: Record<string, string>) => void;
  onTranscriptChange?: (transcript: TranscriptionResult["transcript"]) => void;
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

const AUTO_SAVE_MS = 1500;

export function MeetingWorkspace({
  result,
  mediaSrc,
  mediaKind = "audio",
  onSpeakerLabelsChange,
  onTranscriptChange,
}: MeetingWorkspaceProps) {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [speakerLabels, setSpeakerLabels] = useState<Record<string, string>>(
    () => result.speakerLabels ?? {},
  );

  const lastSavedRef = useRef(JSON.stringify(result.transcript));
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    lastSavedRef.current = JSON.stringify(result.transcript);
    setSaveStatus("saved");
  }, [result.fileName, result.processedAt]);

  const displayEntries = useMemo(
    () => applySpeakerLabelOverrides(result.transcript, speakerLabels),
    [result.transcript, speakerLabels],
  );

  const displayTimedWords = useMemo(() => {
    if (!result.timedWords?.length) return undefined;
    return result.timedWords.map((word) => {
      const speakerId = word.speakerId;
      const renamed =
        speakerId && speakerLabels[speakerId]
          ? speakerLabels[speakerId]
          : word.speaker;
      return renamed && renamed !== word.speaker
        ? { ...word, speaker: renamed }
        : word;
    });
  }, [result.timedWords, speakerLabels]);

  const resultForExport = useMemo(
    () => ({ ...result, speakerLabels }),
    [result, speakerLabels],
  );

  const playback = useMediaPlayback(mediaSrc);
  const chapters = useMemo(
    () => resolveChapters(result.chapters, result.transcript),
    [result.chapters, result.transcript],
  );

  const activeChapterIndex = useMemo(
    () => findActiveChapterIndex(chapters, playback.currentTime),
    [chapters, playback.currentTime],
  );

  const persistTranscript = useCallback(
    (transcript: TranscriptionResult["transcript"]) => {
      updateHistoryTranscript(result.fileName, result.processedAt, transcript);
      lastSavedRef.current = JSON.stringify(transcript);
      setSaveStatus("saved");
    },
    [result.fileName, result.processedAt],
  );

  useEffect(() => {
    const serialized = JSON.stringify(result.transcript);
    if (serialized === lastSavedRef.current) {
      setSaveStatus("saved");
      return;
    }

    setSaveStatus("unsaved");

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      setSaveStatus("saving");
      persistTranscript(result.transcript);
    }, AUTO_SAVE_MS);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [result.transcript, persistTranscript]);

  const handleSaveNow = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    setSaveStatus("saving");
    persistTranscript(result.transcript);
  }, [persistTranscript, result.transcript]);

  const handleSpeakerLabelsChange = useCallback(
    (labels: Record<string, string>) => {
      setSpeakerLabels(labels);
      onSpeakerLabelsChange?.(labels);
      updateHistorySpeakerLabels(
        result.fileName,
        result.processedAt,
        labels,
      );
    },
    [onSpeakerLabelsChange, result.fileName, result.processedAt],
  );

  const handleEntryTextChange = useCallback(
    (index: number, text: string) => {
      const updated = result.transcript.map((entry, i) =>
        i === index ? { ...entry, text } : entry,
      );
      onTranscriptChange?.(updated);
    },
    [onTranscriptChange, result.transcript],
  );

  const handleChapterSelect = useCallback(
    (_chapterIndex: number, timestamp: string) => {
      playback.seekTo(timestampToSeconds(timestamp));
    },
    [playback],
  );

  const handleCopyTranscript = useCallback(async () => {
    const ok = await copyToClipboard(buildTranscriptText(resultForExport));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [resultForExport]);

  const saveLabel =
    saveStatus === "saving"
      ? t.workspaceTranscriptSaving
      : saveStatus === "saved"
        ? t.workspaceTranscriptSaved
        : t.workspaceTranscriptUnsaved;

  return (
    <div className="space-y-4 [font-family:var(--font-inter),var(--font-geist-sans),system-ui,sans-serif]">
      <MeetingValueIndicator durationLabel={result.duration} />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <ChapterNavigation
          chapters={chapters}
          activeChapterIndex={activeChapterIndex}
          onChapterSelect={handleChapterSelect}
          variant="topbar"
        />

        <div className="p-3 sm:p-4 lg:p-5">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t.workspaceInteractivePlayer}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "text-[11px] font-medium",
                  saveStatus === "saved" && "text-emerald-600",
                  saveStatus === "saving" && "text-muted-foreground",
                  saveStatus === "unsaved" && "text-amber-700",
                )}
              >
                {saveLabel}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSaveNow}
                disabled={saveStatus === "saved" || saveStatus === "saving"}
                className="gap-2"
              >
                {saveStatus === "saving" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : saveStatus === "saved" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                {t.workspaceSaveTranscript}
              </Button>
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
          </div>

          <SpeakerRenamePanel
            entries={result.transcript}
            speakerLabels={speakerLabels}
            onSpeakerLabelsChange={handleSpeakerLabelsChange}
            diarizationEnabled={result.diarizationEnabled}
            className="mb-4"
          />

          <SpeakerAnalyticsPanel
            entries={displayEntries}
            timedWords={displayTimedWords}
            sentimentLabel={result.sentiment?.label}
            sentimentOverall={result.sentiment?.overall}
            className="mb-4"
          />

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(280px,340px)]">
            <SplitMediaTranscriptPlayer
              entries={displayEntries}
              timedWords={displayTimedWords}
              mediaSrc={mediaSrc}
              mediaKind={mediaKind}
              playback={playback}
              query={query}
              onQueryChange={setQuery}
              editable
              onEntryTextChange={handleEntryTextChange}
            />
            <TranscriptChatPanel
              result={resultForExport}
              onCiteSeek={(timestamp) => {
                playback.seekTo(timestampToSeconds(timestamp));
                void playback.mediaRef.current?.play();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
