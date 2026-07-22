import { NextRequest, NextResponse } from "next/server";
import {
  fetchRecallRecordingDownloadUrl,
} from "@/features/live/server/adapters/recall.adapter";
import { ingestMeetingRecording } from "@/features/live/server/ingest-recording";
import {
  findMeetingByExternalBotId,
  getMeetingById,
  upsertMeeting,
} from "@/features/live/server/meetings-store";
import { streamRemoteUrlToBlob } from "@/features/live/server/stream-to-blob";
import { normalizeSecret } from "@/lib/transcription-ready";
import { waitUntil } from "@/lib/wait-until";
import type { LiveSession } from "@/features/live/types";

export const runtime = "nodejs";
export const maxDuration = 300;

type RecallWebhookBody = {
  event?: string;
  status?: string;
  video_url?: string;
  recording_url?: string;
  data?: {
    status?: string;
    video_url?: string;
    data?: { code?: string; sub_code?: string | null };
    bot?: { id?: string; metadata?: { meetingId?: string } };
  };
};

function authorizeRecallWebhook(request: NextRequest): boolean {
  const secret =
    normalizeSecret(process.env.RECALL_WEBHOOK_SECRET) ||
    normalizeSecret(process.env.CRON_SECRET) ||
    normalizeSecret(process.env.AUTH_SECRET);
  if (!secret) {
    // Dev/local without secrets — allow (production should set CRON_SECRET/AUTH_SECRET).
    return process.env.VERCEL !== "1";
  }

  const auth = request.headers.get("authorization")?.trim();
  if (auth === `Bearer ${secret}`) return true;

  const headerSecret =
    request.headers.get("x-recall-secret")?.trim() ||
    request.headers.get("x-webhook-secret")?.trim();
  if (headerSecret && headerSecret === secret) return true;

  // Optional query token for dashboard webhooks that can't set headers easily.
  const q = request.nextUrl.searchParams.get("token")?.trim();
  if (q && q === secret) return true;

  return false;
}

function extractBotId(body: RecallWebhookBody): string | null {
  const id = body.data?.bot?.id;
  return typeof id === "string" && id.trim() ? id.trim() : null;
}

function extractEventCode(body: RecallWebhookBody): string {
  if (typeof body.event === "string" && body.event.trim()) {
    return body.event.trim().toLowerCase();
  }
  const nested = body.data?.data?.code;
  if (typeof nested === "string" && nested.trim()) {
    return nested.trim().toLowerCase();
  }
  if (typeof body.status === "string") return body.status.trim().toLowerCase();
  if (typeof body.data?.status === "string") {
    return body.data.status.trim().toLowerCase();
  }
  return "";
}

function extractLegacyRecordingUrl(body: RecallWebhookBody): string | null {
  if (typeof body.video_url === "string" && body.video_url) return body.video_url;
  if (typeof body.recording_url === "string" && body.recording_url) {
    return body.recording_url;
  }
  if (typeof body.data?.video_url === "string" && body.data.video_url) {
    return body.data.video_url;
  }
  return null;
}

async function resolveMeeting(
  request: NextRequest,
  body: RecallWebhookBody,
  botId: string | null,
): Promise<LiveSession | null> {
  const meetingIdParam = request.nextUrl.searchParams.get("meetingId")?.trim();
  if (meetingIdParam) {
    const byParam = await getMeetingById(meetingIdParam);
    if (byParam) return byParam;
  }

  const metaId = body.data?.bot?.metadata?.meetingId?.trim();
  if (metaId) {
    const byMeta = await getMeetingById(metaId);
    if (byMeta) return byMeta;
  }

  if (botId) {
    return findMeetingByExternalBotId(botId);
  }

  return null;
}

async function ingestFromUrl(
  meeting: LiveSession,
  recordingUrl: string,
): Promise<void> {
  await upsertMeeting({
    ...meeting,
    botStatus: "uploading",
    updatedAt: new Date().toISOString(),
  });

  const pathname = `transcribe/${meeting.ownerEmail}/live-${meeting.id}-${Date.now()}.mp4`;
  const uploaded = await streamRemoteUrlToBlob({
    sourceUrl: recordingUrl,
    pathname,
    contentType: "video/mp4",
  });

  await ingestMeetingRecording({
    meetingId: meeting.id,
    ownerEmail: meeting.ownerEmail,
    blobUrl: uploaded.url,
    pathname: uploaded.pathname,
    fileName: `${meeting.title}.mp4`,
    contentType: uploaded.contentType,
    fileSize: uploaded.size,
  });
}

/**
 * Recall.ai bot status webhook (dashboard/Svix or legacy query meetingId).
 * On bot.done: Retrieve Bot → stream mixed MP4 into Blob → AI pipeline.
 */
export async function POST(request: NextRequest) {
  if (!authorizeRecallWebhook(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: RecallWebhookBody;
  try {
    body = (await request.json()) as RecallWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const botId = extractBotId(body);
  const eventCode = extractEventCode(body);
  const meeting = await resolveMeeting(request, body, botId);

  console.log(
    `[recall-webhook] event=${eventCode} bot=${botId ?? "-"} meeting=${meeting?.id ?? "-"}`,
  );

  if (!meeting) {
    return NextResponse.json({ ok: true, ignored: "meeting_not_found" });
  }

  if (
    eventCode.includes("fatal") ||
    eventCode === "error" ||
    eventCode === "bot.fatal"
  ) {
    await upsertMeeting({
      ...meeting,
      botStatus: "failed",
      error: "Recall.ai bot failed",
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  }

  if (
    eventCode.includes("in_call") ||
    eventCode.includes("recording") ||
    eventCode === "bot.in_call_recording"
  ) {
    await upsertMeeting({
      ...meeting,
      botStatus: "recording",
      externalBotId: botId || meeting.externalBotId,
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  }

  const isDone =
    eventCode === "bot.done" ||
    eventCode === "done" ||
    eventCode.endsWith(".done");

  const legacyUrl = extractLegacyRecordingUrl(body);

  if (isDone || legacyUrl) {
    waitUntil(
      (async () => {
        try {
          let recordingUrl = legacyUrl;
          if (!recordingUrl) {
            if (!botId) {
              throw new Error("Missing bot id for recording retrieve.");
            }
            const fetched = await fetchRecallRecordingDownloadUrl(botId);
            recordingUrl = fetched.downloadUrl;
            if (
              fetched.meetingIdFromMeta &&
              fetched.meetingIdFromMeta !== meeting.id
            ) {
              console.warn(
                `[recall-webhook] metadata meeting mismatch webhook=${meeting.id} meta=${fetched.meetingIdFromMeta}`,
              );
            }
          }

          await ingestFromUrl(meeting, recordingUrl);
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
