/**
 * YouTube URL validation / normalization (SSRF-safe).
 * Only youtube.com / youtu.be / youtube-nocookie.com hosts are accepted.
 */

export type YouTubeUrlKind = "watch" | "shorts" | "youtu_be" | "embed" | "live";

export type ParsedYouTubeUrl = {
  videoId: string;
  canonicalUrl: string;
  kind: YouTubeUrlKind;
  originalUrl: string;
};

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
  "www.youtu.be",
]);

const VIDEO_ID_RE = /^[\w-]{11}$/;

export function isYouTubeHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  return YOUTUBE_HOSTS.has(host) || host.endsWith(".youtube.com");
}

export function extractYouTubeVideoId(rawUrl: string): string | null {
  try {
    return parseYouTubeUrl(rawUrl).videoId;
  } catch {
    return null;
  }
}

export function isYouTubeUrl(rawUrl: string): boolean {
  try {
    const u = new URL(rawUrl.trim());
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    return isYouTubeHostname(u.hostname);
  } catch {
    return false;
  }
}

/**
 * Parse + normalize a YouTube watch/shorts/youtu.be/embed URL.
 * Throws Error with message starting with YT_INVALID_URL: on failure.
 */
export function parseYouTubeUrl(rawUrl: string): ParsedYouTubeUrl {
  const trimmed = rawUrl.trim();
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error("YT_INVALID_URL: הקישור שהוזן לא נראה כמו קישור YouTube תקין.");
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("YT_INVALID_URL: הקישור שהוזן לא נראה כמו קישור YouTube תקין.");
  }

  const host = parsed.hostname.toLowerCase().replace(/\.$/, "");
  if (!isYouTubeHostname(host)) {
    throw new Error("YT_INVALID_URL: הקישור שהוזן לא נראה כמו קישור YouTube תקין.");
  }

  let videoId: string | null = null;
  let kind: YouTubeUrlKind = "watch";

  if (host === "youtu.be" || host === "www.youtu.be") {
    videoId = parsed.pathname.split("/").filter(Boolean)[0] ?? null;
    kind = "youtu_be";
  } else {
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parsed.searchParams.get("v")) {
      videoId = parsed.searchParams.get("v");
      kind = "watch";
    } else if (parts[0] === "shorts" && parts[1]) {
      videoId = parts[1];
      kind = "shorts";
    } else if (parts[0] === "embed" && parts[1]) {
      videoId = parts[1];
      kind = "embed";
    } else if (parts[0] === "live" && parts[1]) {
      videoId = parts[1];
      kind = "live";
    } else if (parts[0] === "watch" && parsed.searchParams.get("v")) {
      videoId = parsed.searchParams.get("v");
      kind = "watch";
    }
  }

  if (!videoId || !VIDEO_ID_RE.test(videoId)) {
    throw new Error("YT_INVALID_URL: הקישור שהוזן לא נראה כמו קישור YouTube תקין.");
  }

  return {
    videoId,
    kind,
    originalUrl: trimmed,
    canonicalUrl: `https://www.youtube.com/watch?v=${videoId}`,
  };
}
