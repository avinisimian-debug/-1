"use client";

import Link from "next/link";
import { Crown, FileAudio } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { useUsage } from "@/hooks/useUsage";
import { getHistory } from "@/lib/history-store";
import { HISTORY_VIEW_KEY } from "@/features/transcription/constants";
import { Progress } from "@/shared/ui/progress";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function DashboardInspector({ className }: { className?: string }) {
  const { t } = useLocale();
  const { isPro, limits } = usePlan();
  const { count, limit, percent } = useUsage();
  const router = useRouter();
  const [recent, setRecent] = useState(() => getHistory().slice(0, 5));

  useEffect(() => {
    const refresh = () => setRecent(getHistory().slice(0, 5));
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const openEntry = (id: string) => {
    const entry = getHistory().find((h) => h.id === id);
    if (!entry) return;
    sessionStorage.setItem(HISTORY_VIEW_KEY, JSON.stringify(entry.result));
    window.dispatchEvent(new Event("stazai:open-history-result"));
    router.push("/");
  };

  return (
    <aside
      className={cn(
        "hidden w-72 shrink-0 flex-col gap-4 xl:flex",
        className,
      )}
    >
      <div className="rounded-xl border border-border bg-card/80 p-4 shadow-xs">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t.inspectorPlan}
        </p>
        <div className="mt-2 flex items-center gap-2">
          {isPro && <Crown className="h-4 w-4 text-accent" />}
          <span className="text-sm font-semibold text-foreground">
            {isPro ? t.planPro : t.planFree}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {limits.maxFileSizeLabel} · {limits.maxDurationLabel}
        </p>
        {!isPro && (
          <Link
            href="/settings#upgrade"
            className="mt-3 inline-flex text-xs font-medium text-accent hover:underline"
          >
            {t.uploadUpgradeLink}
          </Link>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card/80 p-4 shadow-xs">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t.inspectorQuota}
        </p>
        <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
          {count}
          <span className="text-base font-normal text-muted-foreground">
            /{limit}
          </span>
        </p>
        <Progress value={percent} className="mt-3" size="sm" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-border bg-card/80 p-4 shadow-xs">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t.inspectorRecent}
        </p>
        {recent.length === 0 ? (
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            {t.inspectorEmpty}
          </p>
        ) : (
          <ul className="mt-3 space-y-1">
            {recent.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => openEntry(entry.id)}
                  className="flex w-full items-start gap-2 rounded-lg px-2 py-2 text-start transition-colors hover:bg-muted"
                >
                  <FileAudio className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium text-foreground">
                      {entry.result.fileName}
                    </span>
                    <span className="block text-[10px] text-muted-foreground">
                      {new Date(entry.savedAt).toLocaleDateString()}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/history"
          className="mt-auto pt-3 text-xs font-medium text-accent hover:underline"
        >
          {t.navHistory} →
        </Link>
      </div>
    </aside>
  );
}
