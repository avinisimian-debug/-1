"use client";

import { useMemo } from "react";
import { Search } from "lucide-react";
import type { HistoryEntry } from "@/lib/history-store";
import { useLocale } from "@/context/LocaleContext";
import { Input } from "@/shared/ui/input";
import { searchHistory } from "../lib/search-history";
import { HighlightedText } from "./HighlightedText";

interface HistorySmartSearchProps {
  entries: HistoryEntry[];
  query: string;
  onQueryChange: (value: string) => void;
  onOpenEntry: (entryId: string) => void;
}

const FIELD_LABEL_KEYS = {
  fileName: "searchFieldFileName",
  headline: "searchFieldHeadline",
  summary: "searchFieldSummary",
  transcript: "searchFieldTranscript",
  actionItems: "searchFieldActions",
  topics: "searchFieldTopics",
} as const;

export function HistorySmartSearch({
  entries,
  query,
  onQueryChange,
  onOpenEntry,
}: HistorySmartSearchProps) {
  const { t } = useLocale();

  const hits = useMemo(
    () => searchHistory(entries, query),
    [entries, query],
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t.searchSmartPlaceholder}
          className="ps-10"
        />
      </div>

      {query.trim() && (
        <div className="rounded-xl border border-border bg-card">
          {hits.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              {t.searchNoHits}
            </p>
          ) : (
            <ul className="divide-y divide-border/60">
              {hits.slice(0, 12).map((hit) => (
                <li key={`${hit.entryId}-${hit.field}-${hit.snippet}`}>
                  <button
                    type="button"
                    onClick={() => onOpenEntry(hit.entryId)}
                    className="flex w-full flex-col gap-1 px-4 py-3 text-start transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {hit.fileName}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        <HighlightedText text={hit.snippet} query={query} />
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-accent">
                      {t[FIELD_LABEL_KEYS[hit.field]]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
