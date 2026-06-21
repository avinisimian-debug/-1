import type { Translations } from "@/lib/i18n/translations";

type ErrorKind =
  | "generic"
  | "network"
  | "timeout"
  | "empty"
  | "video"
  | "size"
  | "limit"
  | "auth";

function classifyTranscriptionError(message: string): ErrorKind {
  const lower = message.toLowerCase();

  if (
    lower.includes("network error") ||
    lower.includes("failed to fetch") ||
    lower.includes("connection")
  ) {
    return "network";
  }

  if (
    lower.includes("timed out") ||
    lower.includes("timeout") ||
    lower.includes("504")
  ) {
    return "timeout";
  }

  if (
    lower.includes("sign in") ||
    lower.includes("unauthorized") ||
    lower.includes("not authenticated")
  ) {
    return "auth";
  }

  if (
    lower.includes("monthly") ||
    lower.includes("limit reached") ||
    lower.includes("transcriptions per month")
  ) {
    return "limit";
  }

  if (
    lower.includes("exceeds") ||
    lower.includes("too large") ||
    lower.includes("too long") ||
    lower.includes("25 mb") ||
    lower.includes("500 mb")
  ) {
    return "size";
  }

  if (
    lower.includes("video") ||
    lower.includes("extract audio") ||
    lower.includes("codec") ||
    lower.includes("ffmpeg") ||
    lower.includes("mp4") ||
    lower.includes("process this recording")
  ) {
    return "video";
  }

  if (lower.includes("empty transcript")) {
    return "empty";
  }

  if (
    lower.includes("transcription failed. please try again") ||
    lower.includes("failed to parse") ||
    lower.includes("unexpected error")
  ) {
    return "generic";
  }

  return "generic";
}

export function resolveTranscriptionErrorMessage(
  message: string,
  t: Translations,
): { text: string; kind: ErrorKind } {
  const kind = classifyTranscriptionError(message);

  const byKind: Record<ErrorKind, string> = {
    generic: t.transcriptionErrorGeneric,
    network: t.transcriptionErrorNetwork,
    timeout: t.transcriptionErrorTimeout,
    empty: t.transcriptionErrorEmpty,
    video: t.transcriptionErrorVideo,
    size: t.transcriptionErrorSize,
    limit: t.transcriptionErrorLimit,
    auth: t.transcriptionErrorAuth,
  };

  return { text: byKind[kind], kind };
}

export function shouldShowProUpsell(kind: ErrorKind, isPro: boolean): boolean {
  if (isPro) return false;
  return kind === "generic" || kind === "video" || kind === "size" || kind === "timeout";
}
