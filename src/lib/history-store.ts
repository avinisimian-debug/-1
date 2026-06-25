import type { TranscriptionResult } from "./types";

const HISTORY_KEY = "meetscribe-history";

export interface HistoryEntry {
  id: string;
  savedAt: string;
  result: TranscriptionResult;
}

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function saveToHistory(
  result: TranscriptionResult,
  maxItems: number,
): HistoryEntry {
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
    result,
  };

  const existing = getHistory();
  const updated = [entry, ...existing].slice(0, maxItems);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return entry;
}

export function deleteHistoryEntry(id: string): void {
  const updated = getHistory().filter((h) => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function updateHistorySpeakerLabels(
  fileName: string,
  processedAt: string,
  speakerLabels: Record<string, string>,
): void {
  const history = getHistory();
  const updated = history.map((entry) => {
    if (
      entry.result.fileName === fileName &&
      entry.result.processedAt === processedAt
    ) {
      const labels =
        Object.keys(speakerLabels).length > 0 ? speakerLabels : undefined;
      const { speakerLabels: _removed, ...rest } = entry.result;
      return {
        ...entry,
        result: {
          ...rest,
          ...(labels ? { speakerLabels: labels } : {}),
        },
      };
    }
    return entry;
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function updateHistoryAiInsights(
  fileName: string,
  processedAt: string,
  aiInsights: import("@/features/insights/types").AiInsights,
): void {
  const history = getHistory();
  const updated = history.map((entry) => {
    if (
      entry.result.fileName === fileName &&
      entry.result.processedAt === processedAt
    ) {
      return {
        ...entry,
        result: { ...entry.result, aiInsights },
      };
    }
    return entry;
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function updateHistoryTranscript(
  fileName: string,
  processedAt: string,
  transcript: TranscriptionResult["transcript"],
): void {
  const history = getHistory();
  const updated = history.map((entry) => {
    if (
      entry.result.fileName === fileName &&
      entry.result.processedAt === processedAt
    ) {
      return {
        ...entry,
        result: { ...entry.result, transcript },
      };
    }
    return entry;
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}
