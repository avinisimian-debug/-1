import { NextRequest, NextResponse } from "next/server";
import { completeJobFromAssemblyAI } from "@/features/jobs/server/complete-assemblyai-job";
import { finalizeMeetingDigest } from "@/features/live/server/ingest-recording";
import {
  ASSEMBLYAI_WEBHOOK_HEADER,
  getAssemblyAIWebhookSecret,
} from "@/features/transcription/server/assemblyai-webhook";
import {
  jobQueue,
  markJobFailed,
} from "@/features/jobs/server/transcription-queue";
import { waitUntil } from "@/lib/wait-until";

export const runtime = "nodejs";
export const maxDuration = 300;

interface AssemblyAIWebhookBody {
  transcript_id?: string;
  status?: string;
  error?: string;
}

/**
 * AssemblyAI completion webhook.
 * Must respond 2xx quickly; heavy GPT work is scheduled via waitUntil.
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
      return NextResponse.json({ ok: true, ignored: "job_not_found" });
    }

    if (job.status === "completed" || job.status === "failed") {
      return NextResponse.json({ ok: true, ignored: "already_terminal" });
    }

    if (status === "error") {
      waitUntil(
        (async () => {
          const failed = await markJobFailed(
            job,
            body.error || "AssemblyAI transcription failed.",
          );
          if (failed.meetingId) {
            await finalizeMeetingDigest(
              failed.meetingId,
              undefined,
              "failed",
              failed.error,
            );
          }
        })(),
      );
      return NextResponse.json({ ok: true });
    }

    if (status !== "completed") {
      return NextResponse.json({ ok: true, ignored: status });
    }

    waitUntil(completeJobFromAssemblyAI(jobId, transcriptId));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[assemblyai-webhook] handler error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
