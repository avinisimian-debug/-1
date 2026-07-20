import { existsSync } from "fs";
import { writeFile, readFile, unlink } from "fs/promises";
import { createRequire } from "module";
import { tmpdir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";
import ffmpeg from "fluent-ffmpeg";
import { WHISPER_MAX_BYTES } from "@/lib/constants";
import { failure, success, type Result } from "@/shared/lib/result";

const require = createRequire(import.meta.url);

/** Containers Whisper accepts natively (under 25 MB). */
const WHISPER_NATIVE_EXTENSIONS = new Set([
  ".mp3",
  ".mp4",
  ".mpeg",
  ".mpga",
  ".m4a",
  ".wav",
  ".webm",
  ".flac",
  ".ogg",
]);

/** Real video/audio containers that usually need ffmpeg extraction. */
const NEEDS_EXTRACT_EXTENSIONS = new Set([
  ".mov",
  ".mkv",
  ".avi",
  ".m4v",
  ".aac",
]);

const VIDEO_CONTAINER_EXTENSIONS = new Set([
  ".mp4",
  ".mov",
  ".webm",
  ".mkv",
  ".avi",
  ".m4v",
]);

function getExtension(file: File): string {
  return file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
    : "";
}

export function isVideoUpload(file: File): boolean {
  if (file.type.startsWith("audio/")) return false;
  const ext = getExtension(file);
  return VIDEO_CONTAINER_EXTENSIONS.has(ext) || file.type.startsWith("video/");
}

/**
 * Only run ffmpeg when Whisper cannot accept the file as-is,
 * or when the file must be compressed below 25 MB.
 */
export function needsFfmpeg(file: File): boolean {
  const ext = getExtension(file);
  const oversized = file.size > WHISPER_MAX_BYTES;

  if (oversized) return true;
  if (NEEDS_EXTRACT_EXTENSIONS.has(ext)) return true;

  // Pure audio always passthrough when under Whisper size limit.
  if (file.type.startsWith("audio/") && WHISPER_NATIVE_EXTENSIONS.has(ext)) {
    return false;
  }

  // Whisper-native containers (incl. mp4/webm) under 25 MB → direct upload.
  if (WHISPER_NATIVE_EXTENSIONS.has(ext)) {
    return false;
  }

  // Unknown video type → try extract.
  if (file.type.startsWith("video/")) return true;

  return false;
}

function resolveFfmpegPath(): string | null {
  const envPath = process.env.FFMPEG_BIN;
  if (envPath && existsSync(envPath)) {
    return envPath;
  }

  const binary = process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg";
  const candidates = [
    join(process.cwd(), "node_modules", "ffmpeg-static", binary),
    join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg"),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  try {
    const staticPath = require("ffmpeg-static") as string | null;
    if (staticPath && existsSync(staticPath)) {
      return staticPath;
    }
  } catch {
    // ffmpeg-static not available
  }

  return null;
}

let configuredFfmpegPath: string | null | undefined;

function ensureFfmpeg(): string | null {
  if (configuredFfmpegPath !== undefined) {
    return configuredFfmpegPath;
  }
  const path = resolveFfmpegPath();
  configuredFfmpegPath = path;
  if (path) {
    ffmpeg.setFfmpegPath(path);
  }
  return path;
}

async function convertToMp3(
  inputPath: string,
  outputPath: string,
  bitrate: string,
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions(["-vn", "-ac", "1", "-ar", "16000"])
      .audioCodec("libmp3lame")
      .audioBitrate(bitrate)
      .format("mp3")
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .save(outputPath);
  });
}

export async function prepareAudioForWhisper(
  file: File,
): Promise<Result<{ file: File; compressed: boolean }, Error>> {
  const isVideo = isVideoUpload(file);
  const isOversized = file.size > WHISPER_MAX_BYTES;
  const mustConvert = needsFfmpeg(file);

  // Fast path: send Whisper-native formats straight through (unblocks most videos).
  if (!mustConvert) {
    return success({ file, compressed: false });
  }

  const ffmpegPath = ensureFfmpeg();

  if (!ffmpegPath) {
    // Last resort: if Whisper might still accept it, try passthrough.
    const ext = getExtension(file);
    if (!isOversized && WHISPER_NATIVE_EXTENSIONS.has(ext)) {
      console.warn(
        "[prepare-audio] ffmpeg missing — passthrough native format",
        ext,
      );
      return success({ file, compressed: false });
    }

    if (isOversized) {
      return failure(
        new Error(
          "Large file processing is unavailable. ffmpeg was not found on the server.",
        ),
      );
    }

    return failure(
      new Error(
        "Video audio extraction is unavailable on the server (ffmpeg missing). Try MP3/WAV under 25 MB, or MP4/WebM under 25 MB.",
      ),
    );
  }

  const id = randomUUID();
  const ext = getExtension(file) || ".bin";
  const inputPath = join(tmpdir(), `${id}-input${ext}`);
  const outputPath = join(tmpdir(), `${id}-output.mp3`);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(inputPath, buffer);

    const bitrates = isOversized
      ? ["64k", "48k", "32k"]
      : ["128k", "96k", "64k"];
    let outputBuffer: Buffer | null = null;

    for (const bitrate of bitrates) {
      await convertToMp3(inputPath, outputPath, bitrate);
      outputBuffer = await readFile(outputPath);

      if (!isOversized || outputBuffer.length <= WHISPER_MAX_BYTES) {
        break;
      }
    }

    if (!outputBuffer || outputBuffer.length === 0) {
      return failure(
        new Error(
          "Could not extract audio from this file. The recording may be empty or use an unsupported codec.",
        ),
      );
    }

    if (isOversized && outputBuffer.length > WHISPER_MAX_BYTES) {
      return failure(
        new Error(
          "File is too long even after compression. Try a shorter recording or split the file.",
        ),
      );
    }

    const prepared = new File(
      [new Uint8Array(outputBuffer)],
      file.name.replace(/\.[^.]+$/, "") + "-audio.mp3",
      { type: "audio/mpeg" },
    );

    return success({ file: prepared, compressed: isOversized || isVideo });
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Unknown conversion error";

    // If conversion fails but Whisper might accept original under 25 MB, try it.
    const ext = getExtension(file);
    if (!isOversized && WHISPER_NATIVE_EXTENSIONS.has(ext)) {
      console.warn(
        "[prepare-audio] ffmpeg failed; falling back to native passthrough:",
        detail,
      );
      return success({ file, compressed: false });
    }

    return failure(
      new Error(
        `Could not process this recording (${detail}). Try MP3/WAV or MP4/WebM under 25 MB.`,
      ),
    );
  } finally {
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});
  }
}
