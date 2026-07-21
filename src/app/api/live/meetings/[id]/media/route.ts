import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getMeetingById } from "@/features/live/server/meetings-store";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/**
 * Stream a private meeting recording for the owner (secure media playback).
 */
export async function GET(_request: NextRequest, context: Ctx) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const meeting = await getMeetingById(id);
  if (!meeting || meeting.ownerEmail !== session.user.email.toLowerCase()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!meeting.recordingBlobUrl) {
    return NextResponse.json({ error: "No recording" }, { status: 404 });
  }

  const result = await get(meeting.recordingBlobUrl, { access: "private" });
  if (!result || result.statusCode !== 200) {
    return NextResponse.json({ error: "Recording unavailable" }, { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type":
        meeting.recordingContentType || result.blob.contentType || "video/mp4",
      "Cache-Control": "private, max-age=60",
    },
  });
}
