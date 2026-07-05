const PLACEHOLDER_OPENAI_PATTERNS = [
  "sk-your",
  "your-openai",
  "api-key-here",
  "changeme",
];

export function isOpenAiKeyConfigured(): boolean {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return false;
  const lower = key.toLowerCase();
  return !PLACEHOLDER_OPENAI_PATTERNS.some((pattern) => lower.includes(pattern));
}

export function isBlobStorageConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export function isVercelRuntime(): boolean {
  return Boolean(process.env.VERCEL);
}

export type TranscriptionReadinessIssue =
  | "openai_missing"
  | "openai_invalid"
  | "blob_missing";

export function getTranscriptionReadinessIssues(): TranscriptionReadinessIssue[] {
  const issues: TranscriptionReadinessIssue[] = [];
  const key = process.env.OPENAI_API_KEY?.trim();

  if (!key) {
    issues.push("openai_missing");
  } else if (!isOpenAiKeyConfigured()) {
    issues.push("openai_invalid");
  }

  if (isVercelRuntime() && !isBlobStorageConfigured()) {
    issues.push("blob_missing");
  }

  return issues;
}

export function getTranscriptionReadinessMessage(
  issue: TranscriptionReadinessIssue,
): string {
  switch (issue) {
    case "openai_missing":
      return "CONFIG_OPENAI_MISSING: Transcription service is not configured (OPENAI_API_KEY).";
    case "openai_invalid":
      return "CONFIG_OPENAI_INVALID: Transcription service API key is invalid. Update OPENAI_API_KEY in Vercel.";
    case "blob_missing":
      return "CONFIG_BLOB_MISSING: Large file uploads require BLOB_READ_WRITE_TOKEN in Vercel (Storage → Blob → Connect).";
    default:
      return "CONFIG_ERROR: Transcription service is misconfigured.";
  }
}

export function assertTranscriptionReady(requireBlob = false): void {
  const issues = getTranscriptionReadinessIssues();
  const relevant = requireBlob
    ? issues
    : issues.filter((issue) => issue !== "blob_missing");

  if (relevant.length > 0) {
    throw new Error(getTranscriptionReadinessMessage(relevant[0]));
  }
}
