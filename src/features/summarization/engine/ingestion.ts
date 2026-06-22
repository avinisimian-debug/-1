import type { TranscriptionResult } from "@/features/transcription/types";
import type { IngestedTranscript } from "../types";

function entriesToText(entries: TranscriptionResult["transcript"]): string {
  return entries
    .map((e) => `[${e.timestamp}] ${e.speaker}: ${e.text}`)
    .join("\n");
}

export function ingestFromResult(
  cacheKey: string,
  result: TranscriptionResult,
): IngestedTranscript {
  return {
    cacheKey,
    fileName: result.fileName,
    duration: result.duration,
    processedAt: result.processedAt,
    fullText: entriesToText(result.transcript),
    entries: result.transcript,
    metadata: {
      headline: result.headline,
      topics: result.topics,
      decisions: result.decisions,
      overview: result.summary.overview,
      executive: result.summary.executive,
      keyTakeaways: result.summary.keyTakeaways,
      actionItems: result.actionItems,
    },
  };
}

export function ingestFromText(
  cacheKey: string,
  transcript: string,
  fileName = "Meeting",
): IngestedTranscript {
  const lines = transcript.split("\n").filter(Boolean);
  const entries = lines.map((line, index) => {
    const match = line.match(/^\[(\d+:\d+)\]\s*([^:]+):\s*(.+)$/);
    if (match) {
      return {
        timestamp: match[1],
        speaker: match[2].trim(),
        text: match[3].trim(),
      };
    }
    return {
      timestamp: `00:${String(index).padStart(2, "0")}`,
      speaker: "Speaker",
      text: line,
    };
  });

  return {
    cacheKey,
    fileName,
    duration: "—",
    processedAt: new Date().toISOString(),
    fullText: transcript,
    entries,
    metadata: {
      executive: [],
      keyTakeaways: [],
      actionItems: [],
    },
  };
}

export function ingestTranscript(input: {
  cacheKey: string;
  result?: TranscriptionResult;
  transcript?: string;
}): IngestedTranscript {
  if (input.result) {
    return ingestFromResult(input.cacheKey, input.result);
  }
  if (input.transcript?.trim()) {
    return ingestFromText(input.cacheKey, input.transcript);
  }
  throw new Error("Summarization requires a transcript or TranscriptionResult.");
}
