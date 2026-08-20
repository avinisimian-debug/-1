"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Trash2 } from "lucide-react";
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
      description="הפגישות שלכם בענן — זמינות גם ממכשיר אחר."
    >
      <div className="mx-auto w-full max-w-4xl space-y-6 page-enter">
        {loading ? (
          <p className="text-sm text-muted-foreground">טוען ספרייה…</p>
        ) : null}
        {error ? (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        {!loading && items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">{t.historyEmpty}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className={cn(
                  "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm",
                )}
              >
                <button
                  type="button"
                  className="min-w-0 flex-1 text-start"
                  onClick={() => void handleView(item.id)}
                >
                  <p className="truncate font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
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
                            ? "bg-emerald-50 text-emerald-800"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {statusLabel(item)}
                    </span>
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(item.id)}
                  className="lat-btn-ghost !min-h-10"
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
