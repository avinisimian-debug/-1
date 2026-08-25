import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { completeJobFromAssemblyAI } from "@/features/jobs/server/complete-assemblyai-job";
import { runTranscriptionJob } from "@/features/jobs/server/process-transcription-job";
import {
  getRetryDelayMs,
  jobQueue,
} from "@/features/jobs/server/transcription-queue";
import { toPublicJob } from "@/features/jobs/types";
import { waitUntil } from "@/lib/wait-until";
import { normalizeApiError } from "@/shared/api";

export const runtime = "nodejs";
export const maxDuration = 300;

type RouteContext = { params: Promise<{ id: string }> };

async function maybeReclaimQueuedJob(jobId: string): Promise<void> {
  const job = await jobQueue.get(jobId);
  if (!job) return;
  if (job.attempts >= job.maxAttempts) return;

  const updatedAt = Date.parse(job.updatedAt);
  if (!Number.isFinite(updatedAt)) return;

  const isYoutube = job.sourceKind === "youtube" && Boolean(job.sourceUrl);
  const stuckProcessing =
    isYoutube &&
    (job.status === "processing" || job.status === "transcribing") &&
    !job.assemblyaiTranscriptId &&
    Date.now() - updatedAt > 90_000;

  if (job.status === "queued") {
    const delay = job.attempts <= 0 ? 30_000 : getRetryDelayMs(job.attempts);
    if (Date.now() - updatedAt < delay) return;
  } else if (!stuckProcessing) {
    return;
  }

  console.log(
    `[jobs] reclaiming ${job.status} job=${jobId} attempt=${job.attempts}/${job.maxAttempts} youtube=${isYoutube}`,
  );

  if (stuckProcessing) {
    await jobQueue.update({
      ...job,
      status: "queued",
      updatedAt: new Date().toISOString(),
    });
  }

  waitUntil(runTranscriptionJob(jobId));
}

/** If GPT waitUntil died mid-analysis, resume from AssemblyAI transcript id. */
async function maybeReclaimAnalyzingJob(jobId: string): Promise<void> {
  const job = await jobQueue.get(jobId);
  if (!job) return;
  if (job.status !== "analyzing" && job.status !== "transcribing") return;

  const transcriptId = job.assemblyaiTranscriptId?.trim();
  if (!transcriptId) return;

  const updatedAt = Date.parse(job.updatedAt);
  if (!Number.isFinite(updatedAt)) return;
  if (Date.now() - updatedAt < 90_000) return;

  console.log(
    `[jobs] reclaiming analyzing job=${jobId} transcript=${transcriptId}`,
  );
  await jobQueue.update({
    ...job,
    updatedAt: new Date().toISOString(),
  });
  waitUntil(completeJobFromAssemblyAI(jobId, transcriptId));
}

/**
 * Poll async transcription job status.
 */
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        {
          data: null,
          error: { code: "UNAUTHORIZED", message: "Sign in required." },
        },
        { status: 401 },
      );
    }

    const { id } = await context.params;
    if (!id?.trim()) {
      return NextResponse.json(
        {
          data: null,
          error: { code: "BAD_REQUEST", message: "Missing job id." },
        },
        { status: 400 },
      );
    }

    const job = await jobQueue.get(id);
    if (!job) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "NOT_FOUND",
            message: "Job not found or expired. Re-upload and try again.",
          },
        },
        { status: 404 },
      );
    }

    const email = session.user.email.toLowerCase();
    if (job.ownerEmail !== email) {
      return NextResponse.json(
        {
          data: null,
          error: { code: "FORBIDDEN", message: "Not allowed to view this job." },
        },
        { status: 403 },
      );
    }

    await maybeReclaimQueuedJob(id);
    await maybeReclaimAnalyzingJob(id);

    const fresh = (await jobQueue.get(id)) ?? job;
    return NextResponse.json({ data: toPublicJob(fresh), error: null });
  } catch (error) {
    const normalized = normalizeApiError(error);
    return NextResponse.json(
      {
        data: null,
        error: { code: normalized.code, message: normalized.message },
      },
      { status: normalized.status },
    );
  }
}
