import { NextResponse } from "next/server";
import {
  getPipelineProviderStatus,
  getTranscriptionReadinessIssues,
  isBlobStorageConfigured,
  isOpenAiKeyConfigured,
} from "@/lib/transcription-ready";

export const runtime = "nodejs";

/**
 * Public readiness probe for the upload UI (no secrets returned).
 */
export async function GET(): Promise<NextResponse> {
  const blob = isBlobStorageConfigured();
  const openai = isOpenAiKeyConfigured();
  const providers = getPipelineProviderStatus();
  const issues = getTranscriptionReadinessIssues();

  return NextResponse.json({
    ok: issues.length === 0,
    blob,
    openai,
    assemblyai: providers.assemblyai,
    sttPrimary: providers.sttPrimary,
    largeUploads: blob,
    issues,
    hint: !blob
      ? "Connect Vercel Blob (Storage → Blob → Connect) so BLOB_READ_WRITE_TOKEN is set, then Redeploy. Required for videos and files over ~4 MB."
      : !openai
        ? "Set a valid OPENAI_API_KEY in Vercel → Environment Variables, then Redeploy."
        : !providers.assemblyai
          ? "Ready (Whisper STT). Set ASSEMBLYAI_API_KEY for primary STT, diarization, and YouTube links."
          : "Ready",
  });
}
