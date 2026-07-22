import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { get, put } from "@vercel/blob";
import type { LiveSession } from "../types";

export type MeetingsDatabase = Record<string, LiveSession>;

const BLOB_PATH = "meetscribe/live-meetings.json";

function getLocalDataDir(): string {
  if (process.env.VERCEL) {
    return join(tmpdir(), "meetscribe-data");
  }
  return join(process.cwd(), "data");
}

const LOCAL_FILE = join(getLocalDataDir(), "live-meetings.json");

function blobStorageEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

async function readAll(): Promise<MeetingsDatabase> {
  try {
    if (blobStorageEnabled()) {
      const result = await get(BLOB_PATH, { access: "private", useCache: false });
      if (result?.statusCode === 200) {
        const raw = await new Response(result.stream).text();
        return JSON.parse(raw) as MeetingsDatabase;
      }
    }
    if (existsSync(LOCAL_FILE)) {
      const raw = await readFile(LOCAL_FILE, "utf8");
      return JSON.parse(raw) as MeetingsDatabase;
    }
  } catch (error) {
    console.error("[live-meetings] read failed:", error);
  }
  return {};
}

async function writeAll(db: MeetingsDatabase): Promise<void> {
  const content = JSON.stringify(db, null, 2);
  await mkdir(getLocalDataDir(), { recursive: true });
  await writeFile(LOCAL_FILE, content, "utf8");
  if (blobStorageEnabled()) {
    await put(BLOB_PATH, content, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
  }
}

export async function listMeetingsForOwner(email: string): Promise<LiveSession[]> {
  const db = await readAll();
  const key = email.toLowerCase();
  return Object.values(db)
    .filter((m) => m.ownerEmail === key)
    .sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    );
}

export async function getMeetingById(id: string): Promise<LiveSession | null> {
  const db = await readAll();
  return db[id] ?? null;
}

export async function findMeetingByExternalBotId(
  botId: string,
): Promise<LiveSession | null> {
  if (!botId.trim()) return null;
  const db = await readAll();
  return (
    Object.values(db).find((m) => m.externalBotId === botId.trim()) ?? null
  );
}

export async function upsertMeeting(session: LiveSession): Promise<LiveSession> {
  const db = await readAll();
  db[session.id] = session;
  await writeAll(db);
  return session;
}

export async function deleteMeeting(id: string, ownerEmail: string): Promise<boolean> {
  const db = await readAll();
  const existing = db[id];
  if (!existing || existing.ownerEmail !== ownerEmail.toLowerCase()) {
    return false;
  }
  delete db[id];
  await writeAll(db);
  return true;
}

export async function listDueMeetings(now = new Date()): Promise<LiveSession[]> {
  const db = await readAll();
  const { isDueForBotDispatch } = await import("./platform-resolver");
  return Object.values(db).filter((m) => isDueForBotDispatch(m, now));
}

export async function listMeetingsByJobId(
  jobId: string,
): Promise<LiveSession | null> {
  const db = await readAll();
  return (
    Object.values(db).find((m) => m.transcriptionJobId === jobId) ?? null
  );
}
