/**
 * Verify YouTube extract → AssemblyAI path for one public URL.
 * Usage: npx tsx scripts/verify-youtube-ingest.ts [url]
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { extractYoutubeAudioSource } from "../src/features/transcription/server/extract-youtube-audio";
import { parseYouTubeUrl } from "../src/features/transcription/server/youtube-url";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

async function main() {
  loadEnvLocal();
  const url =
    process.argv[2] || "https://www.youtube.com/watch?v=pGxBrJ5KK20";

  console.log("parse", parseYouTubeUrl(url));

  const { source } = await extractYoutubeAudioSource({
    url,
    maxDurationSeconds: 3 * 60 * 60,
    preferDownload: true,
    requestId: "verify",
  });
  console.log({
    title: source.title,
    durationSeconds: source.durationSeconds,
    bytes: source.file?.buffer.length ?? 0,
    hasStream: Boolean(source.streamUrl),
  });

  if (!process.env.ASSEMBLYAI_API_KEY) {
    console.log("SKIP STT: ASSEMBLYAI_API_KEY missing — extract OK");
    process.exit(0);
  }

  const { AssemblyAI } = await import("assemblyai");
  const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY.trim(),
  });
  const uploaded = await client.files.upload(source.file!.buffer);
  console.log("uploaded to AssemblyAI");
  const transcript = await client.transcripts.transcribe({
    audio_url: uploaded,
    language_detection: true,
  });
  if (transcript.status === "error") {
    console.error("STT FAIL", transcript.error);
    process.exit(1);
  }
  const text = (transcript.text || "").slice(0, 200);
  console.log("STT OK chars", (transcript.text || "").length, "preview:", text);
  process.exit(0);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
