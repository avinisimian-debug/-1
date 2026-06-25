import { formatTimestamp } from "@/lib/format";
import type { TranscriptEntry } from "../types";

export interface DiarizationUtterance {
  speakerId: string;
  speakerLabel: string;
  startMs: number;
  endMs: number;
  text: string;
}

interface WhisperSegment {
  start: number;
  end: number;
  text: string;
}

function overlapMs(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): number {
  const start = Math.max(aStart, bStart);
  const end = Math.min(aEnd, bEnd);
  return Math.max(0, end - start);
}

/** Assign diarization labels to Whisper segments by timestamp overlap. */
export function alignWhisperSegmentsWithDiarization(
  segments: WhisperSegment[],
  utterances: DiarizationUtterance[],
): TranscriptEntry[] {
  if (segments.length === 0) return [];

  return segments.map((segment) => {
    const segStartMs = segment.start * 1000;
    const segEndMs = segment.end * 1000;

    let best: DiarizationUtterance | null = null;
    let bestOverlap = 0;

    for (const utterance of utterances) {
      const overlap = overlapMs(
        segStartMs,
        segEndMs,
        utterance.startMs,
        utterance.endMs,
      );
      if (overlap > bestOverlap) {
        bestOverlap = overlap;
        best = utterance;
      }
    }

    if (!best) {
      const midpoint = (segStartMs + segEndMs) / 2;
      best =
        utterances.find(
          (u) => midpoint >= u.startMs && midpoint <= u.endMs,
        ) ?? utterances[0] ?? null;
    }

    return {
      timestamp: formatTimestamp(segment.start),
      speaker: best?.speakerLabel ?? "Speaker 1",
      ...(best?.speakerId ? { speakerId: best.speakerId } : {}),
      text: segment.text.trim(),
    };
  });
}

/** Build transcript lines directly from diarization utterances. */
export function utterancesToTranscript(
  utterances: DiarizationUtterance[],
): TranscriptEntry[] {
  return utterances
    .filter((u) => u.text.trim())
    .map((utterance) => ({
      timestamp: formatTimestamp(utterance.startMs / 1000),
      speaker: utterance.speakerLabel,
      speakerId: utterance.speakerId,
      text: utterance.text.trim(),
    }));
}
