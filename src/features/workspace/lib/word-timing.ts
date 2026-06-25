import type { TimedWord, TranscriptEntry } from "@/features/transcription/types";
import { timestampToSeconds } from "./timestamp";

/** Index of the word currently being spoken at `currentTime` (seconds). */
export function findActiveTimedWordIndex(
  words: TimedWord[],
  currentTime: number,
): number {
  if (words.length === 0) return -1;

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (currentTime >= w.start_time && currentTime < w.end_time) {
      return i;
    }
  }

  let active = -1;
  for (let i = 0; i < words.length; i++) {
    if (words[i].start_time <= currentTime) {
      active = i;
    } else {
      break;
    }
  }
  return active;
}

/** Estimate per-word timings when the API did not return word timestamps. */
export function deriveTimedWordsFromEntries(
  entries: TranscriptEntry[],
): TimedWord[] {
  const words: TimedWord[] = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.words?.length) {
      words.push(...entry.words);
      continue;
    }

    const start = timestampToSeconds(entry.timestamp);
    const nextStart =
      i < entries.length - 1
        ? timestampToSeconds(entries[i + 1].timestamp)
        : start + Math.max(2, entry.text.split(/\s+/).length * 0.35);
    const duration = Math.max(0.4, nextStart - start);
    const tokens = entry.text.split(/\s+/).filter(Boolean);
    const slot = duration / Math.max(tokens.length, 1);

    tokens.forEach((token, index) => {
      words.push({
        word: token,
        start_time: start + index * slot,
        end_time: start + (index + 1) * slot,
        speaker: entry.speaker,
        ...(entry.speakerId ? { speakerId: entry.speakerId } : {}),
      });
    });
  }

  return words;
}

export function collectTimedWords(
  entries: TranscriptEntry[],
  flatWords?: TimedWord[],
): TimedWord[] {
  if (flatWords?.length) return flatWords;
  const fromEntries = entries.flatMap((e) => e.words ?? []);
  if (fromEntries.length > 0) return fromEntries;
  return deriveTimedWordsFromEntries(entries);
}

export function wordsForEntry(
  entry: TranscriptEntry,
  entryIndex: number,
  entries: TranscriptEntry[],
  allWords: TimedWord[],
): TimedWord[] {
  if (entry.words?.length) return entry.words;

  const start = timestampToSeconds(entry.timestamp);
  const end =
    entryIndex < entries.length - 1
      ? timestampToSeconds(entries[entryIndex + 1].timestamp)
      : Number.POSITIVE_INFINITY;

  const ranged = allWords.filter(
    (w) => w.start_time >= start && w.start_time < end,
  );
  if (ranged.length > 0) return ranged;

  return deriveTimedWordsFromEntries([entry]);
}

export function indexOfWordInList(word: TimedWord, allWords: TimedWord[]): number {
  return allWords.findIndex(
    (w) =>
      w.start_time === word.start_time &&
      w.end_time === word.end_time &&
      w.word === word.word,
  );
}
