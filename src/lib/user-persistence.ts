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

function hasBlobBackend(): boolean {
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
  const result = await get(BLOB_PATH, {
    access: "private",
    // Critical: default CDN cache returns stale Free after Pro upgrades.
    useCache: false,
  });
  if (!result || result.statusCode !== 200) return null;
  return await new Response(result.stream).text();
}

async function writeToBlob(content: string): Promise<void> {
  await put(BLOB_PATH, content, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

/**
 * Read persisted JSON.
 * On Vercel with Blob configured: never fall back to empty /tmp and then
 * overwrite Blob ג€” that wiped Pro purchases for everyone.
 */
export async function readPersistedJson<T>(fallback: T): Promise<T> {
  if (hasBlobBackend()) {
    try {
      const raw = await readFromBlob();
      if (!raw) return fallback;
      try {
        return JSON.parse(raw) as T;
      } catch {
        console.error("[user-persistence] Invalid JSON in Blob; using fallback");
        return fallback;
      }
    } catch (error) {
      console.error("[user-persistence] Blob read failed:", error);
      // Prefer local cache if present, but do NOT treat miss as authoritative empty.
      const local = await readFromLocalFile();
      if (local) {
        try {
          return JSON.parse(local) as T;
        } catch {
          /* ignore */
        }
      }
      throw error instanceof Error
        ? error
        : new Error("Failed to read user persistence from Blob");
    }
  }

  const raw = await readFromLocalFile();
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writePersistedJson<T>(data: T): Promise<void> {
  const content = JSON.stringify(data, null, 2);

  if (hasBlobBackend()) {
    // Guard: never overwrite Blob with an empty users array unless intentional.
    if (Array.isArray(data) && data.length === 0) {
      try {
        const existing = await readFromBlob();
        if (existing) {
          const parsed = JSON.parse(existing) as unknown;
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.error(
              "[user-persistence] Refusing to overwrite Blob users.json with empty array",
            );
            return;
          }
        }
      } catch {
        // If we cannot verify, still write ג€” first bootstrap.
      }
    }
    await writeToBlob(content);
  }

  try {
    await writeToLocalFile(content);
  } catch (error) {
    // Local /tmp write is best-effort on Vercel.
    if (!hasBlobBackend()) throw error;
    console.warn("[user-persistence] Local cache write failed:", error);
  }
}
