"use client";

import { Check, Crown, Lock } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { PLAN_FEATURE_ACCESS, type FeatureKey } from "@/lib/plan-features";
import { cn } from "@/lib/utils";

const FEATURE_ORDER: FeatureKey[] = [
  "transcriptSearch",
  "copyToClipboard",
  "pdfExport",
  "txtExport",
  "history",
  "largeFiles",
  "languageSelect",
  "sentimentAnalysis",
  "meetingChapters",
  "actionPriorities",
];

const FEATURE_LABEL_KEYS: Record<FeatureKey, keyof import("@/lib/i18n/translations").Translations> = {
  transcriptSearch: "featTranscriptSearch",
  copyToClipboard: "featCopyClipboard",
  pdfExport: "featPdfExport",
  txtExport: "featTxtExport",
  history: "featHistory",
  largeFiles: "featLargeFiles",
  languageSelect: "featLanguageSelect",
  sentimentAnalysis: "featSentiment",
  meetingChapters: "featChapters",
  actionPriorities: "featPriorities",
};

export function PlanFeatureComparison() {
  const { t } = useLocale();

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-border">
      <div className="grid grid-cols-[1fr_56px_56px] gap-0 border-b border-border bg-muted/40 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <span>{t.featColumnFeature}</span>
        <span className="text-center">Free</span>
        <span className="text-center text-accent">Pro</span>
      </div>
      <ul className="divide-y divide-border/60">
        {FEATURE_ORDER.map((key) => {
          const access = PLAN_FEATURE_ACCESS[key];
          const freeHas = access === "both";
          const proHas = true;
          const label = t[FEATURE_LABEL_KEYS[key]];

          return (
            <li
              key={key}
              className="grid grid-cols-[1fr_56px_56px] items-center gap-0 px-4 py-2.5"
            >
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                {access === "pro" && (
                  <Lock className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                )}
                {label}
              </span>
              <span className="flex justify-center">
                <FeatureCell enabled={freeHas} />
              </span>
              <span className="flex justify-center">
                <FeatureCell enabled={proHas} pro />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function FeatureCell({ enabled, pro }: { enabled: boolean; pro?: boolean }) {
  if (!enabled) {
    return <span className="text-muted-foreground/40">—</span>;
  }
  return (
    <span
      className={cn(
        "flex h-5 w-5 items-center justify-center rounded-full",
        pro ? "bg-accent-muted" : "bg-emerald-50",
      )}
    >
      {pro ? (
        <Crown className="h-3 w-3 text-accent" />
      ) : (
        <Check className="h-3 w-3 text-emerald-600" />
      )}
    </span>
  );
}
