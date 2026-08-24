"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, FolderOpen, Trash2, Upload } from "lucide-react";
import { HISTORY_VIEW_KEY } from "@/features/transcription";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

interface MeetingListItem {
  id: string;
  title: string;
  createdAt: string;
  fileName: string;
  headline?: string;
  hasMedia: boolean;
  persistStatus?: string;
}

function statusLabel(item: MeetingListItem): string {
  if (item.persistStatus === "failed_recoverable") return "העיבוד לא הושלם — ההקלטה נשמרה";
  if (item.persistStatus === "media_missing") return "סיכום נשמר · ללא הקלטה";
  if (item.hasMedia) return "כולל הקלטה";
  return "ללא הקלטה שמורה";
}

export default function HistoryPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [items, setItems] = useState<MeetingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/meetings", { cache: "no-store" });
      if (res.status === 401) {
        router.push("/");
        return;
      }
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "list failed");
      }
      const data = (await res.json()) as { meetings: MeetingListItem[] };
      setItems(data.meetings);
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error && error.message !== "list failed"
          ? error.message
          : "לא ניתן לטעון את הספרייה.",
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleView = async (id: string) => {
    const res = await fetch(`/api/meetings/${id}`, { cache: "no-store" });
    if (!res.ok) {
      setError("לא ניתן לפתוח את הפגישה.");
      return;
    }
    const data = (await res.json()) as {
      meeting: {
        result: unknown;
        hasMedia: boolean;
        mediaKind?: "audio" | "video";
        persistStatus?: string;
      };
    };
    sessionStorage.setItem(
      HISTORY_VIEW_KEY,
      JSON.stringify({
        result: data.meeting.result,
        mediaSrc: data.meeting.hasMedia ? `/api/meetings/${id}/media` : undefined,
        mediaKind: data.meeting.mediaKind ?? "audio",
      }),
    );
    router.push("/");
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/meetings/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("לא ניתן למחוק את הפגישה.");
      return;
    }
    void refresh();
  };

  return (
    <DashboardShell
      title={t.historyTitle}
      description={t.historyDesc}
    >
      <div className="mx-auto w-full max-w-4xl space-y-5 page-enter">
        {loading ? (
          <div className="space-y-3" aria-busy="true" aria-label="טוען ספרייה">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[4.25rem] animate-pulse rounded-[1.15rem] border border-[var(--line-subtle)] bg-[var(--bg-subtle)]"
              />
            ))}
          </div>
        ) : null}
        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}
        {!loading && items.length === 0 ? (
          <div className="flex flex-col items-center rounded-[1.15rem] border border-dashed border-[var(--line-strong)] bg-[var(--bg-subtle)]/40 px-6 py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <FolderOpen className="h-6 w-6" strokeWidth={1.75} aria-hidden />
            </div>
            <p className="text-base font-semibold text-[var(--ink-primary)]">
              {t.historyTitle}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--ink-tertiary)]">
              {t.historyEmpty}
            </p>
            <Link href="/" className="lat-btn-primary mt-6 !min-h-10 !px-5 !text-sm">
              <Upload className="h-4 w-4" aria-hidden />
              {t.onboardStep2Cta}
            </Link>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {items.map((item) => (
              <li
                key={item.id}
                className="lat-panel lat-panel-interactive flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4"
              >
                <button
                  type="button"
                  className="min-w-0 flex-1 rounded-lg text-start outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_35%,transparent)]"
                  onClick={() => void handleView(item.id)}
                >
                  <p className="truncate text-sm font-semibold leading-snug text-[var(--ink-primary)] sm:text-[0.9375rem]">
                    {item.title}
                  </p>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--ink-tertiary)]">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(item.createdAt).toLocaleString("he-IL")}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5",
                        item.persistStatus === "failed_recoverable"
                          ? "bg-amber-100 text-amber-800"
                          : item.hasMedia
                            ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                            : "bg-[var(--bg-subtle)] text-[var(--ink-tertiary)]",
                      )}
                    >
                      {statusLabel(item)}
                    </span>
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(item.id)}
                  className="lat-btn-ghost !min-h-10 !min-w-10 !px-2.5"
                  aria-label="מחיקה"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardShell>
  );
}
