import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listMeetingsForUser } from "@/features/library/server/meetings-store";
import {
  assertCloudPersistence,
  CloudStorageUnavailableError,
} from "@/lib/runtime-env";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "נדרשת התחברות." }, { status: 401 });
  }

  try {
    assertCloudPersistence();
  } catch (error) {
    if (error instanceof CloudStorageUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    throw error;
  }

  const meetings = await listMeetingsForUser(session.user.email);
  return NextResponse.json({
    meetings: meetings.map((m) => ({
      id: m.id,
      title: m.title,
      createdAt: m.createdAt,
      fileName: m.result.fileName,
      headline: m.result.headline,
      hasMedia: Boolean(m.mediaBlobUrl),
      persistStatus: m.persistStatus ?? "complete",
    })),
  });
}
