/**
 * Map free-text decisions / takeaways to the strongest transcript timestamp.
 * Used by AI rail chips for ↗ seek (no hallucinations — only real lines).
 */

import type { TranscriptEntry } from "@/features/transcription/types";
import { timestampToSeconds } from "@/features/workspace/lib/timestamp";

export interface DecisionMoment {
  decision: string;
  timestamp: string;
  speaker?: string;
  quote: string;
  score: number;
}

/** Common Hebrew/English stopwords that dilute decision↔line matching. */
const STOPWORDS = new Set([
  "את",
  "של",
  "על",
  "עם",
  "זה",
  "זו",
  "זאת",
  "יש",
  "אין",
  "גם",
  "רק",
  "או",
  "אם",
  "כי",
  "לא",
  "כן",
  "כל",
  "מה",
  "מי",
  "הוא",
  "היא",
  "הם",
  "אנחנו",
  "אני",
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "will",
  "are",
  "was",
]);

const DECISION_VERBS = new Set([
  "מאשרים",
  "מאשר",
  "מאשרת",
  "סוגרים",
  "סוגר",
  "סגרנו",
  "מחליטים",
  "מחליט",
  "סיכמנו",
  "סיכם",
  "מאושר",
  "לאשר",
  "להשיק",
  "לצאת",
  "דוחים",
  "מעבירים",
  "approve",
  "approved",
  "decide",
  "decided",
  "ship",
  "block",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

function scoreLine(decisionTokens: string[], line: TranscriptEntry): number {
  if (decisionTokens.length === 0) return 0;
  const lineTokens = tokenize(line.text);
  const lineSet = new Set(lineTokens);
  let hits = 0;
  for (const t of decisionTokens) {
    if (lineSet.has(t)) {
      hits += DECISION_VERBS.has(t) ? 1.6 : 1;
    } else if (lineTokens.some((lt) => lt.includes(t) || t.includes(lt))) {
      hits += 0.5;
    }
  }
  // Prefer denser matches on meaningful tokens
  return hits / Math.sqrt(Math.max(decisionTokens.length, 1));
}

/**
 * Find best transcript line for a single decision string.
 * Returns null if no line scores above threshold.
 */
export function mapDecisionToTimestamp(
  decision: string,
  entries: TranscriptEntry[],
  minScore = 0.35,
): DecisionMoment | null {
  const tokens = tokenize(decision);
  if (!entries.length || tokens.length === 0) return null;

  let best: DecisionMoment | null = null;

  for (const line of entries) {
    const score = scoreLine(tokens, line);
    if (score < minScore) continue;
    if (!best || score > best.score) {
      best = {
        decision,
        timestamp: line.timestamp,
        speaker: line.speaker,
        quote: line.text.slice(0, 160),
        score,
      };
    }
  }

  return best;
}

export function mapDecisionsToTimestamps(
  decisions: string[],
  entries: TranscriptEntry[],
): DecisionMoment[] {
  const used = new Set<string>();
  const out: DecisionMoment[] = [];

  for (const d of decisions) {
    const mapped = mapDecisionToTimestamp(d, entries);
    if (!mapped) continue;
    // Prefer unique timestamps when possible
    if (used.has(mapped.timestamp)) {
      let alt: DecisionMoment | null = null;
      const tokens = tokenize(d);
      for (const line of entries) {
        if (used.has(line.timestamp)) continue;
        const score = scoreLine(tokens, line);
        if (!alt || score > alt.score) {
          alt = {
            decision: d,
            timestamp: line.timestamp,
            speaker: line.speaker,
            quote: line.text.slice(0, 160),
            score,
          };
        }
      }
      if (alt && alt.score >= 0.2) {
        used.add(alt.timestamp);
        out.push(alt);
        continue;
      }
    }
    used.add(mapped.timestamp);
    out.push(mapped);
  }

  return out.sort(
    (a, b) => timestampToSeconds(a.timestamp) - timestampToSeconds(b.timestamp),
  );
}
