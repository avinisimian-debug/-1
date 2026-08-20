import { put, get } from "@vercel/blob";
import { mkdir, readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import type { PlanTier } from "@/lib/constants";
import { PLAN_LIMITS } from "@/lib/constants";
import { assertCloudPersistence } from "@/lib/runtime-env";

function monthKey(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function ownerKey(email: string): string {
  return email.trim().toLowerCase();
}

function blobPath(email: string, month: string): string {
  return `meetscribe/usage/${ownerKey(email)}/${month}.json`;
}

interface UsageRecord {
  month: string;
  count: number;
}

function localFile(email: string, month: string): string {
  const dir = process.env.VERCEL
    ? join(tmpdir(), "staz-usage")
    : join(process.cwd(), "data", "usage");
  return join(dir, `${ownerKey(email).replace(/[^a-z0-9.@_-]/g, "_")}-${month}.json`);
}

async function readUsage(email: string, month: string): Promise<UsageRecord> {
  const fallback: UsageRecord = { month, count: 0 };
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const result = await get(blobPath(email, month), { access: "private" });
      if (!result || result.statusCode !== 200) return fallback;
      return JSON.parse(await new Response(result.stream).text()) as UsageRecord;
    }
    const file = localFile(email, month);
    if (!existsSync(file)) return fallback;
    return JSON.parse(await readFile(file, "utf8")) as UsageRecord;
  } catch {
    return fallback;
  }
}

async function writeUsage(email: string, record: UsageRecord): Promise<void> {
  assertCloudPersistence();
  const body = JSON.stringify(record);
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put(blobPath(email, record.month), body, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }
  const file = localFile(email, record.month);
  await mkdir(join(file, ".."), { recursive: true });
  await writeFile(file, body, "utf8");
}

export async function getServerUsageCount(email: string): Promise<number> {
  const record = await readUsage(email, monthKey());
  return record.month === monthKey() ? record.count : 0;
}

export async function canServerTranscribe(
  email: string,
  plan: PlanTier,
): Promise<boolean> {
  assertCloudPersistence();
  const count = await getServerUsageCount(email);
  return count < PLAN_LIMITS[plan].transcriptionsPerMonth;
}

export async function incrementServerUsage(email: string): Promise<number> {
  const month = monthKey();
  const record = await readUsage(email, month);
  const next = {
    month,
    count: record.month === month ? record.count + 1 : 1,
  };
  await writeUsage(email, next);
  return next.count;
}
