import type { Translations } from "@/lib/i18n/translations";

type ErrorKind =
  | "generic"
  | "network"
  | "timeout"
  | "empty"
  | "video"
  | "size_free"
  | "size_pro"
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
    lower.includes("free tier limit") ||
    lower.includes("require a pro plan") ||
    lower.includes("upgrade to pro for files")
  ) {
    return "size_free";
  }

  if (
    lower.includes("exceeds the 500 mb") ||
    lower.includes("plan_limit_pro")
  ) {
    return "size_pro";
  }

  if (
    lower.includes("too long even after compression") ||
    lower.includes("split the file")
  ) {
    return "size_pro";
  }

  if (
    lower.includes("video") ||
    lower.includes("extract audio") ||
    lower.includes("codec") ||
    lower.includes("ffmpeg") ||
    lower.includes("mp4") ||
    lower.includes("process this recording") ||
    lower.includes("could not process")
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

  if (
    lower.includes("exceeds") ||
    lower.includes("too large") ||
    lower.includes("too long") ||
    lower.includes("25 mb")
  ) {
    return "size_free";
  }

  return "generic";
}

export function resolveTranscriptionErrorMessage(
  message: string,
  t: Translations,
  isPro = false,
): { text: string; kind: ErrorKind } {
  const kind = classifyTranscriptionError(message);

  const byKind: Record<ErrorKind, string> = {
    generic: t.transcriptionErrorGeneric,
    network: t.transcriptionErrorNetwork,
    timeout: t.transcriptionErrorTimeout,
    empty: t.transcriptionErrorEmpty,
    video: t.transcriptionErrorVideo,
    size_free: t.transcriptionErrorSizeFree,
    size_pro: t.transcriptionErrorSizePro,
    limit: t.transcriptionErrorLimit,
    auth: t.transcriptionErrorAuth,
  };

  if (kind === "size_free" && isPro) {
    return { text: t.transcriptionErrorSizePro, kind: "size_pro" };
  }

  if (kind === "size_pro" || kind === "size_free") {
    return {
      text: kind === "size_pro" ? t.transcriptionErrorSizePro : byKind[kind],
      kind,
    };
  }

  return { text: byKind[kind], kind };
}

export function shouldShowProUpsell(kind: ErrorKind, isPro: boolean): boolean {
  if (isPro) return false;
  return (
    kind === "generic" ||
    kind === "video" ||
    kind === "size_free" ||
    kind === "timeout"
  );
}
