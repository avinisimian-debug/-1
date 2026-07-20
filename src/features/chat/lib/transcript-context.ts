import type { TranscriptionResult } from "@/features/transcription/types";

/** Timestamped plain text for RAG-style grounding in the chat model. */
export function buildTimestampedTranscriptText(
  result: TranscriptionResult,
): string {
  if (result.transcript.length === 0) {
    return result.summary.overview ?? "";
  }

  return result.transcript
    .map(
      (entry) =>
        `[${entry.timestamp}] ${entry.speaker}: ${entry.text}`,
    )
    .join("\n");
}
