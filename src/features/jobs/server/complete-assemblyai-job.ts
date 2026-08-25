import { analyzeTranscriptWithOpenAI } from "@/features/transcription/server/analyze-transcript.use-case";
import { finalizeMeetingDigest } from "@/features/live/server/ingest-recording";
import { fetchAssemblyAITranscriptById } from "@/features/transcription/server/assemblyai-webhook";
import { utterancesToTranscript } from "@/features/transcription/server/align-speakers";
import { attachWordsToEntries } from "@/features/transcription/server/build-word-timestamps";
import {
  jobQueue,
  markJobFailed,
} from "@/features/jobs/server/transcription-queue";
import {
  resolveUserId,
  triggerWebhook,
} from "@/features/webhooks/server/trigger-webhook";
import { hasFeature } from "@/lib/plan-features";
import { incrementTranscriptionsToday } from "@/lib/stats-store";
import { incrementServerUsage } from "@/lib/usage-server";
import {
  saveMeetingForUser,
  recoverableFailedResult,
} from "@/features/library/server/meetings-store";
import { isFailure } from "@/shared/lib/result";

/**
 * Finish GPT closeout after AssemblyAI STT completed.
 * Safe to retry if a previous waitUntil was interrupted.
 */
export async function completeJobFromAssemblyAI(
  jobId: string,
  transcriptId: string,
): Promise<void> {
  const job = await jobQueue.get(jobId);
  if (!job || job.status === "completed" || job.status === "failed") return;

  try {
    await jobQueue.update({
      ...job,
      status: "analyzing",
      assemblyaiTranscriptId: transcriptId,
      updatedAt: new Date().toISOString(),
    });

    const stt = await fetchAssemblyAITranscriptById(transcriptId);
    if (isFailure(stt)) {
      const failed = await markJobFailed(job, stt.error.message);
      if (failed.meetingId) {
        await finalizeMeetingDigest(
          failed.meetingId,
          undefined,
          "failed",
          failed.error,
        );
      }
      return;
    }

    const useSpeakerLabels =
      job.plan === "pro" &&
      hasFeature("pro", "speakerDiarization") &&
      job.forceDiarization !== false;

    let transcriptLines =
      stt.data.utterances.length > 0
        ? utterancesToTranscript(stt.data.utterances)
        : [
            {
              timestamp: "00:00",
              speaker: "Speaker 1",
              speakerId: "1",
              text: stt.data.transcriptText,
            },
          ];

    const timedWords = stt.data.timedWords ?? [];
    if (timedWords.length > 0) {
      transcriptLines = attachWordsToEntries(transcriptLines, timedWords);
    }

    // Always succeeds with at least a partial closeout + full transcript.
    const analyzed = await analyzeTranscriptWithOpenAI({
      fileName: job.fileName,
      plan: job.plan,
      transcriptText: stt.data.transcriptText,
      durationSeconds: stt.data.durationSeconds,
      transcript: transcriptLines,
      timedWords,
      diarizationEnabled: useSpeakerLabels && stt.data.utterances.length > 0,
    });

    if (isFailure(analyzed)) {
      try {
        await saveMeetingForUser({
          ownerEmail: job.ownerEmail,
          result: recoverableFailedResult(
            job.fileName,
            "הניתוח נכשל. ההקלטה נשמרה.",
          ),
          mediaBlobUrl: job.audioBlobUrl,
          mediaKind: job.contentType?.startsWith("video/") ? "video" : "audio",
          plan: job.plan,
          persistStatus: "failed_recoverable",
        });
      } catch (error) {
        console.error("[assemblyai-complete] recoverable save failed", error);
      }
      const failed = await markJobFailed(job, analyzed.error.message);
      if (failed.meetingId) {
        await finalizeMeetingDigest(
          failed.meetingId,
          undefined,
          "failed",
          failed.error,
        );
      }
      return;
    }

    await jobQueue.update({
      ...job,
      status: "completed",
      result: analyzed.data,
      assemblyaiTranscriptId: transcriptId,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      error: undefined,
    });

    try {
      await saveMeetingForUser({
        ownerEmail: job.ownerEmail,
        result: analyzed.data,
        mediaBlobUrl: job.audioBlobUrl,
        mediaKind: job.contentType?.startsWith("video/") ? "video" : "audio",
        plan: job.plan,
        persistStatus: "complete",
      });
    } catch (error) {
      console.error("[assemblyai-complete] library save failed", error);
      await markJobFailed(job, "העיבוד הצליח אך הספרייה בענן לא נשמרה.");
      return;
    }

    await incrementTranscriptionsToday();
    await incrementServerUsage(job.ownerEmail);

    if (job.meetingId) {
      await finalizeMeetingDigest(job.meetingId, analyzed.data, "ready");
    }

    const userId = resolveUserId(job.ownerEmail);
    await triggerWebhook(userId, {
      userEmail: job.ownerEmail,
      plan: job.plan,
      result: analyzed.data,
    }).catch(() => {});
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook completion failed";
    console.error("[assemblyai-complete] failed:", message);
    const current = await jobQueue.get(jobId);
    if (current) {
      await markJobFailed(current, message);
      if (current.meetingId) {
        await finalizeMeetingDigest(
          current.meetingId,
          undefined,
          "failed",
          message,
        );
      }
    }
  }
}
