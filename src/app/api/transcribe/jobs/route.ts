import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { enqueueTranscriptionJob } from "@/features/jobs/server/transcription-queue";
import { runTranscriptionJob } from "@/features/jobs/server/process-transcription-job";
import { toPublicJob } from "@/features/jobs/types";
import { assertBlobPathForUser } from "@/lib/blob-file";
import { assertTranscriptionReady } from "@/lib/transcription-ready";
import { waitUntil } from "@/lib/wait-until";
import { syncUserPlanOnAccess } from "@/lib/users-store";
import { normalizeApiError } from "@/shared/api";

export const runtime = "nodejs";
export const maxDuration = 300;

const EnqueueSchema = z.object({
  blobUrl: z.string().url(),
  pathname: z.string().min(1),
  fileName: z.string().min(1).max(512),
  contentType: z.string().min(1).max(200),
  fileSize: z.number().int().positive().optional(),
  language: z.string().max(16).optional().nullable(),
});

/**
 * Enqueue async transcription for a Blob-uploaded file.
 * Returns 202 + jobId; processing continues via waitUntil.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        {
          data: null,
          error: { code: "UNAUTHORIZED", message: "Sign in required to transcribe." },
        },
        { status: 401 },
      );
    }

    try {
      assertTranscriptionReady(true);
    } catch (error) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "BAD_REQUEST",
            message:
              error instanceof Error
                ? error.message
                : "CONFIG_ERROR: Transcription misconfigured.",
          },
        },
        { status: 400 },
      );
    }

    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return NextResponse.json(
        {
          data: null,
          error: { code: "BAD_REQUEST", message: "Invalid JSON body." },
        },
        { status: 400 },
      );
    }

    const parsed = EnqueueSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "BAD_REQUEST",
            message: parsed.error.issues[0]?.message ?? "Invalid job payload.",
          },
        },
        { status: 400 },
      );
    }

    const body = parsed.data;
    const email = session.user.email.toLowerCase();
    assertBlobPathForUser(body.pathname, email);

    let plan: "free" | "pro" = "free";
    try {
      plan = await syncUserPlanOnAccess(email, session.user.name ?? undefined);
    } catch (error) {
      console.error("[transcribe-jobs] plan sync failed:", error);
    }

    const job = await enqueueTranscriptionJob({
      ownerEmail: email,
      fileName: body.fileName,
      fileSize: body.fileSize ?? 0,
      plan,
      language:
        body.language && body.language !== "auto" ? body.language : "auto",
      audioBlobUrl: body.blobUrl,
      pathname: body.pathname,
      contentType: body.contentType,
    });

    waitUntil(runTranscriptionJob(job.id));

    return NextResponse.json(
      { data: toPublicJob(job), error: null },
      { status: 202 },
    );
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
