import type { HistoryEntry } from "@/lib/history-store";
import type { HistorySearchField, HistorySearchHit } from "../types";

const SNIPPET_RADIUS = 48;

function snippetAround(text: string, index: number, query: string): string {
  const start = Math.max(0, index - SNIPPET_RADIUS);
  const end = Math.min(text.length, index + query.length + SNIPPET_RADIUS);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < text.length ? "…" : "";
  return `${prefix}${text.slice(start, end)}${suffix}`;
}

function pushHit(
  hits: HistorySearchHit[],
  entry: HistoryEntry,
  field: HistorySearchField,
  text: string,
  query: string,
): void {
  const index = text.toLowerCase().indexOf(query);
  if (index === -1) return;

  hits.push({
    entryId: entry.id,
    fileName: entry.result.fileName,
    savedAt: entry.savedAt,
    duration: entry.result.duration,
    field,
    snippet: snippetAround(text, index, query),
  });
}

export function searchHistory(
  entries: HistoryEntry[],
  rawQuery: string,
): HistorySearchHit[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const hits: HistorySearchHit[] = [];

  for (const entry of entries) {
    const { result } = entry;

    pushHit(hits, entry, "fileName", result.fileName, query);

    if (result.headline) {
      pushHit(hits, entry, "headline", result.headline, query);
    }

    const summaryText = [
      result.summary.overview ?? "",
      ...result.summary.executive,
      ...result.summary.keyTakeaways,
    ].join(" ");
    pushHit(hits, entry, "summary", summaryText, query);

    for (const line of result.transcript) {
      const lineText = `${line.speaker}: ${line.text}`;
      if (lineText.toLowerCase().includes(query)) {
        pushHit(hits, entry, "transcript", lineText, query);
      }
    }

    for (const item of result.actionItems) {
      const taskText = `${item.task} ${item.owner}`;
      pushHit(hits, entry, "actionItems", taskText, query);
    }

    if (result.topics?.length) {
      pushHit(hits, entry, "topics", result.topics.join(", "), query);
    }
  }

  const seen = new Set<string>();
  return hits.filter((hit) => {
    const key = `${hit.entryId}:${hit.field}:${hit.snippet}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
