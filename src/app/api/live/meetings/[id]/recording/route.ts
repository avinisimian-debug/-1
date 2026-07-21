import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { ingestMeetingRecording } from "@/features/live/server/ingest-recording";
import { toPublicMeeting } from "@/features/live/server/bot-orchestrator";
import { assertBlobPathForUser } from "@/lib/blob-file";
import { normalizeApiError } from "@/shared/api";

export const runtime = "nodejs";
export const maxDuration = 60;

type Ctx = { params: Promise<{ id: string }> };

const BodySchema = z.object({
  blobUrl: z.string().url(),
  pathname: z.string().min(1),
  fileName: z.string().min(1).max(512),
  contentType: z.string().min(1).max(200),
  fileSize: z.number().int().positive().optional(),
});

/**
 * Attach a Blob recording to a scheduled meeting and start STT + GPT pipeline.
 */
export async function POST(request: NextRequest, context: Ctx) {
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
    const raw = await request.json();
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "BAD_REQUEST",
            message: parsed.error.issues[0]?.message ?? "Invalid payload.",
          },
        },
        { status: 400 },
      );
    }

    const email = session.user.email.toLowerCase();
    assertBlobPathForUser(parsed.data.pathname, email);

    const meeting = await ingestMeetingRecording({
      meetingId: id,
      ownerEmail: email,
      ...parsed.data,
    });

    return NextResponse.json(
      { data: toPublicMeeting(meeting), error: null },
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
