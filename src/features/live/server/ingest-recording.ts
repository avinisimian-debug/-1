import { del } from "@vercel/blob";
import { enqueueTranscriptionJob } from "@/features/jobs/server/transcription-queue";
import { runTranscriptionJob } from "@/features/jobs/server/process-transcription-job";
import { waitUntil } from "@/lib/wait-until";
import { syncUserPlanOnAccess } from "@/lib/users-store";
import { BadRequestError, NotFoundError } from "@/shared/api";
import type { LiveSession } from "../types";
import { getMeetingById, upsertMeeting } from "./meetings-store";

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

  await upsertMeeting({
    ...meeting,
    botStatus: status === "ready" ? "ready" : "failed",
    digest: status === "ready" ? digest : meeting.digest,
    error: status === "failed" ? error : undefined,
    updatedAt: new Date().toISOString(),
  });
}
