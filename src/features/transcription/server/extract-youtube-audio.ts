/**
 * Extract playable audio from a public YouTube video via yt-dlp.
 * AssemblyAI cannot ingest YouTube page URLs — we must resolve a media source first.
 */

import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
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

function resolveYtDlpBinary(): string {
  try {
    // youtube-dl-exec ships a platform binary under bin/
    const constants = require("youtube-dl-exec/src/constants") as {
      YOUTUBE_DL_PATH: string;
    };
    if (constants.YOUTUBE_DL_PATH && existsSync(constants.YOUTUBE_DL_PATH)) {
      return constants.YOUTUBE_DL_PATH;
    }
  } catch {
    // fall through
  }

  // Fallbacks for traced serverless deployments
  const candidates = [
    join(process.cwd(), "node_modules", "youtube-dl-exec", "bin", "yt-dlp"),
    join(process.cwd(), "node_modules", "youtube-dl-exec", "bin", "yt-dlp.exe"),
    join(__dirname, "..", "..", "..", "..", "node_modules", "youtube-dl-exec", "bin", "yt-dlp"),
    join(__dirname, "..", "..", "..", "..", "node_modules", "youtube-dl-exec", "bin", "yt-dlp.exe"),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  throw new BadRequestError(
    "YT_EXTRACTOR_MISSING: ייבוא YouTube לא מוגדר בשרת. העלו קובץ MP3/MP4 או נסו שוב מאוחר יותר.",
  );
}

function runBinary(
  bin: string,
  args: string[],
  timeoutMs = 180_000,
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

async function fetchYtDlpInfo(
  bin: string,
  canonicalUrl: string,
): Promise<YtDlpInfo> {
  const result = await runBinary(bin, [
    "--dump-single-json",
    "--skip-download",
    "--no-warnings",
    "--no-check-certificates",
    "--add-header",
    "referer:youtube.com",
    "--add-header",
    "user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    canonicalUrl,
  ]);
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

async function resolveStreamUrl(
  bin: string,
  canonicalUrl: string,
): Promise<string | undefined> {
  const result = await runBinary(bin, [
    "-f",
    "bestaudio[ext=m4a]/bestaudio/best",
    "-g",
    "--no-warnings",
    "--no-check-certificates",
    "--add-header",
    "referer:youtube.com",
    "--add-header",
    "user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    canonicalUrl,
  ]);
  if (result.code !== 0) return undefined;
  const line = result.stdout
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find((l) => l.startsWith("http"));
  return line;
}

async function downloadAudioFile(
  bin: string,
  canonicalUrl: string,
  videoId: string,
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
      "bestaudio[ext=m4a]/bestaudio/best",
      "-o",
      outTpl,
      "--no-warnings",
      "--no-check-certificates",
      "--add-header",
      "referer:youtube.com",
      "--add-header",
      "user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "--ffmpeg-location",
      work,
      canonicalUrl,
    ];

    const result = await runBinary(bin, args, 240_000);
    if (result.code !== 0) {
      throw classifyYtDlpFailure(result.stderr || result.stdout);
    }

    const files = readdirSync(work).filter(
      (f) => !f.startsWith("ffmpeg") && /\.(m4a|mp3|webm|opus|ogg)$/i.test(f),
    );
    if (files.length === 0) {
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
            : "audio/mp4";

    return { buffer, fileName: `${videoId}.${ext}`, contentType };
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

export async function extractYoutubeAudioSource(input: {
  url: string;
  maxDurationSeconds: number;
  /** When true, always download bytes (more reliable for AssemblyAI). */
  preferDownload?: boolean;
  requestId?: string;
}): Promise<{ parsed: ParsedYouTubeUrl; source: YoutubeAudioSource }> {
  const parsed = parseYouTubeUrl(input.url);
  const bin = resolveYtDlpBinary();
  const requestId = input.requestId ?? randomUUID().slice(0, 8);

  console.log(
    `[youtube] stage=fetching_source requestId=${requestId} videoId=${parsed.videoId}`,
  );

  const info = await fetchYtDlpInfo(bin, parsed.canonicalUrl);
  assertPlayable(info, input.maxDurationSeconds);

  const title = (info.title || `youtube-${parsed.videoId}`).slice(0, 180);
  const durationSeconds = Number(info.duration ?? 0);

  let streamUrl: string | undefined;
  if (!input.preferDownload) {
    streamUrl = await resolveStreamUrl(bin, parsed.canonicalUrl);
  }

  if (streamUrl && !input.preferDownload) {
    console.log(
      `[youtube] stage=stream_url requestId=${requestId} videoId=${parsed.videoId} ok=1`,
    );
    return {
      parsed,
      source: {
        videoId: parsed.videoId,
        title,
        durationSeconds,
        canonicalUrl: parsed.canonicalUrl,
        streamUrl,
      },
    };
  }

  console.log(
    `[youtube] stage=extracting_audio requestId=${requestId} videoId=${parsed.videoId}`,
  );
  const file = await downloadAudioFile(bin, parsed.canonicalUrl, parsed.videoId);
  console.log(
    `[youtube] stage=extracting_audio requestId=${requestId} videoId=${parsed.videoId} bytes=${file.buffer.length}`,
  );

  return {
    parsed,
    source: {
      videoId: parsed.videoId,
      title,
      durationSeconds,
      canonicalUrl: parsed.canonicalUrl,
      file,
    },
  };
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
