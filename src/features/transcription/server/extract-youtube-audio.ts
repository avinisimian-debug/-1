/**
 * Extract playable audio from a public YouTube video.
 * AssemblyAI cannot ingest YouTube page URLs — we must resolve a media source first.
 *
 * Strategy order:
 * 1) yt-dlp with rotating player clients (android / tv / web_embedded)
 * 2) Piped API instances (no binary; works better from some datacenter IPs)
 */

import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import ffmpegPath from "ffmpeg-static";
import { BadRequestError } from "@/shared/api";
import { parseYouTubeUrl, type ParsedYouTubeUrl } from "./youtube-url";

export type YoutubeErrorCode =
  | "YT_INVALID_URL"
  | "YT_PRIVATE"
  | "YT_UNAVAILABLE"
  | "YT_AGE_RESTRICTED"
  | "YT_LIVE"
  | "YT_NO_AUDIO"
  | "YT_TOO_LONG"
  | "YT_TEMP_FAILURE"
  | "YT_EXTRACTOR_MISSING";

export type YoutubeAudioSource = {
  videoId: string;
  title: string;
  durationSeconds: number;
  canonicalUrl: string;
  /** Prefer this for AssemblyAI when reachable from their network */
  streamUrl?: string;
  /** Local audio bytes when stream URL is unavailable / rejected */
  file?: {
    buffer: Buffer;
    fileName: string;
    contentType: string;
  };
};

type YtDlpInfo = {
  id?: string;
  title?: string;
  duration?: number;
  availability?: string;
  live_status?: string;
  was_live?: boolean;
  age_limit?: number;
  is_live?: boolean;
};

const require = createRequire(import.meta.url);

const PLAYER_CLIENTS = [
  "android",
  "tv",
  "web_embedded",
  "ios",
] as const;

const PIPED_API_BASES = [
  "https://pipedapi.kavin.rocks",
  "https://pipedapi.adminforge.de",
  "https://pipedapi.darkness.services",
  "https://api.piped.private.coffee",
];

/** Refresh cached yt-dlp if older than this (YouTube breaks extractors often). */
const YT_DLP_MAX_AGE_MS = 24 * 60 * 60 * 1000;

let cachedBinaryPath: string | null = null;

function candidateBinaryPaths(): string[] {
  const paths: string[] = [];
  try {
    const constants = require("youtube-dl-exec/src/constants") as {
      YOUTUBE_DL_PATH: string;
    };
    if (constants.YOUTUBE_DL_PATH) paths.push(constants.YOUTUBE_DL_PATH);
  } catch {
    // ignore
  }
  paths.push(
    join(process.cwd(), "node_modules", "youtube-dl-exec", "bin", "yt-dlp"),
    join(process.cwd(), "node_modules", "youtube-dl-exec", "bin", "yt-dlp.exe"),
    join(tmpdir(), "staz-yt-dlp"),
    join(tmpdir(), "staz-yt-dlp.exe"),
  );
  return paths;
}

export function isYouTubeExtractorPresentSync(): boolean {
  return candidateBinaryPaths().some((p) => existsSync(p));
}

function isBinaryFresh(path: string): boolean {
  try {
    const age = Date.now() - statSync(path).mtimeMs;
    return age < YT_DLP_MAX_AGE_MS;
  } catch {
    return false;
  }
}

async function downloadYtDlpBinary(): Promise<string> {
  const isWin = process.platform === "win32";
  const target = join(tmpdir(), isWin ? "staz-yt-dlp.exe" : "staz-yt-dlp");

  const url = isWin
    ? "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe"
    : "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux";

  console.log("[youtube] downloading yt-dlp binary for serverless runtime");
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": "StazAI/1.0" },
  });
  if (!res.ok) {
    throw new BadRequestError(
      "YT_EXTRACTOR_MISSING: ייבוא YouTube לא מוגדר בשרת. העלו קובץ MP3/MP4 או נסו שוב מאוחר יותר.",
    );
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1_000_000) {
    throw new BadRequestError(
      "YT_EXTRACTOR_MISSING: ייבוא YouTube לא מוגדר בשרת. העלו קובץ MP3/MP4 או נסו שוב מאוחר יותר.",
    );
  }
  writeFileSync(target, buf);
  if (!isWin) {
    try {
      chmodSync(target, 0o755);
    } catch {
      // ignore
    }
  }
  return target;
}

