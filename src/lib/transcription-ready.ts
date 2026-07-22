/**
 * Central provider readiness for the media → STT → insights pipeline.
 * Keys: BLOB_READ_WRITE_TOKEN, ASSEMBLYAI_API_KEY, OPENAI_API_KEY
 */

/** Exact / template values that must never be treated as real keys. */
const PLACEHOLDER_OPENAI_EXACT = new Set([
  "sk-your-openai-api-key-here",
  "your-openai-api-key-here",
  "changeme",
  "sk-xxx",
  "sk-test",
]);

const PLACEHOLDER_OPENAI_SUBSTRINGS = [
  "your-openai",
  "api-key-here",
  "sk-your-",
  "changeme",
  "replace-me",
];

/** Strip whitespace and accidental wrapping quotes from env values. */
export function normalizeSecret(raw: string | undefined | null): string {
  return (raw ?? "")
    .trim()
    .replace(/^["']+|["']+$/g, "")
    .trim();
}

export type OpenAiKeyDiagnostics = {
  present: boolean;
  length: number;
  /** Safe prefix only, e.g. "sk-proj" — never the full key. */
  prefix: string;
  looksLikePlaceholder: boolean;
  passesFormat: boolean;
  configured: boolean;
};

/**
 * Safe, non-secret diagnostics for readiness probes / logs.
 */
export function getOpenAiKeyDiagnostics(
  raw: string | undefined | null = process.env.OPENAI_API_KEY,
): OpenAiKeyDiagnostics {
  const key = normalizeSecret(raw);
  const present = key.length > 0;
  const lower = key.toLowerCase();

  const looksLikePlaceholder =
    present &&
    (PLACEHOLDER_OPENAI_EXACT.has(lower) ||
      PLACEHOLDER_OPENAI_SUBSTRINGS.some((pattern) => lower.includes(pattern)));

  // OpenAI keys: sk-… / sk-proj-… / sk-svcacct-… (alphanumeric + _ -)
  const passesFormat = /^sk-[A-Za-z0-9_-]{16,}$/.test(key);

  const prefix = present
    ? key.slice(0, Math.min(8, key.length)).replace(/[^A-Za-z0-9_-]/g, "")
    : "";

  return {
    present,
    length: key.length,
    prefix,
    looksLikePlaceholder,
    passesFormat,
    configured: present && !looksLikePlaceholder && passesFormat,
  };
}

export function isOpenAiKeyConfigured(): boolean {
  return getOpenAiKeyDiagnostics().configured;
}

export function isBlobStorageConfigured(): boolean {
  return Boolean(normalizeSecret(process.env.BLOB_READ_WRITE_TOKEN));
}

/** AssemblyAI powers primary STT (when set), diarization, and YouTube/platform URLs. */
export function isAssemblyAIConfigured(): boolean {
  return Boolean(normalizeSecret(process.env.ASSEMBLYAI_API_KEY));
}

/** @deprecated Use isAssemblyAIConfigured */
export function isDiarizationConfigured(): boolean {
  return isAssemblyAIConfigured();
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
  const diag = getOpenAiKeyDiagnostics();

  if (!diag.present) {
    issues.push("openai_missing");
  } else if (!diag.configured) {
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
    const issue = relevant[0];
    const diag = getOpenAiKeyDiagnostics();
    console.error("[transcription-ready]", issue, {
      present: diag.present,
      length: diag.length,
      prefix: diag.prefix,
      looksLikePlaceholder: diag.looksLikePlaceholder,
      passesFormat: diag.passesFormat,
      vercel: isVercelRuntime(),
      blob: isBlobStorageConfigured(),
      assemblyai: isAssemblyAIConfigured(),
    });
    throw new Error(getTranscriptionReadinessMessage(issue));
  }
}

export function getPipelineProviderStatus() {
  return {
    openai: isOpenAiKeyConfigured(),
    blob: isBlobStorageConfigured(),
    assemblyai: isAssemblyAIConfigured(),
    /** Prefer AssemblyAI for STT when key is present; Whisper is fallback. */
    sttPrimary: isAssemblyAIConfigured()
      ? ("assemblyai" as const)
      : ("whisper" as const),
  };
}
