import type { Translations } from "@/lib/i18n/translations";

type ErrorKind =
  | "generic"
  | "network"
  | "timeout"
  | "empty"
  | "video"
  | "youtube_invalid"
  | "youtube_unavailable"
  | "youtube_private"
  | "youtube_age"
  | "youtube_live"
  | "youtube_temp"
  | "transcribe_failed"
  | "analysis_failed"
  | "size_free"
  | "size_pro"
  | "limit"
  | "auth"
  | "config_openai"
  | "config_blob";

function classifyTranscriptionError(message: string): ErrorKind {
  const lower = message.toLowerCase();
  const raw = message.trim();

  if (raw.startsWith("YT_INVALID_URL") || lower.includes("לא נראה כמו קישור youtube")) {
    return "youtube_invalid";
  }
  if (raw.startsWith("YT_PRIVATE") || lower.includes("סרטון פרטי")) {
    return "youtube_private";
  }
  if (
    raw.startsWith("YT_AGE_RESTRICTED") ||
    lower.includes("מוגבל לגיל")
  ) {
    return "youtube_age";
  }
  if (raw.startsWith("YT_LIVE") || lower.includes("שידורים חיים")) {
    return "youtube_live";
  }
  if (
    raw.startsWith("YT_UNAVAILABLE") ||
    raw.startsWith("YT_NO_AUDIO") ||
    raw.startsWith("YT_TOO_LONG") ||
    raw.startsWith("YT_EXTRACTOR_MISSING") ||
    lower.includes("לא זמין לעיבוד")
  ) {
    return "youtube_unavailable";
  }
  if (
    raw.startsWith("YT_TEMP_FAILURE") ||
    lower.includes("לא הצלחנו לעבד את הסרטון כרגע")
  ) {
    return "youtube_temp";
  }
  if (
    raw.startsWith("TRANSCRIBE_FAILED") ||
    lower.includes("בעיה ביצירת התמלול")
  ) {
    return "transcribe_failed";
  }
  if (
    raw.startsWith("ANALYSIS_FAILED") ||
    lower.includes("עיבוד התובנות נכשל")
  ) {
    return "analysis_failed";
  }

  if (
    lower.includes("config_openai_missing") ||
    lower.includes("config_openai_invalid") ||
    lower.includes("incorrect api key") ||
    lower.includes("openai_api_key")
  ) {
    return "config_openai";
  }

  if (
    lower.includes("config_blob_missing") ||
    lower.includes("config_blob_token") ||
    lower.includes("failed to retrieve the client token") ||
    lower.includes("large file uploads are not configured") ||
    lower.includes("blob_read_write_token")
  ) {
    return "config_blob";
  }

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
    lower.includes("transcriptions per month") ||
    lower.includes("quota:")
  ) {
    return "limit";
  }

  if (
    lower.includes("upload_payload_too_large") ||
    lower.includes("function_payload_too_large")
  ) {
    return "video";
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

  // AssemblyAI often returns "Transcoding failed... mp4" for YouTube page URLs.
  // Map to a clear YouTube/unavailable message instead of "upgrade to Pro".
  if (
    lower.includes("transcoding failed") ||
    lower.includes("youtube") ||
    lower.includes("youtu.be") ||
    lower.includes("yt-dlp") ||
    lower.includes("piped") ||
    (lower.includes("try a direct") && lower.includes("mp3"))
  ) {
    return "youtube_unavailable";
  }

  if (
    lower.includes("extract audio") ||
    lower.includes("codec") ||
    lower.includes("ffmpeg") ||
    lower.includes("process this recording") ||
    lower.includes("could not process")
  ) {
    // ffmpeg mention on YouTube ingest paths should not become a video/Pro hint
    if (lower.includes("youtube") || lower.includes("yt_")) {
      return "youtube_temp";
    }
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

function stripErrorCodePrefix(message: string): string {
  return message.replace(
    /^(YT_[A-Z_]+|TRANSCRIBE_FAILED|ANALYSIS_FAILED|PLATFORM_URL|QUOTA|CONFIG_ERROR):\s*/i,
    "",
  ).trim();
}

export function resolveTranscriptionErrorMessage(
  message: string,
  t: Translations,
  isPro = false,
  sourceHint?: string,
): { text: string; kind: ErrorKind; title?: string; subtitle?: string } {
  const hint = (sourceHint || "").toLowerCase();
  const looksLikeYoutube =
    hint.includes("youtube.com") ||
    hint.includes("youtu.be") ||
    hint.startsWith("youtube-");

  let kind = classifyTranscriptionError(message);
  // Never show the old "video / upgrade to Pro" path for YouTube sources.
  if (
    looksLikeYoutube &&
    (kind === "video" || kind === "generic" || kind === "timeout")
  ) {
    kind = message.trim().startsWith("YT_TEMP") ? "youtube_temp" : "youtube_unavailable";
  }

  const stripped = stripErrorCodePrefix(message);

  const byKind: Record<ErrorKind, string> = {
    generic: t.transcriptionErrorGeneric,
    network: t.transcriptionErrorNetwork,
    timeout: t.transcriptionErrorTimeout,
    empty: t.transcriptionErrorEmpty,
    video: t.transcriptionErrorVideo,
    youtube_invalid: t.transcriptionErrorYoutubeInvalid,
    youtube_unavailable: t.transcriptionErrorYoutubeUnavailable,
    youtube_private: t.transcriptionErrorYoutubePrivate,
    youtube_age: t.transcriptionErrorYoutubeAge,
    youtube_live: t.transcriptionErrorYoutubeLive,
    youtube_temp: t.transcriptionErrorYoutubeTemp,
    transcribe_failed: t.transcriptionErrorTranscribeFailed,
    analysis_failed: t.transcriptionErrorAnalysisFailed,
    size_free: t.transcriptionErrorSizeFree,
    size_pro: t.transcriptionErrorSizePro,
    limit: t.transcriptionErrorLimit,
    auth: t.transcriptionErrorAuth,
    config_openai: t.transcriptionErrorConfigOpenai,
    config_blob: t.transcriptionErrorConfigBlob,
  };

  if (kind === "size_free" && isPro) {
    return { text: t.transcriptionErrorSizePro, kind: "size_pro" };
  }

  // Prefer our classified Hebrew copy; fall back to stripped server message when informative.
  const text =
    byKind[kind] ||
    (stripped.length > 12 && !stripped.toLowerCase().includes("transcoding")
      ? stripped
      : byKind.generic);

  return { text, kind };
}

export function shouldShowProUpsell(kind: ErrorKind, isPro: boolean): boolean {
  if (isPro) return false;
  if (kind === "config_openai" || kind === "config_blob") return false;
  if (kind.startsWith("youtube_")) return false;
  if (kind === "transcribe_failed" || kind === "analysis_failed") return false;
  // ffmpeg / codec issues are not solved by upgrading alone
  if (kind === "video") return false;
  return (
    kind === "generic" ||
    kind === "size_free" ||
    kind === "timeout" ||
    kind === "limit"
  );
}
