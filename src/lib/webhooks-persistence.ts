import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { get, put } from "@vercel/blob";
import type { WebhookSettings } from "@/features/webhooks/types";

export type WebhooksDatabase = Record<string, WebhookSettings>;

export interface WebhooksPersistenceAdapter {
  read(): Promise<WebhooksDatabase>;
  write(data: WebhooksDatabase): Promise<void>;
}

const BLOB_PATH = "meetscribe/webhooks.json";

function getLocalDataDir(): string {
  if (process.env.VERCEL) {
    return join(tmpdir(), "meetscribe-data");
  }
  return join(process.cwd(), "data");
}

const LOCAL_FILE = join(getLocalDataDir(), "webhooks.json");

function hasBlobBackend(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** Local JSON file persistence (`data/webhooks.json`). */
export class LocalFileWebhooksPersistence implements WebhooksPersistenceAdapter {
  async read(): Promise<WebhooksDatabase> {
    try {
      if (!existsSync(LOCAL_FILE)) {
        return {};
      }
      const raw = await readFile(LOCAL_FILE, "utf8");
      return JSON.parse(raw) as WebhooksDatabase;
    } catch {
      return {};
    }
  }

  async write(data: WebhooksDatabase): Promise<void> {
    await mkdir(getLocalDataDir(), { recursive: true });
    await writeFile(LOCAL_FILE, JSON.stringify(data, null, 2), "utf8");
  }
}

/** Optional Vercel Blob backend ג€” enabled when BLOB_READ_WRITE_TOKEN is set. */
export class BlobWebhooksPersistence implements WebhooksPersistenceAdapter {
  async read(): Promise<WebhooksDatabase> {
    try {
      const result = await get(BLOB_PATH, { access: "private" });
      if (result?.statusCode !== 200) {
        return {};
      }
      const raw = await new Response(result.stream).text();
      return JSON.parse(raw) as WebhooksDatabase;
    } catch {
      return {};
    }
  }

  async write(data: WebhooksDatabase): Promise<void> {
    await put(BLOB_PATH, JSON.stringify(data, null, 2), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
  }
}

/**
 * Composite persistence: writes to Blob when configured, always mirrors to local file.
 * Swap `webhooksPersistence` in tests with a mock adapter.
 */
export class CompositeWebhooksPersistence implements WebhooksPersistenceAdapter {
  constructor(
    private readonly local = new LocalFileWebhooksPersistence(),
    private readonly blob = new BlobWebhooksPersistence(),
  ) {}

  async read(): Promise<WebhooksDatabase> {
    if (hasBlobBackend()) {
      const fromBlob = await this.blob.read();
      if (Object.keys(fromBlob).length > 0) {
        return fromBlob;
      }
    }
    return this.local.read();
  }

  async write(data: WebhooksDatabase): Promise<void> {
    if (hasBlobBackend()) {
      await this.blob.write(data);
    }
    await this.local.write(data);
  }
}

export const webhooksPersistence: WebhooksPersistenceAdapter =
  new CompositeWebhooksPersistence();
