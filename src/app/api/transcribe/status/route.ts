import { NextResponse } from "next/server";
import {
  getTranscriptionReadinessIssues,
  isBlobStorageConfigured,
  isOpenAiKeyConfigured,
} from "@/lib/transcription-ready";

export const runtime = "nodejs";

/**
 * Public readiness probe for the upload UI (no secrets returned).
 * Used to avoid the opaque "Failed to retrieve the client token" path.
 */
export async function GET(): Promise<NextResponse> {
  const blob = isBlobStorageConfigured();
  const openai = isOpenAiKeyConfigured();
  const issues = getTranscriptionReadinessIssues();

  return NextResponse.json({
    ok: issues.length === 0,
    blob,
    openai,
    largeUploads: blob,
    issues,
    hint: !blob
      ? "Connect Vercel Blob (Storage → Blob → Connect) so BLOB_READ_WRITE_TOKEN is set, then Redeploy. Required for videos and files over ~4 MB."
      : !openai
        ? "Set a valid OPENAI_API_KEY in Vercel → Environment Variables, then Redeploy."
        : "Ready",
  });
}
