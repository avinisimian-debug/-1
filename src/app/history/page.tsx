"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, FileAudio, Search, Trash2 } from "lucide-react";
import { HISTORY_VIEW_KEY } from "@/components/dashboard/DashboardContent";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { deleteHistoryEntry, getHistory } from "@/lib/history-store";
import { HISTORY_LIMITS } from "@/lib/plan-features";

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
    return items.filter((h) => h.result.fileName.toLowerCase().includes(q));
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
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.historySearch}
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 ps-10 pe-4 text-sm text-zinc-300 placeholder:text-zinc-600 focus:border-violet-500/40 focus:outline-none"
            />
          </div>
          <p className="text-sm text-zinc-500">
            {items.length} / {limit} {t.historyRecordings}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="glass-card rounded-2xl px-6 py-16 text-center">
            <FileAudio className="mx-auto h-10 w-10 text-zinc-700" />
            <p className="mt-4 text-sm text-zinc-500">{t.historyEmpty}</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden rounded-2xl">
            <ul className="divide-y divide-white/[0.04]">
              {filtered.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.03]"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-600/15">
                      <FileAudio className="h-4 w-4 text-violet-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-200">
                        {item.result.fileName}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {new Date(item.savedAt).toLocaleDateString()} ·{" "}
                        {item.result.duration}
                      </p>
                    </div>
                  </div>
                  <span className="hidden items-center gap-1 text-sm text-zinc-500 sm:inline-flex">
                    <Clock className="h-3.5 w-3.5" />
                    {item.result.duration}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleView(item.id)}
                    className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white"
                  >
                    {t.historyView}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    aria-label={t.historyDelete}
                    className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-4 text-center text-[11px] text-zinc-600">{t.historyLimitNote}</p>
      </div>
    </DashboardShell>
  );
}
