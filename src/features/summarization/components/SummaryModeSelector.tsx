"use client";

import { Lock } from "lucide-react";
import { useFeatureGate } from "@/context/FeatureGateContext";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { hasFeature } from "@/lib/plan-features";
import { cn } from "@/lib/utils";
import type { SummaryTemplate } from "../types";

interface SummaryModeSelectorProps {
  templates: SummaryTemplate[];
  activeId: string;
  onSelect: (id: SummaryTemplate["id"]) => void;
  className?: string;
}

export function SummaryModeSelector({
  templates,
  activeId,
  onSelect,
  className,
}: SummaryModeSelectorProps) {
  const { t } = useLocale();
  const { plan } = usePlan();
  const { promptUpgrade } = useFeatureGate();

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t.summaryModeTitle}
        </p>
        <span className="text-[10px] text-muted-foreground">{t.summaryModeHint}</span>
      </div>

      <div
        className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-muted/40 p-1"
        role="tablist"
        aria-label={t.summaryModeTitle}
      >
        {templates.map((template) => {
          const locked =
            template.proOnly && !hasFeature(plan, "summaryTemplates");
          const active = template.id === activeId;

          return (
            <button
              key={template.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                if (locked) {
                  promptUpgrade("summaryTemplates");
                  return;
                }
                onSelect(template.id);
              }}
              className={cn(
                "flex min-w-[7.5rem] flex-1 flex-col items-start rounded-md px-3 py-2 text-start transition-colors",
                active
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-card/60 hover:text-foreground",
                locked && "opacity-80",
              )}
            >
              <span className="flex items-center gap-1 text-xs font-semibold">
                {template.displayName}
                {locked && <Lock className="h-3 w-3 text-muted-foreground" />}
              </span>
              <span className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-muted-foreground">
                {template.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
