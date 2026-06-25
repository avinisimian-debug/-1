import type { ActionItem, TranscriptEntry, TranscriptionResult } from "@/features/transcription/types";

export type SummaryTemplateId = "manager" | "student" | "technical";

export type OutputFormat = "markdown" | "json" | "html";

export interface SummaryTemplate {
  id: SummaryTemplateId;
  displayName: string;
  description: string;
  /** System + instruction prompt sent to the LLM in production. */
  promptDefinition: string;
  /** Ordered section keys the formatter should render. */
  sections: string[];
  /** CRO: highlight in UI as premium template */
  proOnly?: boolean;
}

export interface SummarizationInput {
  /** Stable cache key — e.g. history entry id or fileName+processedAt */
  cacheKey: string;
  templateId: SummaryTemplateId;
  format?: OutputFormat;
  /** Raw transcript text (minimal ingestion) */
  transcript?: string;
  /** Full meeting result (rich ingestion — preferred) */
  result?: TranscriptionResult;
}

export interface IngestedTranscript {
  cacheKey: string;
  fileName: string;
  duration: string;
  processedAt: string;
  fullText: string;
  entries: TranscriptEntry[];
  metadata: {
    headline?: string;
    topics?: string[];
    decisions?: string[];
    overview?: string;
    executive: string[];
    keyTakeaways: string[];
    actionItems: ActionItem[];
    markdown?: string;
  };
}

export interface SummarySection {
  id: string;
  heading: string;
  body?: string;
  bullets?: string[];
}

export interface SummaryDocument {
  templateId: SummaryTemplateId;
  title: string;
  sections: SummarySection[];
  generatedAt: string;
}

export interface SummarizationOutput {
  templateId: SummaryTemplateId;
  format: OutputFormat;
  document: SummaryDocument;
  content: string;
  fromCache: boolean;
  latencyMs: number;
}

export interface SummaryProcessor {
  process(
    ingested: IngestedTranscript,
    template: SummaryTemplate,
  ): Promise<SummaryDocument> | SummaryDocument;
}

export interface SummaryFormatter {
  format(document: SummaryDocument): string;
}
