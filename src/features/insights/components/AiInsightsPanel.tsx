"use client";

import { useState } from "react";
import {
  Copy,
  ListChecks,
  Loader2,
  RefreshCw,
  Sparkles,
  Tag,
} from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { copyToClipboard } from "@/lib/export";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import type { AiInsights } from "../types";
import { formatAiInsightsForClipboard } from "../lib/transcript-text";

interface AiInsightsPanelProps {
  insights: AiInsights | null;
  isLoading: boolean;
  error: string | null;
  onRegenerate: () => void;
}

export function AiInsightsPanel({
  insights,
  isLoading,
  error,
  onRegenerate,
}: AiInsightsPanelProps) {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!insights) return;
    const ok = await copyToClipboard(formatAiInsightsForClipboard(insights));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading && !insights) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-muted">
          <Loader2 className="h-7 w-7 animate-spin text-accent" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {t.aiInsightsLoading}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t.aiInsightsLoadingHint}
          </p>
        </div>
      </div>
    );
  }

  if (error && !insights) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50/80 px-5 py-8 text-center">
        <p className="text-sm font-medium text-red-800">{t.aiInsightsError}</p>
        <p className="mt-1 text-xs text-red-700/90">{error}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4 gap-2"
          onClick={onRegenerate}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {t.aiInsightsRegenerate}
        </Button>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-accent">
            {t.aiInsightsPoweredBy}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {new Date(insights.generatedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleCopy}
            disabled={isLoading}
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? t.resCopied : t.aiInsightsCopyAll}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onRegenerate}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            {t.aiInsightsRegenerate}
          </Button>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-accent/20 bg-gradient-to-br from-accent-muted/40 to-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-accent/15 bg-accent-muted/30 px-5 py-3">
          <Sparkles className="h-4 w-4 text-accent" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80">
            {t.aiInsightsExecutive}
          </h3>
        </div>
        <p className="px-5 py-5 text-sm leading-relaxed text-foreground/90">
          {insights.executiveSummary}
        </p>
      </section>

      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border/70 px-5 py-3">
          <ListChecks className="h-4 w-4 text-emerald-600" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {t.aiInsightsActions}
          </h3>
        </div>
        <ul className="divide-y divide-border/60">
          {insights.actionItems.length > 0 ? (
            insights.actionItems.map((item, index) => (
              <li
                key={index}
                className="flex gap-3 px-5 py-3.5 text-sm leading-relaxed text-foreground/90"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {item}
              </li>
            ))
          ) : (
            <li className="px-5 py-6 text-sm text-muted-foreground">
              {t.aiInsightsNoActions}
            </li>
          )}
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border/70 px-5 py-3">
          <Tag className="h-4 w-4 text-violet-500" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {t.aiInsightsTopics}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2 px-5 py-4">
          {insights.topics.length > 0 ? (
            insights.topics.map((topic, index) => (
              <span
                key={index}
                className={cn(
                  "rounded-full border border-violet-200/80 bg-violet-50 px-3 py-1",
                  "text-xs font-medium text-violet-800",
                )}
              >
                {topic}
              </span>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">{t.aiInsightsNoTopics}</p>
          )}
        </div>
      </section>
    </div>
  );
}
