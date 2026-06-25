import { timestampToSeconds } from "@/lib/format";
import type { TimedWord, TranscriptEntry } from "../types";

interface WhisperWordInput {
  word: string;
  start: number;
  end: number;
}

interface SegmentAnchor {
  start: number;
  speaker: string;
  speakerId?: string;
}

function resolveSpeakerAt(
  timeSeconds: number,
  anchors: SegmentAnchor[],
): Pick<SegmentAnchor, "speaker" | "speakerId"> {
  let speaker = anchors[0]?.speaker ?? "Speaker 1";
  let speakerId = anchors[0]?.speakerId;

  for (let i = anchors.length - 1; i >= 0; i--) {
    if (timeSeconds >= anchors[i].start) {
      speaker = anchors[i].speaker;
      speakerId = anchors[i].speakerId;
      break;
    }
  }

  return { speaker, speakerId };
}

export function mapWhisperWordsToTimedWords(
  entries: TranscriptEntry[],
  whisperWords: WhisperWordInput[],
): TimedWord[] {
  if (whisperWords.length === 0) return [];

  const anchors: SegmentAnchor[] = entries.map((entry) => ({
    start: timestampToSeconds(entry.timestamp),
    speaker: entry.speaker,
    speakerId: entry.speakerId,
  }));

  return whisperWords
    .map((item) => {
      const trimmed = item.word.trim();
      if (!trimmed) return null;
      const { speaker, speakerId } = resolveSpeakerAt(item.start, anchors);
      const timed: TimedWord = {
        word: trimmed,
        start_time: item.start,
        end_time: item.end,
        speaker,
        ...(speakerId ? { speakerId } : {}),
      };
      return timed;
    })
    .filter((w): w is TimedWord => w !== null);
}

export function attachWordsToEntries(
  entries: TranscriptEntry[],
  timedWords: TimedWord[],
): TranscriptEntry[] {
  if (timedWords.length === 0) return entries;

  return entries.map((entry, index) => {
    const start = timestampToSeconds(entry.timestamp);
    const end =
      index < entries.length - 1
        ? timestampToSeconds(entries[index + 1].timestamp)
        : Number.POSITIVE_INFINITY;

    const words = timedWords.filter(
      (w) => w.start_time >= start && w.start_time < end,
    );

    return words.length > 0 ? { ...entry, words } : entry;
  });
}

export interface AssemblyAIWordInput {
  text: string;
  start: number;
  end: number;
  speaker?: string | null;
}

export function mapAssemblyAIWordsToTimedWords(
  words: AssemblyAIWordInput[],
  speakerLabelByRaw: Map<string, { speakerId: string; speakerLabel: string }>,
): TimedWord[] {
  return words
    .map((item) => {
      const trimmed = item.text.trim();
      if (!trimmed) return null;

      const mapped = item.speaker
        ? speakerLabelByRaw.get(item.speaker)
        : undefined;

      const timed: TimedWord = {
        word: trimmed,
        start_time: item.start / 1000,
        end_time: item.end / 1000,
        speaker: mapped?.speakerLabel ?? "Speaker 1",
        speakerId: mapped?.speakerId ?? "1",
      };
      return timed;
    })
    .filter((w): w is TimedWord => w !== null);
}
