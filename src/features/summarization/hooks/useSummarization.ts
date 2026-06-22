"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { TranscriptionResult } from "@/features/transcription/types";
import { usePlan } from "@/context/PlanContext";
import { hasFeature } from "@/lib/plan-features";
import { summarizationEngine } from "../engine/summarization-engine";
import { SUMMARY_TEMPLATE_LIST } from "../templates/registry";
import type {
  OutputFormat,
  SummarizationOutput,
  SummaryTemplateId,
} from "../types";

function buildCacheKey(result: TranscriptionResult): string {
  return `${result.fileName}::${result.processedAt}`;
}

export function useSummarization(
  result: TranscriptionResult | null,
  options?: { format?: OutputFormat; defaultTemplate?: SummaryTemplateId },
) {
  const format = options?.format ?? "markdown";
  const { plan } = usePlan();
  const templates = useMemo(
    () =>
      SUMMARY_TEMPLATE_LIST.filter(
        (t) => !t.proOnly || hasFeature(plan, "summaryTemplates"),
      ),
    [plan],
  );
  const [templateId, setTemplateId] = useState<SummaryTemplateId>(
    options?.defaultTemplate ?? "manager",
  );
  const [output, setOutput] = useState<SummarizationOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [warmed, setWarmed] = useState(false);

  const cacheKey = useMemo(
    () => (result ? buildCacheKey(result) : null),
    [result],
  );

  const selectTemplate = useCallback(
    async (next: SummaryTemplateId) => {
      if (!result || !cacheKey) return;
      setTemplateId(next);

      const cached = summarizationEngine.getCached(cacheKey, next, format);
      if (cached) {
        setOutput({ ...cached, fromCache: true });
        return;
      }

      setLoading(true);
      try {
        const nextOutput = await summarizationEngine.process({
          cacheKey,
          templateId: next,
          format,
          result,
        });
        setOutput(nextOutput);
      } finally {
        setLoading(false);
      }
    },
    [cacheKey, format, result],
  );

  useEffect(() => {
    if (!result || !cacheKey) {
      setOutput(null);
      setWarmed(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        await summarizationEngine.warmAll(
          { cacheKey, format, result },
          templates.map((t) => t.id),
        );
        if (cancelled) return;
        setWarmed(true);
        const initial = summarizationEngine.getCached(
          cacheKey,
          templateId,
          format,
        );
        if (initial) setOutput(initial);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [cacheKey, format, result, templateId, templates]);

  return {
    templates,
    templateId,
    output,
    loading,
    warmed,
    selectTemplate,
  };
}
