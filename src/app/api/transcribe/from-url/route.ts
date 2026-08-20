import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  fetchMediaFileFromUrl,
  isPlatformPageUrl,
  normalizeMediaUrl,
} from "@/features/transcription/server/fetch-media-from-url";
import { transcribeAudio } from "@/features/transcription/server/transcribe.use-case";
import { isAssemblyAIConfigured } from "@/features/transcription/server/diarize-audio";
import { transcribeRemoteUrlWithAssemblyAI } from "@/features/transcription/server/transcribe-from-url";
import { isWhisperLanguageCode } from "@/lib/whisper-languages";
import { incrementTranscriptionsToday } from "@/lib/stats-store";
import { incrementServerUsage, canServerTranscribe } from "@/lib/usage-server";
import { saveMeetingForUser } from "@/features/library/server/meetings-store";
import { CloudStorageUnavailableError } from "@/lib/runtime-env";
import { assertTranscriptionReady } from "@/lib/transcription-ready";
import { syncUserPlanOnAccess } from "@/lib/users-store";
import {
  BadRequestError,
  UnauthorizedError,
  withApiHandler,
} from "@/shared/api";
import { isFailure } from "@/shared/lib/result";

export const runtime = "nodejs";
export const maxDuration = 300;

interface FromUrlBody {
  url?: string;
  language?: string | null;
}

export const POST = withApiHandler(async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user?.email) {
    throw new UnauthorizedError("נדרשת התחברות כדי לתמלל.");
  }

  try {
    assertTranscriptionReady(false);
  } catch (error) {
    throw new BadRequestError(
      error instanceof Error
        ? error.message
        : "CONFIG_ERROR: Transcription misconfigured.",
    );
  }

  let body: FromUrlBody;
  try {
    body = (await request.json()) as FromUrlBody;
  } catch {
    throw new BadRequestError("Invalid JSON body. Expected { url, language? }.");
  }

  const rawUrl = body.url?.trim();
  if (!rawUrl) {
    throw new BadRequestError("Missing media URL.");
  }

  if (body.language && body.language !== "auto" && !isWhisperLanguageCode(body.language)) {
    throw new BadRequestError("Unsupported language code.");
  }

  const language =
    body.language && body.language !== "auto" ? body.language : null;

  const email = session.user.email.toLowerCase();
  let plan: "free" | "pro" = "free";
  try {
    plan = await syncUserPlanOnAccess(email, session.user.name ?? undefined);
  } catch (error) {
    console.error("[transcribe-from-url] plan sync failed:", error);
  }

  try {
    const allowed = await canServerTranscribe(email, plan);
    if (!allowed) {
      throw new BadRequestError(
        "QUOTA: נשמרו מספיק פגישות החודש בתוכנית החינמית. שמרו את ספריית הפגישות עם Staz Pro.",
      );
    }
  } catch (error) {
    if (error instanceof CloudStorageUnavailableError) {
      throw new BadRequestError(error.message);
    }
    throw error;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = normalizeMediaUrl(rawUrl);
  } catch (error) {
    throw error instanceof BadRequestError
      ? error
      : new BadRequestError("Invalid URL.");
  }

  // Prefer AssemblyAI for any remote URL (YouTube/platforms + direct media).
  // AssemblyAI fetches audio remotely — no full download on our serverless.
  if (isAssemblyAIConfigured()) {
    const remote = await transcribeRemoteUrlWithAssemblyAI({
      url: parsedUrl.toString(),
      plan,
      language,
    });
    if (!isFailure(remote)) {
      try {
        await saveMeetingForUser({
          ownerEmail: email,
          result: remote.data,
          plan,
          persistStatus: "media_missing",
        });
      } catch (error) {
        if (error instanceof CloudStorageUnavailableError) {
          throw new BadRequestError(error.message);
        }
        throw new BadRequestError("העיבוד הצליח אך הספרייה בענן לא נשמרה.");
      }
      await incrementTranscriptionsToday();
      await incrementServerUsage(email);
      return remote.data;
    }

    // Platform pages cannot fall back to app-server download.
    if (isPlatformPageUrl(parsedUrl)) {
      throw remote.error;
    }

    console.warn(
      "[transcribe-from-url] AssemblyAI failed; falling back to download + STT:",
      remote.error.message,
    );
  } else if (isPlatformPageUrl(parsedUrl)) {
    throw new BadRequestError(
      "PLATFORM_URL: Set ASSEMBLYAI_API_KEY in Vercel to transcribe YouTube/Zoom page links, or paste a direct .mp3/.mp4 URL.",
    );
  }

  let file: File;
  try {
    file = await fetchMediaFileFromUrl(rawUrl, plan);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Download failed.";
    if (message.startsWith("PLATFORM_URL:")) {
      throw new BadRequestError(
        `${message}${
          isAssemblyAIConfigured()
            ? ""
            : " Or set ASSEMBLYAI_API_KEY in Vercel for YouTube/platform links."
        }`,
      );
    }
    throw error instanceof BadRequestError
      ? error
      : new BadRequestError(message);
  }

  const result = await transcribeAudio({
    file,
    plan,
    language,
  });

  if (isFailure(result)) {
    throw result.error;
  }

  const payload = {
    ...result.data,
    fileName: result.data.fileName || file.name,
  };

  try {
    await saveMeetingForUser({
      ownerEmail: email,
      result: payload,
      plan,
      persistStatus: "media_missing",
    });
  } catch (error) {
    if (error instanceof CloudStorageUnavailableError) {
      throw new BadRequestError(error.message);
    }
    throw new BadRequestError("העיבוד הצליח אך הספרייה בענן לא נשמרה.");
  }

  await incrementTranscriptionsToday();
  await incrementServerUsage(email);
  return payload;
});
