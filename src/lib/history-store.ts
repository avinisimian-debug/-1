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

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}
