import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { get, put } from "@vercel/blob";

const BLOB_PATH = "meetscribe/paypal-plans.json";

export interface CachedPayPalPlans {
  productId?: string;
  launchPlanId?: string;
  launchPlanTrialDays?: number;
  regularPlanId?: string;
}

function getLocalFile(): string {
  const dir = process.env.VERCEL
    ? join(tmpdir(), "meetscribe-data")
    : join(process.cwd(), "data");
  return join(dir, "paypal-plans.json");
}

function useBlob(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function readPayPalPlanCache(): Promise<CachedPayPalPlans> {
  let raw: string | null = null;

  if (useBlob()) {
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
      const file = getLocalFile();
      if (existsSync(file)) raw = await readFile(file, "utf8");
    } catch {
      raw = null;
    }
  }

  if (!raw) return {};

  try {
    return JSON.parse(raw) as CachedPayPalPlans;
  } catch {
    return {};
  }
}

export async function writePayPalPlanCache(
  data: CachedPayPalPlans,
): Promise<void> {
  const content = JSON.stringify(data, null, 2);

  if (useBlob()) {
    await put(BLOB_PATH, content, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
  }

  const file = getLocalFile();
  await mkdir(join(file, ".."), { recursive: true });
  await writeFile(file, content, "utf8");
}
