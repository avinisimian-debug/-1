import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getMeetingForUser } from "@/features/library/server/meetings-store";
import { get } from "@vercel/blob";

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
  if (!meeting?.mediaBlobUrl) {
    return NextResponse.json(
      { error: "אין הקלטה שמורה לפגישה זו." },
      { status: 404 },
    );
  }

  const result = await get(meeting.mediaBlobUrl, { access: "private" });
  if (!result || result.statusCode !== 200) {
    return NextResponse.json(
      { error: "אין הקלטה שמורה לפגישה זו." },
      { status: 404 },
    );
  }

  const buffer = Buffer.from(await new Response(result.stream).arrayBuffer());
  const type =
    meeting.mediaKind === "video" ? "video/mp4" : "audio/mpeg";

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": type,
      "Cache-Control": "private, max-age=60",
      "Content-Disposition": "inline",
    },
  });
}
