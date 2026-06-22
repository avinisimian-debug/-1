import type { HistoryEntry } from "@/lib/history-store";

export type HistorySearchField =
  | "fileName"
  | "headline"
  | "summary"
  | "transcript"
  | "actionItems"
  | "topics";

export interface HistorySearchHit {
  entryId: string;
  fileName: string;
  savedAt: string;
  duration: string;
  field: HistorySearchField;
  snippet: string;
}

export interface ShareVisibility {
  mode: "private" | "link";
}

export interface SharedMeetingSnapshot {
  token: string;
  fileName: string;
  processedAt: string;
  expiresAt?: string;
  visibility: ShareVisibility["mode"];
}
