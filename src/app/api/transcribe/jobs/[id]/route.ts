import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { jobQueue } from "@/features/jobs/server/transcription-queue";
import { toPublicJob } from "@/features/jobs/types";
import { normalizeApiError } from "@/shared/api";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

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

    return NextResponse.json({ data: toPublicJob(job), error: null });
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
