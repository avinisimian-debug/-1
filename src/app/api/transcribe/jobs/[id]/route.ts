import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { runTranscriptionJob } from "@/features/jobs/server/process-transcription-job";
import {
  getRetryDelayMs,
  jobQueue,
} from "@/features/jobs/server/transcription-queue";
import { toPublicJob } from "@/features/jobs/types";
import { waitUntil } from "@/lib/wait-until";
import { normalizeApiError } from "@/shared/api";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Reclaim queued jobs that still have attempts left after a failure backoff.
 * Polling clients become the retry dispatcher (no separate worker required).
 */
async function maybeReclaimQueuedJob(jobId: string): Promise<void> {
  const job = await jobQueue.get(jobId);
  if (!job || job.status !== "queued") return;
  if (job.attempts >= job.maxAttempts) return;

  const updatedAt = Date.parse(job.updatedAt);
  if (!Number.isFinite(updatedAt)) return;

  // Fresh jobs are started by POST waitUntil — only reclaim if stuck.
  const delay =
    job.attempts <= 0 ? 30_000 : getRetryDelayMs(job.attempts);
  if (Date.now() - updatedAt < delay) return;

  console.log(
    `[jobs] reclaiming queued job=${jobId} attempt=${job.attempts}/${job.maxAttempts}`,
  );
  waitUntil(runTranscriptionJob(jobId));
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
