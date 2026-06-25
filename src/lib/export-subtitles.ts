import { timestampToSeconds } from "@/lib/format";
import type { TranscriptionResult } from "@/features/transcription/types";
import { applySpeakerLabelOverrides } from "@/features/transcription/lib/speaker-labels";

export interface SubtitleCue {
  start: number;
  end: number;
  text: string;
}

/** SubRip: HH:MM:SS,mmm */
export function formatSrtTimestamp(seconds: number): string {
  const clamped = Math.max(0, seconds);
  const h = Math.floor(clamped / 3600);
  const m = Math.floor((clamped % 3600) / 60);
  const s = Math.floor(clamped % 60);
  const ms = Math.round((clamped % 1) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

/** WebVTT: HH:MM:SS.mmm */
export function formatVttTimestamp(seconds: number): string {
  const clamped = Math.max(0, seconds);
  const h = Math.floor(clamped / 3600);
  const m = Math.floor((clamped % 3600) / 60);
  const s = Math.floor(clamped % 60);
  const ms = Math.round((clamped % 1) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

function parseDurationSeconds(durationLabel: string): number | undefined {
  const trimmed = durationLabel.trim();
  if (!trimmed || trimmed === "—") return undefined;
  const normalized = trimmed.includes(":") ? trimmed : `0:${trimmed}`;
  const seconds = timestampToSeconds(normalized);
  return seconds > 0 ? seconds : undefined;
}

function escapeVttText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Build subtitle cues from timestamped transcript JSON. */
export function buildSubtitleCues(result: TranscriptionResult): SubtitleCue[] {
  const entries = applySpeakerLabelOverrides(
    result.transcript,
    result.speakerLabels,
  );
  if (entries.length === 0) return [];

  const totalDuration = parseDurationSeconds(result.duration);

  return entries.map((entry, index) => {
    const start = timestampToSeconds(entry.timestamp);
    let end: number;

    if (entry.words?.length) {
      end = entry.words[entry.words.length - 1].end_time;
    } else if (result.timedWords?.length) {
      const wordsInRange = result.timedWords.filter(
        (w) =>
          w.start_time >= start &&
          (index >= entries.length - 1 ||
            w.start_time < timestampToSeconds(entries[index + 1].timestamp)),
      );
      if (wordsInRange.length > 0) {
        end = wordsInRange[wordsInRange.length - 1].end_time;
      } else if (index < entries.length - 1) {
        end = timestampToSeconds(entries[index + 1].timestamp) - 0.01;
      } else {
        end = start + Math.max(1.5, entry.text.split(/\s+/).length * 0.35);
      }
    } else if (index < entries.length - 1) {
      end = timestampToSeconds(entries[index + 1].timestamp) - 0.01;
    } else {
      end = start + Math.max(2, entry.text.split(/\s+/).length * 0.4);
    }

    end = Math.max(end, start + 0.3);
    if (totalDuration != null) {
      end = Math.min(end, totalDuration);
    }

    return {
      start,
      end,
      text: `${entry.speaker}: ${entry.text}`.trim(),
    };
  });
}

export function buildSrtContent(cues: SubtitleCue[]): string {
  return cues
    .map((cue, index) => {
      const lines = [
        String(index + 1),
        `${formatSrtTimestamp(cue.start)} --> ${formatSrtTimestamp(cue.end)}`,
        cue.text,
      ];
      return lines.join("\n");
    })
    .join("\n\n")
    .concat("\n");
}

export function buildVttContent(cues: SubtitleCue[], title?: string): string {
  const header = ["WEBVTT", title ? `NOTE ${title}` : "", ""].filter(
    (line) => line !== "",
  );
  const body = cues.map((cue) => {
    return `${formatVttTimestamp(cue.start)} --> ${formatVttTimestamp(cue.end)}\n${escapeVttText(cue.text)}`;
  });
  return `${header.join("\n")}\n\n${body.join("\n\n")}\n`;
}

export function buildSrtFromResult(result: TranscriptionResult): string {
  return buildSrtContent(buildSubtitleCues(result));
}

export function buildVttFromResult(result: TranscriptionResult): string {
  return buildVttContent(buildSubtitleCues(result), result.fileName);
}
