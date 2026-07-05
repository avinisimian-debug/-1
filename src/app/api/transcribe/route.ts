import { del } from "@vercel/blob";
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { transcribeAudio } from "@/features/transcription/server/transcribe.use-case";
import {
  resolveUserId,
  triggerWebhook,
} from "@/features/webhooks/server/trigger-webhook";
import {
  assertBlobPathForUser,
  fileFromBlobUrl,
} from "@/lib/blob-file";
import { incrementTranscriptionsToday } from "@/lib/stats-store";
import {
  assertTranscriptionReady,
} from "@/lib/transcription-ready";
import { waitUntil } from "@/lib/wait-until";
import { syncUserPlanOnAccess } from "@/lib/users-store";
import { BadRequestError, UnauthorizedError, withApiHandler } from "@/shared/api";
import { isFailure } from "@/shared/lib/result";

export const runtime = "nodejs";
export const maxDuration = 300;

interface TranscribeBlobPayload {
  blobUrl: string;
  pathname: string;
  fileName: string;
  contentType: string;
  language?: string | null;
}

async function resolveUploadFile(
  request: NextRequest,
  email: string,
): Promise<{ file: File; language: string | null; blobUrl?: string }> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as TranscribeBlobPayload;
    if (!body.blobUrl || !body.fileName || !body.pathname) {
      throw new BadRequestError("Missing uploaded file reference.");
    }

    assertBlobPathForUser(body.pathname, email);
    const file = await fileFromBlobUrl(
      body.blobUrl,
      body.fileName,
      body.contentType ?? "application/octet-stream",
    );

    return {
      file,
      language: body.language ?? null,
      blobUrl: body.blobUrl,
    };
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const language = formData.get("language") as string | null;

  if (!file || !(file instanceof File)) {
    throw new BadRequestError("No audio file provided.");
  }

  return { file, language };
}

function ensureTranscriptionReady(requireBlob: boolean): void {
  try {
    assertTranscriptionReady(requireBlob);
  } catch (error) {
    throw new BadRequestError(
      error instanceof Error ? error.message : "CONFIG_ERROR: Transcription misconfigured.",
    );
  }
}

export const POST = withApiHandler(async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user?.email) {
    throw new UnauthorizedError("Sign in required to transcribe.");
  }

  const contentType = request.headers.get("content-type") ?? "";
  ensureTranscriptionReady(contentType.includes("application/json"));

  const email = session.user.email.toLowerCase();
  const plan = await syncUserPlanOnAccess(
    email,
    session.user.name ?? undefined,
  );
  const { file, language, blobUrl } = await resolveUploadFile(request, email);

  const result = await transcribeAudio({ file, plan, language });
  if (isFailure(result)) {
    throw result.error;
  }

  await incrementTranscriptionsToday();

  const userId = resolveUserId(email);
  waitUntil(
    triggerWebhook(userId, {
      userEmail: email,
      plan,
      result: result.data,
    }),
  );

  if (blobUrl && process.env.BLOB_READ_WRITE_TOKEN) {
    waitUntil(del(blobUrl).catch(() => {}));
  }

  return result.data;
});
