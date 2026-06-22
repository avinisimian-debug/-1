"use client";

import { Clock, Sparkles } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { estimateTimeSavedMinutes } from "../lib/timestamp";

interface MeetingValueIndicatorProps {
  durationLabel: string;
}

export function MeetingValueIndicator({ durationLabel }: MeetingValueIndicatorProps) {
  const { t } = useLocale();
  const minutes = estimateTimeSavedMinutes(durationLabel);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-emerald-200/60 bg-gradient-to-r from-emerald-50/80 to-card px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700/80">
            {t.workspaceValueEyebrow}
          </p>
          <p className="text-sm font-semibold text-foreground">
            {t.workspaceValueTitle.replace("{minutes}", String(minutes))}
          </p>
        </div>
      </div>
      <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-border/80 bg-card px-3 py-1 text-xs text-muted-foreground shadow-xs sm:self-auto">
        <Clock className="h-3.5 w-3.5" />
        {t.workspaceMeetingDuration.replace("{duration}", durationLabel)}
      </div>
    </div>
  );
}
