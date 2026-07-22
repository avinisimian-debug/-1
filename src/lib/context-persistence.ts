import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { get, put } from "@vercel/blob";

const BLOB_PATH = "meetscribe/context.json";

function getLocalDataDir(): string {
  if (process.env.VERCEL) {
    return join(tmpdir(), "meetscribe-data");
  }
  return join(process.cwd(), "data");
}

const LOCAL_FILE = join(getLocalDataDir(), "context.json");

function hasBlobBackend(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function readContextJson<T>(fallback: T): Promise<T> {
  let raw: string | null = null;

  if (hasBlobBackend()) {
    try {
      const result = await get(BLOB_PATH, { access: "private" });
      if (result?.statusCode === 200) {
        raw = await new Response(result.stream).text();
      }
    } catch {
      raw = null;
    }
  }

  if (!raw) {
    try {
      if (existsSync(LOCAL_FILE)) {
        raw = await readFile(LOCAL_FILE, "utf8");
      }
    } catch {
      raw = null;
    }
  }

  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeContextJson<T>(data: T): Promise<void> {
  const content = JSON.stringify(data, null, 2);

  if (hasBlobBackend()) {
    await put(BLOB_PATH, content, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
  }

  await mkdir(getLocalDataDir(), { recursive: true });
  await writeFile(LOCAL_FILE, content, "utf8");
}
