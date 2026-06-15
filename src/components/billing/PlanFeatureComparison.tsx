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
    <div className="mt-6 overflow-hidden rounded-xl border border-white/[0.06]">
      <div className="grid grid-cols-[1fr_56px_56px] gap-0 border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        <span>{t.featColumnFeature}</span>
        <span className="text-center">Free</span>
        <span className="text-center text-amber-400">Pro</span>
      </div>
      <ul className="divide-y divide-white/[0.04]">
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
              <span className="flex items-center gap-2 text-xs text-zinc-400">
                {access === "pro" && (
                  <Lock className="h-3 w-3 shrink-0 text-amber-500/60" />
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
    return <span className="text-zinc-700">—</span>;
  }
  return (
    <span
      className={cn(
        "flex h-5 w-5 items-center justify-center rounded-full",
        pro ? "bg-amber-500/15" : "bg-emerald-500/10",
      )}
    >
      {pro ? (
        <Crown className="h-3 w-3 text-amber-400" />
      ) : (
        <Check className="h-3 w-3 text-emerald-400" />
      )}
    </span>
  );
}
