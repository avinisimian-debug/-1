import { AssemblyAI } from "assemblyai";
import { getAppBaseUrl } from "@/lib/paypal-subscriptions";
import {
  isAssemblyAIConfigured,
} from "@/lib/transcription-ready";
import { failure, success, type Result } from "@/shared/lib/result";
import {
  mapAssemblyAITranscript,
  type AssemblyAITranscribeOptions,
  type DiarizationTranscriptResult,
} from "./diarize-audio";

export const ASSEMBLYAI_WEBHOOK_HEADER = "X-AssemblyAI-Webhook-Secret";

export function getAssemblyAIWebhookSecret(): string {
  return (
    process.env.ASSEMBLYAI_WEBHOOK_SECRET?.trim() ||
    process.env.AUTH_SECRET?.trim() ||
    ""
  );
}

/** Public HTTPS base URL required for AssemblyAI to call our webhook. */
export function canUseAssemblyAIWebhook(): boolean {
  if (!isAssemblyAIConfigured()) return false;
  const base = getAppBaseUrl();
  if (!base.startsWith("https://")) return false;
  if (base.includes("localhost") || base.includes("127.0.0.1")) return false;
  return Boolean(getAssemblyAIWebhookSecret());
}

export function buildAssemblyAIWebhookUrl(jobId: string): string {
  const base = getAppBaseUrl().replace(/\/$/, "");
  return `${base}/api/webhooks/assemblyai?jobId=${encodeURIComponent(jobId)}`;
}

function getClient(): AssemblyAI {
  const apiKey = process.env.ASSEMBLYAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("ASSEMBLYAI_API_KEY is not configured.");
  }
  return new AssemblyAI({ apiKey });
}

export interface SubmittedAssemblyAIJob {
  transcriptId: string;
}

/**
 * Upload audio + submit AssemblyAI job with webhook callback (non-blocking).
 * Equivalent to the Express `startTranscription` sample, adapted for App Router jobs.
 */
export async function submitAssemblyAIWithWebhook(
  audioFile: File,
  jobId: string,
  options: AssemblyAITranscribeOptions = {},
): Promise<Result<SubmittedAssemblyAIJob, Error>> {
  try {
    if (!canUseAssemblyAIWebhook()) {
      return failure(
        new Error(
          "AssemblyAI webhook requires HTTPS AUTH_URL and ASSEMBLYAI_WEBHOOK_SECRET (or AUTH_SECRET).",
        ),
      );
    }

    const client = getClient();
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const uploadUrl = await client.files.upload(buffer);

    const languageCode =
      options.language && options.language !== "auto"
        ? options.language
        : undefined;

    const secret = getAssemblyAIWebhookSecret();
    const submitted = await client.transcripts.submit({
      audio: uploadUrl,
      speaker_labels: Boolean(options.speakerLabels),
      ...(languageCode ? { language_code: languageCode } : {}),
      webhook_url: buildAssemblyAIWebhookUrl(jobId),
      webhook_auth_header_name: ASSEMBLYAI_WEBHOOK_HEADER,
      webhook_auth_header_value: secret,
    });

    if (!submitted.id) {
      return failure(new Error("AssemblyAI did not return a transcript id."));
    }

    return success({ transcriptId: submitted.id });
  } catch (error) {
    return failure(
      error instanceof Error
        ? error
        : new Error("Failed to submit AssemblyAI webhook job."),
    );
  }
}

/**
 * Fetch a completed transcript by id (used inside the webhook handler).
 */
export async function fetchAssemblyAITranscriptById(
  transcriptId: string,
): Promise<Result<DiarizationTranscriptResult, Error>> {
  try {
    const client = getClient();
    const transcript = await client.transcripts.get(transcriptId);

    if (transcript.status === "error") {
      return failure(
        new Error(transcript.error ?? "AssemblyAI transcription failed."),
      );
    }

    if (transcript.status !== "completed") {
      return failure(
        new Error(`Transcript not ready yet (status: ${transcript.status}).`),
      );
    }

    const mapped = mapAssemblyAITranscript(transcript);
    if (!mapped.transcriptText) {
      return failure(new Error("AssemblyAI returned an empty transcript."));
    }

    return success(mapped);
  } catch (error) {
    return failure(
      error instanceof Error
        ? error
        : new Error("Failed to fetch AssemblyAI transcript."),
    );
  }
}
