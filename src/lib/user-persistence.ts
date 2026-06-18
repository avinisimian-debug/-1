import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { get, put } from "@vercel/blob";

const BLOB_PATH = "meetscribe/users.json";

function getLocalDataDir(): string {
  if (process.env.VERCEL) {
    return join(tmpdir(), "meetscribe-data");
  }
  return join(process.cwd(), "data");
}

const LOCAL_USERS_FILE = join(getLocalDataDir(), "users.json");

function useBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readFromLocalFile(): Promise<string | null> {
  try {
    if (!existsSync(LOCAL_USERS_FILE)) return null;
    return await readFile(LOCAL_USERS_FILE, "utf8");
  } catch {
    return null;
  }
}

async function writeToLocalFile(content: string): Promise<void> {
  await mkdir(getLocalDataDir(), { recursive: true });
  await writeFile(LOCAL_USERS_FILE, content, "utf8");
}

async function readFromBlob(): Promise<string | null> {
  try {
    const result = await get(BLOB_PATH, { access: "private" });
    if (!result || result.statusCode !== 200) return null;
    return await new Response(result.stream).text();
  } catch {
    return null;
  }
}

async function writeToBlob(content: string): Promise<void> {
  await put(BLOB_PATH, content, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function readPersistedJson<T>(fallback: T): Promise<T> {
  let raw: string | null = null;

  if (useBlobStorage()) {
    raw = await readFromBlob();
  }

  if (!raw) {
    raw = await readFromLocalFile();
  }

  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writePersistedJson<T>(data: T): Promise<void> {
  const content = JSON.stringify(data, null, 2);

  if (useBlobStorage()) {
    await writeToBlob(content);
  }

  await writeToLocalFile(content);
}
