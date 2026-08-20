import { createHash, randomInt, timingSafeEqual } from "crypto";
import { put, get } from "@vercel/blob";
import { mkdir, readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { resendConfigured, assertCloudPersistence } from "@/lib/runtime-env";

const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_SENDS_PER_WINDOW = 5;
const SEND_WINDOW_MS = 60 * 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;

export class OtpRateLimitError extends Error {
  constructor() {
    super("יותר מדי ניסיונות. המתינו דקה ושלחו קוד חדש.");
    this.name = "OtpRateLimitError";
  }
}

export class OtpDeliveryError extends Error {
  constructor(message = "שליחת הקוד נכשלה. נסו שוב או התחברו עם Google.") {
    super(message);
    this.name = "OtpDeliveryError";
  }
}

interface OtpRecord {
  hash: string;
  expiresAt: number;
  attempts: number;
  consumed: boolean;
  lastSentAt: number;
  windowStart: number;
  sendsInWindow: number;
}

function otpPath(email: string): string {
  return `meetscribe/otp/${email.toLowerCase()}.json`;
}

function hashOtp(email: string, code: string): string {
  return createHash("sha256")
    .update(`${email.toLowerCase()}:${code}`)
    .digest("hex");
}

function localFile(email: string): string {
  const dir = process.env.VERCEL
    ? join(tmpdir(), "staz-otp")
    : join(process.cwd(), "data", "otp");
  return join(dir, `${email.toLowerCase().replace(/[^a-z0-9.@_-]/g, "_")}.json`);
}

async function writeRecord(email: string, record: OtpRecord): Promise<void> {
  const body = JSON.stringify(record);
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put(otpPath(email), body, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }
  const file = localFile(email);
  await mkdir(join(file, ".."), { recursive: true });
  await writeFile(file, body, "utf8");
}

async function readRecord(email: string): Promise<OtpRecord | null> {
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Bypass CDN — stale OTP hashes make valid codes fail after send.
      const result = await get(otpPath(email), {
        access: "private",
        useCache: false,
      });
      if (!result || result.statusCode !== 200) return null;
      return JSON.parse(await new Response(result.stream).text()) as OtpRecord;
    }
    const file = localFile(email);
    if (!existsSync(file)) return null;
    return JSON.parse(await readFile(file, "utf8")) as OtpRecord;
  } catch {
    return null;
  }
}

export function generateOtpCode(): string {
  return String(randomInt(100000, 1000000));
}

function assertCanSend(existing: OtpRecord | null, now: number): void {
  if (!existing) return;
  if (now - existing.lastSentAt < RESEND_COOLDOWN_MS) {
    throw new OtpRateLimitError();
  }
  const windowStart =
    now - existing.windowStart > SEND_WINDOW_MS ? now : existing.windowStart;
  const sends =
    windowStart === existing.windowStart ? existing.sendsInWindow : 0;
  if (sends >= MAX_SENDS_PER_WINDOW) {
    throw new OtpRateLimitError();
  }
}

/** Issue + persist hashed OTP. Caller must send via Resend; code never goes to clients. */
export async function issueEmailOtp(email: string): Promise<string> {
  assertCloudPersistence();
  const now = Date.now();
  const existing = await readRecord(email);
  assertCanSend(existing, now);

  const windowStart =
    existing && now - existing.windowStart < SEND_WINDOW_MS
      ? existing.windowStart
      : now;
  const sendsInWindow =
    existing && windowStart === existing.windowStart
      ? existing.sendsInWindow + 1
      : 1;

  const code = generateOtpCode();
  await writeRecord(email, {
    hash: hashOtp(email, code),
    expiresAt: now + OTP_TTL_MS,
    attempts: 0,
    consumed: false,
    lastSentAt: now,
    windowStart,
    sendsInWindow,
  });
  return code;
}

export async function verifyEmailOtp(
  email: string,
  code: string,
): Promise<boolean> {
  const record = await readRecord(email);
  if (!record) return false;
  if (record.consumed) return false;
  if (Date.now() > record.expiresAt) return false;
  if (record.attempts >= MAX_VERIFY_ATTEMPTS) return false;

  record.attempts += 1;
  const expected = Buffer.from(record.hash);
  const actual = Buffer.from(hashOtp(email, code.trim()));
  const match =
    expected.length === actual.length && timingSafeEqual(expected, actual);

  if (match) {
    record.consumed = true;
    record.hash = "consumed";
    await writeRecord(email, record);
    return true;
  }

  await writeRecord(email, record);
  return false;
}

export function assertResendReady(): void {
  if (!resendConfigured()) {
    throw new OtpDeliveryError(
      "התחברות באימייל דורשת שליחת קוד. הגדירו Resend או התחברו עם Google.",
    );
  }
}

export function credentialsCannotImpersonate(input: {
  otpValid: boolean;
}): { ok: boolean; reason?: string } {
  if (!input.otpValid) {
    return { ok: false, reason: "otp_required" };
  }
  return { ok: true };
}