async function resolveYtDlpBinary(): Promise<string> {
  if (cachedBinaryPath && existsSync(cachedBinaryPath) && isBinaryFresh(cachedBinaryPath)) {
    return cachedBinaryPath;
  }

  // Prefer a fresh download into /tmp on serverless (install scripts often skip binary).
  const tmpTarget = join(
    tmpdir(),
    process.platform === "win32" ? "staz-yt-dlp.exe" : "staz-yt-dlp",
  );
  if (existsSync(tmpTarget) && isBinaryFresh(tmpTarget)) {
    cachedBinaryPath = tmpTarget;
    return tmpTarget;
  }

  try {
    cachedBinaryPath = await downloadYtDlpBinary();
    return cachedBinaryPath;
  } catch (downloadError) {
    for (const candidate of candidateBinaryPaths()) {
      if (existsSync(candidate)) {
        console.warn(
          "[youtube] using bundled yt-dlp after download failed:",
          downloadError instanceof Error ? downloadError.message : downloadError,
        );
        cachedBinaryPath = candidate;
        return candidate;
      }
    }
    throw downloadError;
  }
}

function runBinary(
  bin: string,
  args: string[],
  timeoutMs = 90_000,
): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, {
      windowsHide: true,
      shell: false,
      env: { ...process.env, PYTHONUTF8: "1" },
    });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("YT_TEMP_FAILURE: yt-dlp timed out"));
    }, timeoutMs);

    child.stdout.on("data", (d) => {
      stdout += String(d);
    });
    child.stderr.on("data", (d) => {
      stderr += String(d);
    });
    child.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? 1, stdout, stderr });
    });
  });
}

function classifyYtDlpFailure(stderr: string): BadRequestError {
  const lower = (stderr || "").toLowerCase();
  if (
    lower.includes("private video") ||
    lower.includes("this video is private")
  ) {
    return new BadRequestError(
      "YT_PRIVATE: הסרטון פרטי ולא זמין לעיבוד. נסו קישור ציבורי אחר.",
    );
  }
  if (
    lower.includes("age-restricted") ||
    lower.includes("sign in to confirm your age") ||
    lower.includes("confirm your age")
  ) {
    return new BadRequestError(
      "YT_AGE_RESTRICTED: הסרטון מוגבל לגיל ולא ניתן לעיבוד אוטומטי. הורידו את האודיו והעלו קובץ.",
    );
  }
  if (
    lower.includes("sign in to confirm") ||
    lower.includes("not a bot") ||
    lower.includes("confirm you're not a bot")
  ) {
    return new BadRequestError(
      "YT_TEMP_FAILURE: לא הצלחנו לעבד את הסרטון כרגע. נסו שוב בעוד רגע.",
    );
  }
  if (
    lower.includes("video unavailable") ||
    lower.includes("has been removed") ||
    lower.includes("not available") ||
    lower.includes("does not exist")
  ) {
    return new BadRequestError(
      "YT_UNAVAILABLE: הסרטון הזה לא זמין לעיבוד. נסו קישור ציבורי אחר.",
    );
  }
  if (lower.includes("live event") || lower.includes("is live")) {
    return new BadRequestError(
      "YT_LIVE: שידורים חיים לא נתמכים כרגע. המתינו לסיום השידור או העלו הקלטה.",
    );
  }
  return new BadRequestError(
    "YT_TEMP_FAILURE: לא הצלחנו לעבד את הסרטון כרגע. נסו שוב בעוד רגע.",
  );
}

