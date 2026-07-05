"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, FileAudio, Trash2 } from "lucide-react";
import { HISTORY_VIEW_KEY } from "@/features/transcription";
import { HistorySmartSearch } from "@/features/search";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { deleteHistoryEntry, getHistory } from "@/lib/history-store";
import { HISTORY_LIMITS } from "@/lib/plan-features";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const { t } = useLocale();
  const { plan } = usePlan();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(() => getHistory());

  const refresh = useCallback(() => setItems(getHistory()), []);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((h) => {
      const { result } = h;
      if (result.fileName.toLowerCase().includes(q)) return true;
      if (result.headline?.toLowerCase().includes(q)) return true;
      if (result.summary.executive.some((line) => line.toLowerCase().includes(q))) {
        return true;
      }
      if (result.transcript.some((line) => line.text.toLowerCase().includes(q))) {
        return true;
      }
      if (result.actionItems.some((item) => item.task.toLowerCase().includes(q))) {
        return true;
      }
      return false;
    });
  }, [items, query]);

  const handleView = (id: string) => {
    const entry = items.find((h) => h.id === id);
    if (!entry) return;
    sessionStorage.setItem(HISTORY_VIEW_KEY, JSON.stringify(entry.result));
    router.push("/");
  };

  const handleDelete = (id: string) => {
    deleteHistoryEntry(id);
    refresh();
  };

  const limit = HISTORY_LIMITS[plan];

  return (
    <DashboardShell title={t.historyTitle} description={t.historyDesc}>
      <div className="mx-auto w-full max-w-4xl space-y-6 page-enter">
        <HistorySmartSearch
          entries={items}
          query={query}
          onQueryChange={setQuery}
          onOpenEntry={handleView}
        />

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {filtered.length} / {limit} {t.historyRecordings}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="glass-card rounded-xl px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <FileAudio className="h-7 w-7 text-muted-foreground/60" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{t.historyEmpty}</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden rounded-xl">
            <ul className="divide-y divide-border">
              {filtered.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-muted ring-1 ring-accent/10">
                      <FileAudio className="h-4 w-4 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {item.result.fileName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.savedAt).toLocaleDateString()} ·{" "}
                        {item.result.duration}
                      </p>
                    </div>
                  </div>
                  <span className="hidden items-center gap-1 text-sm text-muted-foreground sm:inline-flex">
                    <Clock className="h-3.5 w-3.5" />
                    {item.result.duration}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleView(item.id)}
                    className="btn-secondary px-3 py-1.5 text-xs font-medium"
                  >
                    {t.historyView}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    aria-label={t.historyDelete}
                    className={cn(
                      "rounded-lg p-1.5 text-muted-foreground transition-colors",
                      "hover:bg-destructive/10 hover:text-destructive",
                    )}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
