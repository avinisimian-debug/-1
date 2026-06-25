import type { TranscriptionResult } from "@/features/transcription/types";
import { buildTranscriptText } from "@/lib/export";
import { timestampToSeconds } from "@/lib/format";
import type {
  TranscriptionCompletedWebhookPayload,
  WebhookSummary,
  WebhookTranscriptSegment,
} from "../types";
import { formatPlanLabel } from "./require-pro-plan";

function parseDurationSeconds(durationLabel: string): number {
  const trimmed = durationLabel.trim();
  if (!trimmed || trimmed === "—") return 0;
  const normalized = trimmed.includes(":") ? trimmed : `0:${trimmed}`;
  return timestampToSeconds(normalized);
}

function mapSummary(result: TranscriptionResult): WebhookSummary {
  const executive = result.summary.executive;
  return {
    overview: result.summary.overview ?? "",
    executive: Array.isArray(executive)
      ? executive.join("\n")
      : String(executive ?? ""),
    keyTakeaways: result.summary.keyTakeaways ?? [],
    markdown: result.summary.markdown ?? "",
  };
}

function mapTranscript(result: TranscriptionResult): WebhookTranscriptSegment[] {
  return result.transcript.map((entry, index) => {
    const start = timestampToSeconds(entry.timestamp);
    let end = start;

    if (entry.words?.length) {
      end = entry.words[entry.words.length - 1].end_time;
    } else if (index < result.transcript.length - 1) {
      end = timestampToSeconds(result.transcript[index + 1].timestamp);
    } else {
      end = start + Math.max(2, entry.text.split(/\s+/).length * 0.4);
    }

    return {
      speaker: entry.speaker,
      text: entry.text,
      start,
      end: Math.max(end, start + 0.1),
    };
  });
}

function mapActionItems(result: TranscriptionResult): string[] {
  return result.actionItems.map((item) => item.task);
}

export function buildTestWebhookPayload(args: {
  userEmail: string;
  plan?: string;
}): TranscriptionCompletedWebhookPayload {
  return {
    event: "transcription.completed",
    status: "completed",
    source: "staz-ai",
    test: true,
    metadata: {
      userEmail: args.userEmail,
      plan: formatPlanLabel(args.plan ?? "pro"),
      fileName: "test_audio.mp3",
      duration: 120,
      processedAt: "2026-06-25T12:00:00Z",
    },
    summary: {
      overview: "Sample summary",
      executive: "Sample exec summary",
      keyTakeaways: ["Point 1", "Point 2"],
      markdown: "# Summary\nSample",
    },
    fullText: "This is a sample transcribed text for testing.",
    transcript: [
      {
        speaker: "Speaker 1",
        text: "This is a sample",
        start: 0,
        end: 2,
      },
    ],
    actionItems: ["Action Item 1"],
  };
}

export function buildTranscriptionCompletedPayload(
  result: TranscriptionResult,
  meta: { userEmail: string; plan: string; test?: boolean },
): TranscriptionCompletedWebhookPayload {
  return {
    event: "transcription.completed",
    status: "completed",
    source: "staz-ai",
    ...(meta.test ? { test: true as const } : {}),
    metadata: {
      userEmail: meta.userEmail,
      plan: formatPlanLabel(meta.plan),
      fileName: result.fileName,
      duration: parseDurationSeconds(result.duration),
      processedAt: result.processedAt,
    },
    summary: mapSummary(result),
    fullText: buildTranscriptText(result),
    transcript: mapTranscript(result),
    actionItems: mapActionItems(result),
  };
}
