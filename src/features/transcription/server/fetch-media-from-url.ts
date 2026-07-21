import { BadRequestError } from "@/shared/api";
import { PLAN_LIMITS, type PlanTier } from "@/lib/constants";

const MEDIA_EXTENSIONS = new Set([
  ".mp3",
  ".wav",
  ".m4a",
  ".aac",
  ".flac",
  ".ogg",
  ".oga",
  ".opus",
  ".mp4",
  ".m4v",
  ".mov",
  ".webm",
  ".mkv",
  ".avi",
  ".mpeg",
  ".mpg",
]);

const MEDIA_CONTENT_TYPES = [
  "audio/",
  "video/",
  "application/ogg",
  "application/mp4",
];

function isPrivateHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    host === "localhost" ||
    host === "metadata.google.internal" ||
    host.endsWith(".local") ||
    host.endsWith(".internal")
  ) {
    return true;
  }

  // IPv4 private / loopback / link-local
  const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (ipv4) {
    const parts = ipv4.slice(1).map(Number);
    if (parts.some((n) => n > 255)) return true;
    const [a, b] = parts;
    if (a === 10 || a === 127 || a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  }

  // IPv6 loopback / ULA / link-local
  if (host === "::1" || host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80")) {
    return true;
  }

  return false;
}

export function normalizeMediaUrl(raw: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(raw.trim());
  } catch {
    throw new BadRequestError("Invalid URL. Paste a full https:// link.");
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new BadRequestError("Only http(s) media links are supported.");
  }

  if (isPrivateHostname(parsed.hostname)) {
    throw new BadRequestError("That host is not allowed for security reasons.");
  }

  // Dropbox share → direct download
  if (
    parsed.hostname.includes("dropbox.com") &&
    parsed.searchParams.has("dl")
  ) {
    parsed.searchParams.set("dl", "1");
  } else if (parsed.hostname.includes("dropbox.com")) {
    parsed.searchParams.set("dl", "1");
  }

  // Google Drive file/d/ID/view → uc?export=download&id=ID
  const driveMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/);
  if (parsed.hostname.includes("drive.google.com") && driveMatch) {
    return new URL(
      `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`,
    );
  }

  return parsed;
}

export function isLikelyDirectMediaUrl(url: URL): boolean {
  const path = url.pathname.toLowerCase();
  for (const ext of MEDIA_EXTENSIONS) {
    if (path.endsWith(ext)) return true;
  }
  return false;
}

export function isPlatformPageUrl(url: URL): boolean {
  const host = url.hostname.toLowerCase();
  return (
    host.includes("youtube.com") ||
    host.includes("youtu.be") ||
    host.includes("vimeo.com") ||
    host.includes("zoom.us") ||
    host.includes("meet.google.com") ||
    host.includes("docs.google.com") ||
    (host.includes("drive.google.com") && url.pathname.includes("/folders/"))
  );
}

function extensionFromUrlOrType(url: URL, contentType: string | null): string {
  const path = url.pathname.toLowerCase();
  for (const ext of MEDIA_EXTENSIONS) {
    if (path.endsWith(ext)) return ext;
  }
  const ct = (contentType ?? "").toLowerCase();
  if (ct.includes("mpeg") || ct.includes("mp3")) return ".mp3";
  if (ct.includes("wav")) return ".wav";
  if (ct.includes("mp4")) return ".mp4";
  if (ct.includes("webm")) return ".webm";
  if (ct.includes("ogg")) return ".ogg";
  if (ct.includes("m4a") || ct.includes("mp4a")) return ".m4a";
  if (ct.includes("quicktime")) return ".mov";
  return ".mp3";
}

function fileNameFromUrl(url: URL, ext: string): string {
  const base = url.pathname.split("/").filter(Boolean).pop() || "remote-media";
  const cleaned = base.replace(/[^\w.\-() ]+/g, "_").slice(0, 120);
  if (cleaned.toLowerCase().endsWith(ext)) return cleaned;
  return `${cleaned.replace(/\.[^.]+$/, "")}${ext}`;
}

/**
 * Download a publicly reachable media file for Whisper processing.
 */
export async function fetchMediaFileFromUrl(
  rawUrl: string,
  plan: PlanTier,
): Promise<File> {
  const url = normalizeMediaUrl(rawUrl);
  const maxBytes = PLAN_LIMITS[plan].maxFileSizeBytes;

  if (isPlatformPageUrl(url) && !isLikelyDirectMediaUrl(url)) {
    throw new BadRequestError(
      "PLATFORM_URL: YouTube/Zoom/Meet page links need a direct media file URL, or set ASSEMBLYAI_API_KEY for platform URL transcription. Tip: download the recording as MP4/M4A and upload, or paste a direct .mp3/.mp4 link.",
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "StazAI-Transcribe/1.0",
        Accept: "audio/*,video/*,application/octet-stream,*/*",
      },
    });

    if (!response.ok) {
      throw new BadRequestError(
        `Could not download media (HTTP ${response.status}). Make sure the link is public.`,
      );
    }

    const contentType = response.headers.get("content-type");
    const contentLength = Number(response.headers.get("content-length") || "0");
    if (contentLength > maxBytes) {
      throw new BadRequestError(
        `Remote file is too large for your plan (max ${PLAN_LIMITS[plan].maxFileSizeLabel}).`,
      );
    }

    const isMediaType =
      !contentType ||
      MEDIA_CONTENT_TYPES.some((p) => contentType.toLowerCase().startsWith(p)) ||
      contentType.toLowerCase().includes("octet-stream") ||
      isLikelyDirectMediaUrl(url);

    if (!isMediaType) {
      throw new BadRequestError(
        "URL did not return audio/video. Paste a direct media link (.mp3, .mp4, .wav, .m4a, .webm).",
      );
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length === 0) {
      throw new BadRequestError("Downloaded file is empty.");
    }
    if (buffer.length > maxBytes) {
      throw new BadRequestError(
        `Remote file is too large for your plan (max ${PLAN_LIMITS[plan].maxFileSizeLabel}).`,
      );
    }

    const ext = extensionFromUrlOrType(url, contentType);
    const fileName = fileNameFromUrl(url, ext);
    const type =
      contentType && !contentType.includes("text/")
        ? contentType.split(";")[0].trim()
        : ext === ".mp4"
          ? "video/mp4"
          : ext === ".webm"
            ? "video/webm"
            : ext === ".wav"
              ? "audio/wav"
              : "audio/mpeg";

    return new File([new Uint8Array(buffer)], fileName, { type });
  } catch (error) {
    if (error instanceof BadRequestError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new BadRequestError("Download timed out. Try a smaller file or a faster link.");
    }
    throw new BadRequestError(
      error instanceof Error
        ? `Download failed: ${error.message}`
        : "Download failed.",
    );
  } finally {
    clearTimeout(timeout);
  }
}