function commonYtArgs(client: string): string[] {
  return [
    "--force-ipv4",
    "--no-warnings",
    "--no-check-certificates",
    "--extractor-args",
    `youtube:player_client=${client}`,
    "--add-header",
    "referer:youtube.com",
    "--add-header",
    "user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  ];
}

async function fetchYtDlpInfo(
  bin: string,
  canonicalUrl: string,
  client: string,
): Promise<YtDlpInfo> {
  const result = await runBinary(
    bin,
    [
      "--dump-single-json",
      "--skip-download",
      ...commonYtArgs(client),
      canonicalUrl,
    ],
    60_000,
  );
  if (result.code !== 0) {
    throw classifyYtDlpFailure(result.stderr || result.stdout);
  }
  try {
    return JSON.parse(result.stdout) as YtDlpInfo;
  } catch {
    throw new BadRequestError(
      "YT_TEMP_FAILURE: לא הצלחנו לקרוא את פרטי הסרטון. נסו שוב בעוד רגע.",
    );
  }
}

function assertPlayable(info: YtDlpInfo, maxDurationSeconds: number): void {
  const availability = (info.availability || "").toLowerCase();
  if (availability === "private") {
    throw new BadRequestError(
      "YT_PRIVATE: הסרטון פרטי ולא זמין לעיבוד. נסו קישור ציבורי אחר.",
    );
  }
  if (
    availability === "premium_only" ||
    availability === "subscriber_only" ||
    availability === "needs_auth"
  ) {
    throw new BadRequestError(
      "YT_UNAVAILABLE: הסרטון הזה לא זמין לעיבוד. נסו קישור ציבורי אחר.",
    );
  }
  if (info.is_live || info.live_status === "is_live") {
    throw new BadRequestError(
      "YT_LIVE: שידורים חיים לא נתמכים כרגע. המתינו לסיום השידור או העלו הקלטה.",
    );
  }
  if ((info.age_limit ?? 0) >= 18) {
    throw new BadRequestError(
      "YT_AGE_RESTRICTED: הסרטון מוגבל לגיל ולא ניתן לעיבוד אוטומטי. הורידו את האודיו והעלו קובץ.",
    );
  }
  const duration = Number(info.duration ?? 0);
  if (duration > maxDurationSeconds) {
    throw new BadRequestError(
      `YT_TOO_LONG: הסרטון ארוך מדי לתוכנית שלכם (עד ${Math.floor(maxDurationSeconds / 60)} דקות).`,
    );
  }
}

async function downloadAudioFile(
  bin: string,
  canonicalUrl: string,
  videoId: string,
  client: string,
): Promise<{ buffer: Buffer; fileName: string; contentType: string }> {
  const work = join(tmpdir(), `staz-yt-${randomUUID()}`);
  mkdirSync(work, { recursive: true });

  try {
    // Copy ffmpeg into ASCII-only temp so Hebrew workspace paths don't break yt-dlp.
    if (ffmpegPath && existsSync(ffmpegPath)) {
      const localName =
        process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg";
      copyFileSync(ffmpegPath, join(work, localName));
    }

    const outTpl = join(work, `${videoId}.%(ext)s`);
    const args = [
      "-f",
      "bestaudio/best",
      "-x",
      "--audio-format",
      "m4a",
      "--audio-quality",
      "5",
      "-o",
      outTpl,
      ...commonYtArgs(client),
      "--ffmpeg-location",
      work,
      "--no-playlist",
      canonicalUrl,
    ];

    const result = await runBinary(bin, args, 180_000);
    if (result.code !== 0) {
      throw classifyYtDlpFailure(result.stderr || result.stdout);
    }

    const allFiles = readdirSync(work).filter((f) => !f.startsWith("ffmpeg"));
    const files = allFiles.filter((f) =>
      /\.(m4a|mp3|webm|opus|ogg|mp4|m4b|aac|wav)$/i.test(f),
    );
    if (files.length === 0) {
      console.warn(
        `[youtube] no audio files after download; saw=${allFiles.join(",") || "(empty)"} stderr=${(result.stderr || "").slice(0, 240)}`,
      );
      throw new BadRequestError(
        "YT_NO_AUDIO: לא מצאנו ערוץ שמע זמין בסרטון. נסו סרטון אחר או העלו MP3/WAV.",
      );
    }

    const fileName = files[0];
    const buffer = readFileSync(join(work, fileName));
    if (buffer.length < 1024) {
      throw new BadRequestError(
        "YT_NO_AUDIO: לא מצאנו ערוץ שמע זמין בסרטון. נסו סרטון אחר או העלו MP3/WAV.",
      );
    }

    const ext = fileName.split(".").pop()?.toLowerCase() ?? "m4a";
    const contentType =
      ext === "mp3"
        ? "audio/mpeg"
        : ext === "webm"
          ? "audio/webm"
          : ext === "ogg" || ext === "opus"
            ? "audio/ogg"
            : ext === "wav"
              ? "audio/wav"
              : ext === "aac"
                ? "audio/aac"
                : "audio/mp4";

    return { buffer, fileName: `${videoId}.${ext}`, contentType };
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

type PipedStream = {
  url?: string;
  bitrate?: number;
  mimeType?: string;
  contentLength?: number;
};

type PipedResponse = {
  title?: string;
  duration?: number;
  audioStreams?: PipedStream[];
  livestream?: boolean;
};

async function extractViaPiped(input: {
  videoId: string;
  maxDurationSeconds: number;
  requestId: string;
}): Promise<YoutubeAudioSource | null> {
  for (const base of PIPED_API_BASES) {
    try {
      console.log(
        `[youtube] stage=piped requestId=${input.requestId} base=${base}`,
      );
      const res = await fetch(`${base}/streams/${input.videoId}`, {
        headers: {
          Accept: "application/json",
          "User-Agent": "StazAI/1.0",
        },
        signal: AbortSignal.timeout(25_000),
      });
      if (!res.ok) continue;
      const data = (await res.json()) as PipedResponse;
      if (data.livestream) {
        throw new BadRequestError(
          "YT_LIVE: שידורים חיים לא נתמכים כרגע. המתינו לסיום השידור או העלו הקלטה.",
        );
      }
      const duration = Number(data.duration ?? 0);
      if (duration > input.maxDurationSeconds) {
        throw new BadRequestError(
          `YT_TOO_LONG: הסרטון ארוך מדי לתוכנית שלכם (עד ${Math.floor(input.maxDurationSeconds / 60)} דקות).`,
        );
      }
      const streams = (data.audioStreams ?? [])
        .filter((s) => typeof s.url === "string" && s.url.startsWith("http"))
        .sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0));
      if (streams.length === 0) continue;

      const best = streams[0];
      const audioRes = await fetch(best.url!, {
        headers: { "User-Agent": "StazAI/1.0", Referer: "https://www.youtube.com/" },
        signal: AbortSignal.timeout(120_000),
        redirect: "follow",
      });
      if (!audioRes.ok) continue;
      const buffer = Buffer.from(await audioRes.arrayBuffer());
      if (buffer.length < 1024) continue;

      const mime = (best.mimeType || audioRes.headers.get("content-type") || "")
        .toLowerCase();
      const ext = mime.includes("webm")
        ? "webm"
        : mime.includes("mp4") || mime.includes("m4a")
          ? "m4a"
          : mime.includes("mpeg") || mime.includes("mp3")
            ? "mp3"
            : "m4a";
      const contentType =
        ext === "mp3"
          ? "audio/mpeg"
          : ext === "webm"
            ? "audio/webm"
            : "audio/mp4";

      console.log(
        `[youtube] stage=piped requestId=${input.requestId} ok=1 bytes=${buffer.length}`,
      );

      return {
        videoId: input.videoId,
        title: (data.title || `youtube-${input.videoId}`).slice(0, 180),
        durationSeconds: duration,
        canonicalUrl: `https://www.youtube.com/watch?v=${input.videoId}`,
        file: {
          buffer,
          fileName: `${input.videoId}.${ext}`,
          contentType,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestError) throw error;
      console.warn(
        `[youtube] piped failed base=${base}:`,
        error instanceof Error ? error.message.slice(0, 160) : error,
      );
    }
  }
  return null;
}

async function extractViaYtDlp(input: {
  parsed: ParsedYouTubeUrl;
  maxDurationSeconds: number;
  preferDownload: boolean;
  requestId: string;
}): Promise<YoutubeAudioSource> {
  const bin = await resolveYtDlpBinary();
  let lastError: Error | null = null;
  let info: YtDlpInfo | null = null;
  let usedClient: (typeof PLAYER_CLIENTS)[number] = PLAYER_CLIENTS[0];

  for (const client of PLAYER_CLIENTS) {
    try {
      console.log(
        `[youtube] stage=fetching_source requestId=${input.requestId} videoId=${input.parsed.videoId} client=${client}`,
      );
      info = await fetchYtDlpInfo(bin, input.parsed.canonicalUrl, client);
      usedClient = client;
      break;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(
        `[youtube] info failed client=${client}:`,
        lastError.message.slice(0, 160),
      );
    }
  }

  if (!info) {
    throw lastError instanceof BadRequestError
      ? lastError
      : new BadRequestError(
          lastError?.message?.startsWith("YT_")
            ? lastError.message
            : "YT_TEMP_FAILURE: לא הצלחנו לעבד את הסרטון כרגע. נסו שוב בעוד רגע.",
        );
  }

  assertPlayable(info, input.maxDurationSeconds);

  const title = (info.title || `youtube-${input.parsed.videoId}`).slice(0, 180);
  const durationSeconds = Number(info.duration ?? 0);

  lastError = null;
  for (const client of [usedClient, ...PLAYER_CLIENTS.filter((c) => c !== usedClient)]) {
    try {
      console.log(
        `[youtube] stage=extracting_audio requestId=${input.requestId} videoId=${input.parsed.videoId} client=${client}`,
      );
      const file = await downloadAudioFile(
        bin,
        input.parsed.canonicalUrl,
        input.parsed.videoId,
        client,
      );
      console.log(
        `[youtube] stage=extracting_audio requestId=${input.requestId} videoId=${input.parsed.videoId} bytes=${file.buffer.length}`,
      );
      return {
        videoId: input.parsed.videoId,
        title,
        durationSeconds,
        canonicalUrl: input.parsed.canonicalUrl,
        file,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(
        `[youtube] download failed client=${client}:`,
        lastError.message.slice(0, 160),
      );
    }
  }

  throw lastError instanceof BadRequestError
    ? lastError
    : new BadRequestError(
        "YT_TEMP_FAILURE: לא הצלחנו לעבד את הסרטון כרגע. נסו שוב בעוד רגע.",
      );
}

export async function extractYoutubeAudioSource(input: {
  url: string;
  maxDurationSeconds: number;
  /** When true, always download bytes (more reliable for AssemblyAI). */
  preferDownload?: boolean;
  requestId?: string;
}): Promise<{ parsed: ParsedYouTubeUrl; source: YoutubeAudioSource }> {
  const parsed = parseYouTubeUrl(input.url);
  const requestId = input.requestId ?? randomUUID().slice(0, 8);
  const preferDownload = input.preferDownload !== false;

  // yt-dlp with android client is currently the most reliable path.
  // Piped instances are a fallback when yt-dlp is blocked (common on some datacenter IPs).
  try {
    const source = await extractViaYtDlp({
      parsed,
      maxDurationSeconds: input.maxDurationSeconds,
      preferDownload,
      requestId,
    });
    return { parsed, source };
  } catch (ytError) {
    if (ytError instanceof BadRequestError) {
      const code = ytError.message.split(":")[0];
      if (
        code === "YT_PRIVATE" ||
        code === "YT_AGE_RESTRICTED" ||
        code === "YT_LIVE" ||
        code === "YT_TOO_LONG" ||
        code === "YT_INVALID_URL"
      ) {
        throw ytError;
      }
    }

    const piped = await extractViaPiped({
      videoId: parsed.videoId,
      maxDurationSeconds: input.maxDurationSeconds,
      requestId,
    });
    if (piped) {
      return { parsed, source: piped };
    }

    throw ytError;
  }
}

export function youtubeErrorCodeFromMessage(message: string): YoutubeErrorCode | null {
  const m = message.trim();
  if (m.startsWith("YT_INVALID_URL")) return "YT_INVALID_URL";
  if (m.startsWith("YT_PRIVATE")) return "YT_PRIVATE";
  if (m.startsWith("YT_UNAVAILABLE")) return "YT_UNAVAILABLE";
  if (m.startsWith("YT_AGE_RESTRICTED")) return "YT_AGE_RESTRICTED";
  if (m.startsWith("YT_LIVE")) return "YT_LIVE";
  if (m.startsWith("YT_NO_AUDIO")) return "YT_NO_AUDIO";
  if (m.startsWith("YT_TOO_LONG")) return "YT_TOO_LONG";
  if (m.startsWith("YT_TEMP_FAILURE")) return "YT_TEMP_FAILURE";
  if (m.startsWith("YT_EXTRACTOR_MISSING")) return "YT_EXTRACTOR_MISSING";
  return null;
}
