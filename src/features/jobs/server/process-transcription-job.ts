import { del } from "@vercel/blob";
import {
  canUseAssemblyAIWebhook,
  submitAssemblyAIWithWebhook,
} from "@/features/transcription/server/assemblyai-webhook";
import { prepareAudioForWhisper } from "@/features/transcription/server/prepare-audio";
import { transcribeAudio } from "@/features/transcription/server/transcribe.use-case";
import { isAssemblyAIConfigured } from "@/features/transcription/server/diarize-audio";
import {
  resolveUserId,
  triggerWebhook,
} from "@/features/webhooks/server/trigger-webhook";
import { finalizeMeetingDigest } from "@/features/live/server/ingest-recording";
import {
  assertBlobPathForUser,
  fileFromBlobUrl,
} from "@/lib/blob-file";
import { hasFeature } from "@/lib/plan-features";
import { incrementTranscriptionsToday } from "@/lib/stats-store";
import { isFailure } from "@/shared/lib/result";
import type { TranscriptionJob } from "../types";
import { jobQueue, markJobFailed } from "./transcription-queue";

async function linkMeetingResult(
  job: TranscriptionJob,
  status: "ready" | "failed",
  digest?: unknown,
  error?: string,
): Promise<void> {
  if (!job.meetingId) return;
  await finalizeMeetingDigest(job.meetingId, digest, status, error);
}

/**
 * Runs STT + GPT analysis for a queued blob upload job.
 * Prefers AssemblyAI webhook (async) on production HTTPS; otherwise blocking pipeline.
 */
export async function runTranscriptionJob(jobId: string): Promise<void> {
  const job = await jobQueue.get(jobId);
  if (!job) {
    console.error(`[jobs] job not found: ${jobId}`);
    return;
  }

  if (!job.audioBlobUrl || !job.pathname) {
    await markJobFailed(job, "Job is missing blob upload reference.");
    return;
  }

  try {
    assertBlobPathForUser(job.pathname, job.ownerEmail);
  } catch (error) {
    await markJobFailed(
      job,
      error instanceof Error ? error.message : "Invalid upload reference.",
    );
    return;
  }

  const running: TranscriptionJob = {
    ...job,
    status: "processing",
    attempts: job.attempts + 1,
    updatedAt: new Date().toISOString(),
  };
  await jobQueue.update(running);

  try {
    const file = await fileFromBlobUrl(
      job.audioBlobUrl,
      job.fileName,
      job.contentType ?? "application/octet-stream",
    );

    const language =
      job.language && job.language !== "auto" ? job.language : null;

    const useSpeakerLabels =
      job.plan === "pro" &&
      hasFeature("pro", "speakerDiarization") &&
      isAssemblyAIConfigured();

    // Production: submit to AssemblyAI with webhook — frees the serverless function.
    if (canUseAssemblyAIWebhook()) {
      const prepared = await prepareAudioForWhisper(file);
      const audioFile = isFailure(prepared) ? file : prepared.data.file;

      const submitted = await submitAssemblyAIWithWebhook(audioFile, job.id, {
        language,
        speakerLabels: useSpeakerLabels,
      });

      if (!isFailure(submitted)) {
        await jobQueue.update({
          ...running,
          status: "transcribing",
          assemblyaiTranscriptId: submitted.data.transcriptId,
          updatedAt: new Date().toISOString(),
        });
        console.log(
          `[jobs] AssemblyAI webhook submitted job=${job.id} transcript=${submitted.data.transcriptId}`,
        );
        return;
      }

      console.warn(
        "[jobs] AssemblyAI webhook submit failed; falling back to sync pipeline:",
        submitted.error.message,
      );
    }

    await jobQueue.update({
      ...running,
      status: "transcribing",
      updatedAt: new Date().toISOString(),
    });

    const result = await transcribeAudio({
      file,
      plan: running.plan,
      language,
    });

    if (isFailure(result)) {
      await markJobFailed(running, result.error.message);
      await linkMeetingResult(running, "failed", undefined, result.error.message);
      return;
    }

    await jobQueue.update({
      ...running,
      status: "completed",
      result: result.data,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      error: undefined,
    });

    await incrementTranscriptionsToday();
    await linkMeetingResult(running, "ready", result.data);

    const userId = resolveUserId(running.ownerEmail);
    await triggerWebhook(userId, {
      userEmail: running.ownerEmail,
      plan: running.plan,
      result: result.data,
    }).catch(() => {});

    if (running.audioBlobUrl && process.env.BLOB_READ_WRITE_TOKEN) {
      // Keep recording when linked to a Live meeting for playback.
      if (!running.meetingId) {
        await del(running.audioBlobUrl).catch(() => {});
      }
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Processing failed";
    await markJobFailed(running, message);
    await linkMeetingResult(running, "failed", undefined, message);
  }
}

export function isTerminalJobStatus(status: TranscriptionJob["status"]): boolean {
  return status === "completed" || status === "failed";
}
