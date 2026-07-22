import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "@/features/transcription/server/transcribe.use-case";
import { VERCEL_DIRECT_UPLOAD_BYTES } from "@/lib/constants";
import {
  assertTranscriptionReady,
  getTranscriptionReadinessMessage,
} from "@/lib/transcription-ready";
import { isFailure } from "@/shared/lib/result";

export const runtime = "nodejs";
export const maxDuration = 120;

/** Stay under Vercel ~4.5 MB request body limit for sync multipart. */
const GUEST_MAX_BYTES = VERCEL_DIRECT_UPLOAD_BYTES;
const GUEST_DAILY_LIMIT = 3;

type RateEntry = { day: string; count: number };
const guestRateLimit = new Map<string, RateEntry>();

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function consumeGuestQuota(ip: string): { ok: boolean; remaining: number } {
  const day = todayKey();
  const current = guestRateLimit.get(ip);
  if (!current || current.day !== day) {
    guestRateLimit.set(ip, { day, count: 1 });
    return { ok: true, remaining: GUEST_DAILY_LIMIT - 1 };
  }
  if (current.count >= GUEST_DAILY_LIMIT) {
    return { ok: false, remaining: 0 };
  }
  current.count += 1;
  guestRateLimit.set(ip, current);
  return { ok: true, remaining: GUEST_DAILY_LIMIT - current.count };
}

/**
 * Frictionless "try without account" transcription for short clips.
 * Hard-capped under Vercel body limits + IP daily quota. Does not persist history.
 */
export async function POST(request: NextRequest) {
  try {
    assertTranscriptionReady(false);
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "CONFIG_ERROR",
          message:
            error instanceof Error
              ? error.message
              : getTranscriptionReadinessMessage("openai_missing"),
        },
      },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      {
        data: null,
        error: { code: "BAD_REQUEST", message: "Invalid multipart body." },
      },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  const languageRaw = formData.get("language");
  const language =
    typeof languageRaw === "string" && languageRaw !== "auto"
      ? languageRaw
      : null;

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      {
        data: null,
        error: { code: "BAD_REQUEST", message: "No audio/video file provided." },
      },
      { status: 400 },
    );
  }

  if (file.size <= 0 || file.size > GUEST_MAX_BYTES) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "PAYLOAD_TOO_LARGE",
          message: `Guest trial max file size is ${Math.round(GUEST_MAX_BYTES / (1024 * 1024))} MB. Sign in for larger uploads.`,
        },
      },
      { status: 413 },
    );
  }

  const ip = clientIp(request);
  const quota = consumeGuestQuota(ip);
  if (!quota.ok) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "RATE_LIMITED",
          message:
            "Guest trial limit reached for today. Sign in for unlimited uploads.",
        },
      },
      { status: 429 },
    );
  }

  const result = await transcribeAudio({
    file,
    plan: "free",
    language,
  });

  if (isFailure(result)) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "TRANSCRIBE_FAILED",
          message: result.error.message,
        },
      },
      { status: 400 },
    );
  }

  const data = result.data;
  const transcriptText = data.transcript
    .map((entry) => entry.text)
    .join(" ")
    .slice(0, 8_000);
  const executiveSummary =
    data.summary.overview?.trim() ||
    data.summary.executive.slice(0, 3).join(" ") ||
    null;

  return NextResponse.json({
    data: {
      fileName: data.fileName,
      duration: data.duration,
      transcriptText,
      transcript: data.transcript.slice(0, 40),
      executiveSummary,
      actionItems: data.actionItems.slice(0, 5),
      guest: true,
      remainingTrials: quota.remaining,
    },
    error: null,
  });
}
