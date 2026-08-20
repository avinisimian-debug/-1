import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  deleteMeetingForUser,
  getMeetingForUser,
} from "@/features/library/server/meetings-store";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "נדרשת התחברות." }, { status: 401 });
  }

  const { id } = await context.params;
  const meeting = await getMeetingForUser(session.user.email, id);
  if (!meeting) {
    return NextResponse.json({ error: "הפגישה לא נמצאה." }, { status: 404 });
  }

  return NextResponse.json({
    meeting: {
      id: meeting.id,
      title: meeting.title,
      createdAt: meeting.createdAt,
      mediaKind: meeting.mediaKind,
      hasMedia: Boolean(meeting.mediaBlobUrl),
      persistStatus: meeting.persistStatus ?? "complete",
      result: meeting.result,
    },
  });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const ok = await deleteMeetingForUser(session.user.email, id);
  if (!ok) {
    return NextResponse.json({ error: "הפגישה לא נמצאה." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
