import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  fetchMediaFileFromUrl,
  isPlatformPageUrl,
  normalizeMediaUrl,
} from "@/features/transcription/server/fetch-media-from-url";
import { transcribeAudio } from "@/features/transcription/server/transcribe.use-case";
import { isDiarizationConfigured } from "@/features/transcription/server/diarize-audio";
import { transcribeRemoteUrlWithAssemblyAI } from "@/features/transcription/server/transcribe-from-url";
import { isWhisperLanguageCode } from "@/lib/whisper-languages";
import { incrementTranscriptionsToday } from "@/lib/stats-store";
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
    throw new UnauthorizedError("Sign in required to transcribe.");
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

  let parsedUrl: URL;
  try {
    parsedUrl = normalizeMediaUrl(rawUrl);
  } catch (error) {
    throw error instanceof BadRequestError
      ? error
      : new BadRequestError("Invalid URL.");
  }

  // Platform page links (YouTube etc.) → AssemblyAI when configured.
  if (isPlatformPageUrl(parsedUrl) && isDiarizationConfigured()) {
    const remote = await transcribeRemoteUrlWithAssemblyAI({
      url: parsedUrl.toString(),
      plan,
      language,
    });
    if (isFailure(remote)) throw remote.error;
    await incrementTranscriptionsToday();
    return remote.data;
  }

  let file: File;
  try {
    file = await fetchMediaFileFromUrl(rawUrl, plan);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Download failed.";
    if (message.startsWith("PLATFORM_URL:")) {
      throw new BadRequestError(
        `${message}${
          isDiarizationConfigured()
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

  await incrementTranscriptionsToday();
  return {
    ...result.data,
    fileName: result.data.fileName || file.name,
  };
});
