"use client";

import { Loader2 } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";
import { MarkdownView } from "@/shared/ui/markdown-view";
import type { SummarizationOutput } from "../types";

interface SummaryTemplatePreviewProps {
  output: SummarizationOutput | null;
  loading?: boolean;
  className?: string;
}

export function SummaryTemplatePreview({
  output,
  loading,
  className,
}: SummaryTemplatePreviewProps) {
  const { t } = useLocale();

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-muted/30",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border/70 px-4 py-2.5">
        <p className="text-xs font-medium text-muted-foreground">
          {t.summaryPreviewTitle}
        </p>
        {output && (
          <span className="text-[10px] text-muted-foreground">
            {output.fromCache ? t.summaryFromCache : `${output.latencyMs}ms`}
          </span>
        )}
      </div>

      <div className="relative max-h-72 overflow-auto p-4">
        {loading && !output ? (
          <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t.summaryPreviewLoading}
          </div>
        ) : output ? (
          output.format === "markdown" ? (
            <MarkdownView content={output.content} className="text-sm" />
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/90">
              {output.content}
            </pre>
          )
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t.summaryPreviewEmpty}
          </p>
        )}
      </div>
    </div>
  );
}
