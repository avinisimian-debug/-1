import type { TranscriptionResult } from "@/features/transcription/types";

export function buildTranscriptPlainText(result: TranscriptionResult): string {
  if (result.transcript.length === 0) {
    return result.summary.overview ?? "";
  }
  return result.transcript
    .map((entry) => `${entry.speaker}: ${entry.text}`)
    .join("\n");
}

export function formatAiInsightsForClipboard(insights: {
  executiveSummary: string;
  actionItems: string[];
  topics: string[];
}): string {
  const lines = [
    "AI INSIGHTS",
    "=".repeat(40),
    "",
    "EXECUTIVE SUMMARY",
    insights.executiveSummary,
    "",
    "ACTION ITEMS",
    ...insights.actionItems.map((item) => `• ${item}`),
    "",
    "MAIN TOPICS",
    insights.topics.join(", "),
  ];
  return lines.join("\n");
}
