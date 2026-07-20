"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileAudio, Search, X } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { getHistory, type HistoryEntry } from "@/lib/history-store";
import { HISTORY_VIEW_KEY } from "@/features/transcription/constants";
import { cn } from "@/lib/utils";

function matchesQuery(entry: HistoryEntry, q: string): boolean {
  const hay = [
    entry.result.fileName,
    entry.result.headline,
    entry.result.summary?.executive?.join(" "),
    entry.result.transcript?.map((t) => `${t.speaker} ${t.text}`).join(" "),
    entry.result.actionItems?.map((a) => `${a.task} ${a.owner}`).join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

export function CommandPalette() {
  const { t } = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const refresh = useCallback(() => {
    setHistory(getHistory());
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("stazai:open-command-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("stazai:open-command-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      refresh();
      setQuery("");
    }
  }, [open, refresh]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return history.slice(0, 8);
    return history.filter((e) => matchesQuery(e, q)).slice(0, 12);
  }, [history, query]);

  const openEntry = (entry: HistoryEntry) => {
    sessionStorage.setItem(HISTORY_VIEW_KEY, JSON.stringify(entry.result));
    setOpen(false);
    window.dispatchEvent(new Event("stazai:open-history-result"));
    router.push("/");
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-start justify-center bg-background/60 px-4 pt-[12vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={t.commandPaletteTitle}
      onClick={() => setOpen(false)}
    >
      <div
        className="glass-card w-full max-w-lg overflow-hidden shadow-lg animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.commandPalettePlaceholder}
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
            esc
          </kbd>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground sm:hidden"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <ul className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-8 text-center text-sm text-muted-foreground">
              {t.commandPaletteEmpty}
            </li>
          ) : (
            results.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => openEntry(entry)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-start transition-colors hover:bg-muted",
                  )}
                >
                  <FileAudio className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {entry.result.fileName}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {entry.result.headline ||
                        entry.result.summary?.executive?.[0] ||
                        new Date(entry.savedAt).toLocaleString()}
                    </span>
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
