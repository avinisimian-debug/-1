/**
 * Server-side grounding: only allow timestamps/quotes that match the transcript.
 * Prevents UI from showing hallucinated citations.
 */

import type { TranscriptEntry } from "@/features/transcription/types";
import type { ChatCitation } from "@/features/chat/types";
import {
  secondsToTimestamp,
  timestampToSeconds,
} from "@/features/workspace/lib/timestamp";

function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function quoteContained(haystack: string, needle: string): boolean {
  const h = normalizeText(haystack);
  const n = normalizeText(needle);
  if (!n || n.length < 4) return false;
  if (h.includes(n)) return true;
  // partial: first 12 chars of quote
  const slice = n.slice(0, Math.min(18, n.length));
  return slice.length >= 4 && h.includes(slice);
}

/** Format lines for model prompt with explicit anchors. */
export function buildGroundedTranscriptBlock(
  entries: TranscriptEntry[],
  maxChars = 48_000,
): string {
  const lines = entries.map((e, i) => {
    const id = `L${i + 1}`;
    return `[${id}] ${e.timestamp} | ${e.speaker} | ${e.text}`;
  });
  let out = lines.join("\n");
  if (out.length > maxChars) out = out.slice(0, maxChars);
  return out;
}

export function groundCitationsAgainstTranscript(
  citations: ChatCitation[] | undefined,
  entries: TranscriptEntry[],
): ChatCitation[] {
  if (!entries.length) return [];

  const grounded: ChatCitation[] = [];
  const used = new Set<number>();

  for (const raw of citations ?? []) {
    const ts = (raw.timestamp ?? "").trim();
    const quote = (raw.quote ?? "").trim();
    let matchIndex = -1;

    // 1) Preferred: timestamp within ~3s of a line
    if (ts) {
      const target = timestampToSeconds(ts);
      let best = -1;
      let bestDelta = Infinity;
      entries.forEach((e, i) => {
        const d = Math.abs(timestampToSeconds(e.timestamp) - target);
        if (d < bestDelta) {
          bestDelta = d;
          best = i;
        }
      });
      if (best >= 0 && bestDelta <= 3) matchIndex = best;
    }

    // 2) Quote match
    if (matchIndex < 0 && quote) {
      matchIndex = entries.findIndex((e) => quoteContained(e.text, quote));
    }

    // 3) Speaker + fuzzy quote
    if (matchIndex < 0 && quote && raw.speaker) {
      matchIndex = entries.findIndex(
        (e) =>
          e.speaker.includes(raw.speaker!) && quoteContained(e.text, quote),
      );
    }

    if (matchIndex < 0 || used.has(matchIndex)) continue;
    used.add(matchIndex);
    const line = entries[matchIndex];
    grounded.push({
      timestamp: line.timestamp || secondsToTimestamp(0),
      speaker: line.speaker,
      quote: quote && quoteContained(line.text, quote) ? quote : line.text.slice(0, 140),
    });
  }

  // If model returned answer but zero valid cites, do not invent — return empty.
  return grounded.slice(0, 5);
}
