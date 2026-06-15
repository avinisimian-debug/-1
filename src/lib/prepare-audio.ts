import { existsSync } from "fs";
import { writeFile, readFile, unlink } from "fs/promises";
import { createRequire } from "module";
import { tmpdir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";
import ffmpeg from "fluent-ffmpeg";
import { WHISPER_MAX_BYTES } from "./constants";

const require = createRequire(import.meta.url);

function resolveFfmpegPath(): string | null {
  const envPath = process.env.FFMPEG_BIN;
  if (envPath && existsSync(envPath)) {
    return envPath;
  }

  const binary = process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg";
  const fromProjectRoot = join(
    process.cwd(),
    "node_modules",
    "ffmpeg-static",
    binary,
  );
  if (existsSync(fromProjectRoot)) {
    return fromProjectRoot;
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

const ffmpegPath = resolveFfmpegPath();

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
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
): Promise<{ file: File; compressed: boolean }> {
  if (file.size <= WHISPER_MAX_BYTES) {
    return { file, compressed: false };
  }

  if (!ffmpegPath) {
    throw new Error(
      "Large file processing is unavailable. ffmpeg was not found on the server.",
    );
  }

  const id = randomUUID();
  const ext = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf("."))
    : ".mp4";
  const inputPath = join(tmpdir(), `${id}-input${ext}`);
  const outputPath = join(tmpdir(), `${id}-output.mp3`);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(inputPath, buffer);

    const bitrates = ["64k", "48k", "32k"];
    let outputBuffer: Buffer | null = null;

    for (const bitrate of bitrates) {
      await convertToMp3(inputPath, outputPath, bitrate);
      outputBuffer = await readFile(outputPath);

      if (outputBuffer.length <= WHISPER_MAX_BYTES) {
        break;
      }
    }

    if (!outputBuffer || outputBuffer.length > WHISPER_MAX_BYTES) {
      throw new Error(
        "File is too long even after compression. Try a shorter recording or split the file.",
      );
    }

    const prepared = new File(
      [new Uint8Array(outputBuffer)],
      "audio-compressed.mp3",
      { type: "audio/mpeg" },
    );

    return { file: prepared, compressed: true };
  } finally {
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});
  }
}
