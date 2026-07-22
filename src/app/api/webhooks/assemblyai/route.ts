import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { analyzeTranscriptWithOpenAI } from "@/features/transcription/server/analyze-transcript.use-case";
import { finalizeMeetingDigest } from "@/features/live/server/ingest-recording";
import {
  ASSEMBLYAI_WEBHOOK_HEADER,
  fetchAssemblyAITranscriptById,
  getAssemblyAIWebhookSecret,
} from "@/features/transcription/server/assemblyai-webhook";
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
import { waitUntil } from "@/lib/wait-until";
import { isFailure } from "@/shared/lib/result";

export const runtime = "nodejs";
export const maxDuration = 300;

interface AssemblyAIWebhookBody {
  transcript_id?: string;
  status?: string;
  error?: string;
}

/**
 * AssemblyAI completion webhook (Next.js equivalent of the Express sample).
 * Must respond 2xx quickly; heavy GPT work is scheduled via waitUntil.
 *
 * POST /api/webhooks/assemblyai?jobId=…
 */
export async function POST(request: NextRequest) {
  try {
    const expected = getAssemblyAIWebhookSecret();
    if (expected) {
      const provided = request.headers.get(ASSEMBLYAI_WEBHOOK_HEADER);
      if (provided !== expected) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const jobId = request.nextUrl.searchParams.get("jobId")?.trim();
    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    }

    let body: AssemblyAIWebhookBody;
    try {
      body = (await request.json()) as AssemblyAIWebhookBody;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const transcriptId = body.transcript_id?.trim();
    const status = body.status?.trim();

    console.log(
      `[assemblyai-webhook] job=${jobId} transcript=${transcriptId} status=${status}`,
    );

    if (!transcriptId || !status) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const job = await jobQueue.get(jobId);
    if (!job) {
      // Acknowledge so AssemblyAI stops retrying for orphaned jobs.
      return NextResponse.json({ ok: true, ignored: "job_not_found" });
    }

    if (job.status === "completed" || job.status === "failed") {
      return NextResponse.json({ ok: true, ignored: "already_terminal" });
    }

    if (status === "error") {
      waitUntil(
        markJobFailed(
          job,
          body.error || "AssemblyAI transcription failed.",
        ),
      );
      return NextResponse.json({ ok: true });
    }

    if (status !== "completed") {
      return NextResponse.json({ ok: true, ignored: status });
    }

    // Acknowledge immediately; finish GPT analysis in the background.
    waitUntil(completeJobFromAssemblyAI(jobId, transcriptId));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[assemblyai-webhook] handler error:", error);
    // 5xx triggers AssemblyAI retries — only for unexpected failures before ack.
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

async function completeJobFromAssemblyAI(
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
      await markJobFailed(job, stt.error.message);
      return;
    }

    const useSpeakerLabels =
      job.plan === "pro" && hasFeature("pro", "speakerDiarization");

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
      await markJobFailed(job, analyzed.error.message);
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

    await incrementTranscriptionsToday();

    if (job.meetingId) {
      await finalizeMeetingDigest(job.meetingId, analyzed.data, "ready");
    }

    const userId = resolveUserId(job.ownerEmail);
    await triggerWebhook(userId, {
      userEmail: job.ownerEmail,
      plan: job.plan,
      result: analyzed.data,
    }).catch(() => {});

    if (job.audioBlobUrl && process.env.BLOB_READ_WRITE_TOKEN && !job.meetingId) {
      await del(job.audioBlobUrl).catch(() => {});
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook completion failed";
    console.error("[assemblyai-webhook] completeJob failed:", message);
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
