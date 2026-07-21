import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PLAN_LIMITS } from "@/lib/constants";
import { assertBlobPathForUser } from "@/lib/blob-file";
import { syncUserPlanOnAccess } from "@/lib/users-store";
import {
  getTranscriptionReadinessMessage,
  isBlobStorageConfigured,
} from "@/lib/transcription-ready";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Token generation only needs Blob — do NOT gate on OpenAI here.
  // (OpenAI is checked later in /api/transcribe; mixing them caused
  // "Failed to retrieve the client token" for every video upload.)
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!blobToken || !isBlobStorageConfigured()) {
    return NextResponse.json(
      { error: getTranscriptionReadinessMessage("blob_missing") },
      { status: 503 },
    );
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid upload request body." }, { status: 400 });
  }

  const email = session.user.email.toLowerCase();

  // Never block token generation on plan-store failures.
  let maxBytes = PLAN_LIMITS.pro.maxFileSizeBytes;
  try {
    const plan = await syncUserPlanOnAccess(
      email,
      session.user.name ?? undefined,
    );
    maxBytes = PLAN_LIMITS[plan].maxFileSizeBytes;
  } catch (error) {
    console.error("[transcribe-upload] plan sync failed, using Pro limits:", error);
  }

  try {
    const jsonResponse = await handleUpload({
      token: blobToken,
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        assertBlobPathForUser(pathname, email);

        return {
          // Wildcards avoid MIME mismatches (browsers vary for .MP4 / Hebrew names).
          allowedContentTypes: [
            "audio/*",
            "video/*",
            "application/octet-stream",
          ],
          maximumSizeInBytes: maxBytes,
          addRandomSuffix: true,
          // Large videos can take minutes to upload.
          validUntil: Date.now() + 60 * 60 * 1000,
          tokenPayload: JSON.stringify({ email }),
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("[transcribe-upload]", error);
    const message =
      error instanceof Error ? error.message : "Upload failed.";

    // Surface Blob token / config issues clearly to the client.
    if (
      message.toLowerCase().includes("token") ||
      message.toLowerCase().includes("access denied") ||
      message.toLowerCase().includes("blob")
    ) {
      return NextResponse.json(
        {
          error: `CONFIG_BLOB_TOKEN: ${message}. Check BLOB_READ_WRITE_TOKEN in Vercel (Storage → Blob → Connect to project).`,
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
