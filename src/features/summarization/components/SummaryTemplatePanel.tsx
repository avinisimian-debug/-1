"use client";

import { SummaryModeSelector } from "./SummaryModeSelector";
import { SummaryTemplatePreview } from "./SummaryTemplatePreview";
import { useSummarization } from "../hooks/useSummarization";
import type { TranscriptionResult } from "@/features/transcription/types";

interface SummaryTemplatePanelProps {
  result: TranscriptionResult;
}

export function SummaryTemplatePanel({ result }: SummaryTemplatePanelProps) {
  const { templates, templateId, output, loading, selectTemplate } =
    useSummarization(result, { defaultTemplate: "manager" });

  return (
    <div className="space-y-4">
      <SummaryModeSelector
        templates={templates}
        activeId={templateId}
        onSelect={selectTemplate}
      />
      <SummaryTemplatePreview output={output} loading={loading} />
    </div>
  );
}
