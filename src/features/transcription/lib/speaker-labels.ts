import type { TranscriptEntry } from "../types";

/** Resolve display name: custom rename overrides default label. */
export function resolveSpeakerName(
  entry: Pick<TranscriptEntry, "speaker" | "speakerId">,
  overrides?: Record<string, string>,
): string {
  if (entry.speakerId && overrides?.[entry.speakerId]?.trim()) {
    return overrides[entry.speakerId].trim();
  }
  return entry.speaker;
}

export function applySpeakerLabelOverrides(
  entries: TranscriptEntry[],
  overrides?: Record<string, string>,
): TranscriptEntry[] {
  if (!overrides || Object.keys(overrides).length === 0) {
    return entries;
  }
  return entries.map((entry) => ({
    ...entry,
    speaker: resolveSpeakerName(entry, overrides),
  }));
}

export function collectSpeakerIds(entries: TranscriptEntry[]): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const entry of entries) {
    const id = entry.speakerId ?? entry.speaker;
    if (!seen.has(id)) {
      seen.add(id);
      ordered.push(id);
    }
  }
  return ordered;
}

export function defaultLabelForSpeakerId(
  speakerId: string,
  entries: TranscriptEntry[],
): string {
  const match = entries.find((e) => (e.speakerId ?? e.speaker) === speakerId);
  return match?.speaker ?? speakerId;
}
