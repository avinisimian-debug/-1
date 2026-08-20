import type { PlanTier } from "@/lib/constants";
import type { TranscriptionResult } from "@/features/transcription/types";
import { PLAN_LIMITS } from "@/lib/constants";
import { HISTORY_LIMITS } from "@/lib/plan-features";
import { list, put, del, get } from "@vercel/blob";
import { mkdir, readdir, readFile, writeFile, unlink } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { assertCloudPersistence } from "@/lib/runtime-env";
import { randomUUID } from "crypto";

export type MeetingPersistStatus =
  | "complete"
  | "media_missing"
  | "failed_recoverable";

export interface StoredMeeting {
  id: string;
  ownerEmail: string;
  createdAt: string;
  title: string;
  mediaBlobUrl?: string;
  mediaKind?: "audio" | "video";
  persistStatus: MeetingPersistStatus;
  result: TranscriptionResult;
}

function ownerKey(email: string): string {
  return email.trim().toLowerCase();
}

function blobPrefix(email: string): string {
  return `meetscribe/meetings/${ownerKey(email)}/`;
}

function blobPath(email: string, id: string): string {
  return `${blobPrefix(email)}${id}.json`;
}

function localDir(email: string): string {
  const root = process.env.VERCEL
    ? join(tmpdir(), "staz-meetings")
    : join(process.cwd(), "data", "meetings");
  return join(root, ownerKey(email).replace(/[^a-z0-9.@_-]/g, "_"));
}

function hasBlob(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

async function writeMeeting(meeting: StoredMeeting): Promise<void> {
  assertCloudPersistence();
  const body = JSON.stringify(meeting);
  if (hasBlob()) {
    await put(blobPath(meeting.ownerEmail, meeting.id), body, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }
  const dir = localDir(meeting.ownerEmail);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, `${meeting.id}.json`), body, "utf8");
}

async function readMeetingFile(
  email: string,
  id: string,
): Promise<StoredMeeting | null> {
  try {
    if (hasBlob()) {
      const result = await get(blobPath(email, id), { access: "private" });
      if (!result || result.statusCode !== 200) return null;
      return JSON.parse(
        await new Response(result.stream).text(),
      ) as StoredMeeting;
    }
    const file = join(localDir(email), `${id}.json`);
    if (!existsSync(file)) return null;
    return JSON.parse(await readFile(file, "utf8")) as StoredMeeting;
  } catch {
    return null;
  }
}

export function recoverableFailedResult(
  fileName: string,
  reason: string,
): TranscriptionResult {
  return {
    fileName,
    duration: "—",
    processedAt: new Date().toISOString(),
    headline: fileName,
    summary: {
      executive: [],
      keyTakeaways: [],
      overview: `העיבוד לא הושלם. ההקלטה נשמרה בספרייה. ${reason}`,
    },
    actionItems: [],
    transcript: [],
  };
}

export async function saveMeetingForUser(input: {
  ownerEmail: string;
  result: TranscriptionResult;
  mediaBlobUrl?: string;
  mediaKind?: "audio" | "video";
  plan: PlanTier;
  persistStatus?: MeetingPersistStatus;
}): Promise<StoredMeeting> {
  const ownerEmail = ownerKey(input.ownerEmail);
  const persistStatus: MeetingPersistStatus =
    input.persistStatus ??
    (input.mediaBlobUrl ? "complete" : "media_missing");
  const meeting: StoredMeeting = {
    id: randomUUID(),
    ownerEmail,
    createdAt: new Date().toISOString(),
    title: input.result.headline?.trim() || input.result.fileName,
    mediaBlobUrl: input.mediaBlobUrl,
    mediaKind: input.mediaKind,
    persistStatus,
    result: input.result,
  };
  await writeMeeting(meeting);

  const cap = HISTORY_LIMITS[input.plan];
  const all = await listMeetingsForUser(ownerEmail);
  if (all.length > cap) {
    const extra = all.slice(cap);
    await Promise.all(extra.map((m) => deleteMeetingForUser(ownerEmail, m.id)));
  }
  return meeting;
}

export async function listMeetingsForUser(
  email: string,
): Promise<StoredMeeting[]> {
  const owner = ownerKey(email);
  const items: StoredMeeting[] = [];

  if (hasBlob()) {
    const listed = await list({ prefix: blobPrefix(owner), limit: 200 });
    for (const blob of listed.blobs) {
      try {
        const result = await get(blob.pathname, { access: "private" });
        if (!result || result.statusCode !== 200) continue;
        const parsed = JSON.parse(
          await new Response(result.stream).text(),
        ) as StoredMeeting;
        if (parsed.ownerEmail === owner) items.push(parsed);
      } catch {
        /* skip corrupt */
      }
    }
  } else {
    const dir = localDir(owner);
    if (existsSync(dir)) {
      const files = await readdir(dir);
      for (const file of files.filter((f) => f.endsWith(".json"))) {
        try {
          const parsed = JSON.parse(
            await readFile(join(dir, file), "utf8"),
          ) as StoredMeeting;
          if (parsed.ownerEmail === owner) items.push(parsed);
        } catch {
          /* skip */
        }
      }
    }
  }

  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getMeetingForUser(
  email: string,
  id: string,
): Promise<StoredMeeting | null> {
  const meeting = await readMeetingFile(email, id);
  if (!meeting || meeting.ownerEmail !== ownerKey(email)) return null;
  return meeting;
}

export async function deleteMeetingForUser(
  email: string,
  id: string,
): Promise<boolean> {
  const meeting = await getMeetingForUser(email, id);
  if (!meeting) return false;
  if (hasBlob()) {
    await del(blobPath(email, id)).catch(() => {});
  } else {
    const file = join(localDir(email), `${id}.json`);
    if (existsSync(file)) await unlink(file);
  }
  return true;
}

export function assertMeetingOwner(
  meeting: StoredMeeting,
  email: string,
): boolean {
  return meeting.ownerEmail === ownerKey(email);
}

export function monthlyQuota(plan: PlanTier): number {
  return PLAN_LIMITS[plan].transcriptionsPerMonth;
}
