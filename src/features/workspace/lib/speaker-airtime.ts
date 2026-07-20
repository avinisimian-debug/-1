import type { TimedWord, TranscriptEntry } from "@/features/transcription/types";
import { timestampToSeconds } from "@/features/workspace/lib/timestamp";

export interface SpeakerAirtime {
  speaker: string;
  speakerId?: string;
  seconds: number;
  percent: number;
  words: number;
}

export function computeSpeakerAirtime(
  entries: TranscriptEntry[],
  timedWords?: TimedWord[],
): SpeakerAirtime[] {
  const totals = new Map<
    string,
    { speaker: string; speakerId?: string; seconds: number; words: number }
  >();

  if (timedWords && timedWords.length > 0) {
    for (const word of timedWords) {
      const key = word.speakerId || word.speaker || "Speaker";
      const label = word.speaker || key;
      const dur = Math.max(0, (word.end_time ?? 0) - (word.start_time ?? 0));
      const prev = totals.get(key) ?? {
        speaker: label,
        speakerId: word.speakerId,
        seconds: 0,
        words: 0,
      };
      prev.seconds += dur > 0 ? dur : 0.25;
      prev.words += 1;
      totals.set(key, prev);
    }
  } else {
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const start = timestampToSeconds(entry.timestamp);
      const next = entries[i + 1];
      const end = next
        ? timestampToSeconds(next.timestamp)
        : start + Math.max(2, entry.text.split(/\s+/).length * 0.4);
      const key = entry.speakerId || entry.speaker;
      const prev = totals.get(key) ?? {
        speaker: entry.speaker,
        speakerId: entry.speakerId,
        seconds: 0,
        words: 0,
      };
      prev.seconds += Math.max(0.5, end - start);
      prev.words += entry.text.split(/\s+/).filter(Boolean).length;
      totals.set(key, prev);
    }
  }

  const rows = Array.from(totals.values());
  const sum = rows.reduce((acc, r) => acc + r.seconds, 0) || 1;

  return rows
    .map((r) => ({
      ...r,
      percent: Math.round((r.seconds / sum) * 1000) / 10,
    }))
    .sort((a, b) => b.seconds - a.seconds);
}

export function estimateWpm(airtime: SpeakerAirtime[]): number {
  const totalWords = airtime.reduce((a, r) => a + r.words, 0);
  const totalMinutes =
    airtime.reduce((a, r) => a + r.seconds, 0) / 60;
  if (totalMinutes <= 0) return 0;
  return Math.round(totalWords / totalMinutes);
}
