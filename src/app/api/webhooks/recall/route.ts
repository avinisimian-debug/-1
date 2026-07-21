import { NextRequest, NextResponse } from "next/server";
import { getMeetingById, upsertMeeting } from "@/features/live/server/meetings-store";
import { ingestMeetingRecording } from "@/features/live/server/ingest-recording";
import { waitUntil } from "@/lib/wait-until";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * Recall.ai status / recording webhook.
 * When a recording URL is available, download to Blob is out-of-band;
 * for MVP we store the external video URL and trigger ingest if we can
 * fetch into a File (or mark awaiting for manual attach).
 */
export async function POST(request: NextRequest) {
  const meetingId = request.nextUrl.searchParams.get("meetingId")?.trim();
  if (!meetingId) {
    return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const meeting = await getMeetingById(meetingId);
  if (!meeting) {
    return NextResponse.json({ ok: true, ignored: "meeting_not_found" });
  }

  const status =
    typeof body.status === "string"
      ? body.status
      : typeof (body.data as { status?: string } | undefined)?.status === "string"
        ? (body.data as { status: string }).status
        : "";

  const recordingUrl =
    (typeof body.video_url === "string" && body.video_url) ||
    (typeof body.recording_url === "string" && body.recording_url) ||
    (typeof (body.data as { video_url?: string } | undefined)?.video_url ===
      "string" &&
      (body.data as { video_url: string }).video_url) ||
    null;

  console.log(
    `[recall-webhook] meeting=${meetingId} status=${status} hasRecording=${Boolean(recordingUrl)}`,
  );

  if (status.toLowerCase().includes("fatal") || status === "error") {
    await upsertMeeting({
      ...meeting,
      botStatus: "failed",
      error: "Recall.ai bot failed",
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  }

  if (
    status.toLowerCase().includes("in_call") ||
    status.toLowerCase().includes("recording")
  ) {
    await upsertMeeting({
      ...meeting,
      botStatus: "recording",
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  }

  if (recordingUrl && typeof recordingUrl === "string") {
    waitUntil(
      (async () => {
        try {
          const res = await fetch(recordingUrl);
          if (!res.ok) throw new Error(`Download failed (${res.status})`);
          const buffer = Buffer.from(await res.arrayBuffer());
          const { put } = await import("@vercel/blob");
          const pathname = `transcribe/${meeting.ownerEmail}/live-${meeting.id}-${Date.now()}.mp4`;
          const blob = await put(pathname, buffer, {
            access: "private",
            contentType: "video/mp4",
            addRandomSuffix: false,
          });
          await ingestMeetingRecording({
            meetingId: meeting.id,
            ownerEmail: meeting.ownerEmail,
            blobUrl: blob.url,
            pathname: blob.pathname,
            fileName: `${meeting.title}.mp4`,
            contentType: "video/mp4",
            fileSize: buffer.length,
          });
        } catch (error) {
          console.error("[recall-webhook] ingest failed:", error);
          await upsertMeeting({
            ...meeting,
            botStatus: "awaiting_recording",
            error:
              error instanceof Error
                ? error.message
                : "Could not ingest Recall recording",
            updatedAt: new Date().toISOString(),
          });
        }
      })(),
    );
    return NextResponse.json({ ok: true, ingesting: true });
  }

  return NextResponse.json({ ok: true });
}
