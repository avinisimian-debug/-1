import { del } from "@vercel/blob";
import { enqueueTranscriptionJob } from "@/features/jobs/server/transcription-queue";
import { runTranscriptionJob } from "@/features/jobs/server/process-transcription-job";
import { waitUntil } from "@/lib/wait-until";
import { syncUserPlanOnAccess } from "@/lib/users-store";
import { BadRequestError, NotFoundError } from "@/shared/api";
import type { LiveSession } from "../types";
import { getMeetingById, upsertMeeting } from "./meetings-store";
import { sendMeetingDigestEmail } from "./send-digest-email";

/**
 * Attach a Blob-uploaded recording to a meeting and kick off the AI pipeline.
 */
export async function ingestMeetingRecording(input: {
  meetingId: string;
  ownerEmail: string;
  blobUrl: string;
  pathname: string;
  fileName: string;
  contentType: string;
  fileSize?: number;
}): Promise<LiveSession> {
  const meeting = await getMeetingById(input.meetingId);
  if (!meeting) throw new NotFoundError("Meeting not found.");
  if (meeting.ownerEmail !== input.ownerEmail.toLowerCase()) {
    throw new NotFoundError("Meeting not found.");
  }

  if (!input.blobUrl || !input.pathname) {
    throw new BadRequestError("Missing recording blob reference.");
  }

  if (
    meeting.recordingBlobUrl &&
    meeting.recordingBlobUrl !== input.blobUrl &&
    process.env.BLOB_READ_WRITE_TOKEN
  ) {
    await del(meeting.recordingBlobUrl).catch(() => {});
  }

  const language =
    meeting.bot.language && meeting.bot.language !== "auto"
      ? meeting.bot.language
      : "auto";

  let plan: "free" | "pro" = "free";
  try {
    plan = await syncUserPlanOnAccess(meeting.ownerEmail);
  } catch {
    plan = "free";
  }

  const job = await enqueueTranscriptionJob({
    ownerEmail: meeting.ownerEmail,
    fileName: input.fileName || `${meeting.title}.mp4`,
    fileSize: input.fileSize ?? 0,
    plan,
    language,
    audioBlobUrl: input.blobUrl,
    pathname: input.pathname,
    contentType: input.contentType || "video/mp4",
    meetingId: input.meetingId,
  });

  const updated: LiveSession = {
    ...meeting,
    recordingBlobUrl: input.blobUrl,
    recordingPathname: input.pathname,
    recordingContentType: input.contentType || "video/mp4",
    transcriptionJobId: job.id,
    botStatus: "transcribing",
    digest: undefined,
    error: undefined,
    updatedAt: new Date().toISOString(),
  };
  await upsertMeeting(updated);

  waitUntil(runTranscriptionJob(job.id));

  return updated;
}

type DigestLike = {
  followUpEmail?: { subject?: string; body?: string };
  executiveSummary?: string;
  overview?: string;
  actionItems?: Array<{ task?: string; owner?: string } | string>;
};

function extractDigestFields(digest: unknown): {
  subject: string;
  body: string;
  summary?: string;
  actions: string[];
} {
  const d = (digest ?? {}) as DigestLike & {
    summary?: { overview?: string; executive?: string[] };
  };
  const actions = (d.actionItems ?? [])
    .map((item) => {
      if (typeof item === "string") return item.trim();
      const task = item.task?.trim() ?? "";
      const owner = item.owner?.trim();
      if (!task) return "";
      return owner ? `${task} (${owner})` : task;
    })
    .filter(Boolean)
    .slice(0, 12);

  const summary =
    d.executiveSummary?.trim() ||
    d.overview?.trim() ||
    d.summary?.overview?.trim() ||
    d.summary?.executive?.slice(0, 3).join(" ").trim() ||
    undefined;

  return {
    subject:
      d.followUpEmail?.subject?.trim() ||
      "Your meeting digest is ready",
    body:
      d.followUpEmail?.body?.trim() ||
      "Your automated meeting digest is ready. Open the secure link to review the transcript, summary, and action items.",
    summary,
    actions,
  };
}

/**
 * Called when a transcription job linked to a meeting completes.
 */
export async function finalizeMeetingDigest(
  meetingId: string,
  digest: unknown,
  status: "ready" | "failed",
  error?: string,
): Promise<void> {
  const meeting = await getMeetingById(meetingId);
  if (!meeting) return;

  const nextStatus = status === "ready" ? "ready" : "failed";
  // Brief analyzing signal before ready for UI fidelity
  if (status === "ready") {
    await upsertMeeting({
      ...meeting,
      botStatus: "analyzing",
      updatedAt: new Date().toISOString(),
    });
  }

  await upsertMeeting({
    ...meeting,
    botStatus: nextStatus,
    digest: status === "ready" ? digest : meeting.digest,
    error: status === "failed" ? error : undefined,
    updatedAt: new Date().toISOString(),
  });

  if (status !== "ready") return;

  const recipients = [
    meeting.ownerEmail,
    ...(meeting.attendeeEmails ?? []),
  ];
  const fields = extractDigestFields(digest);
  const base =
    process.env.AUTH_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  const playbackUrl = base
    ? `${base}/live/${meeting.id}`
    : `/live/${meeting.id}`;

  waitUntil(
    sendMeetingDigestEmail({
      to: recipients,
      meetingTitle: meeting.title,
      meetingUrl: meeting.meetingUrl,
      playbackUrl,
      subject: `${fields.subject} — ${meeting.title}`,
      bodyText: fields.body,
      executiveSummary: fields.summary,
      actionItems: fields.actions,
    }).then((result) => {
      if (result.sent) {
        console.log(`[email] digest sent meeting=${meetingId} id=${result.id}`);
      } else if (result.skipped) {
        console.log(`[email] skipped meeting=${meetingId}: ${result.skipped}`);
      } else {
        console.warn(`[email] failed meeting=${meetingId}: ${result.error}`);
      }
    }),
  );
}
