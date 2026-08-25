import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { reprocessMeetingRecording } from "@/features/live/server/ingest-recording";
import { normalizeApiError } from "@/shared/api";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, context: Ctx) {
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
    const data = await reprocessMeetingRecording({
      meetingId: id,
      ownerEmail: session.user.email,
    });
    return NextResponse.json({ data, error: null });
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
