/**
 * Quick Piped-only extract smoke test (no AssemblyAI).
 * Usage: npx tsx scripts/verify-youtube-piped.ts [videoId]
 */
import { extractYoutubeAudioSource } from "../src/features/transcription/server/extract-youtube-audio";

const videoId = process.argv[2] || "pGxBrJ5KK20";
const url = `https://www.youtube.com/watch?v=${videoId}`;

async function main() {
  process.env.VERCEL = "1"; // prefer Piped-first path
  const t0 = Date.now();
  const { source } = await extractYoutubeAudioSource({
    url,
    maxDurationSeconds: 3 * 3600,
    preferDownload: true,
    requestId: "piped-verify",
  });
  console.log(
    JSON.stringify(
      {
        ok: true,
        videoId: source.videoId,
        title: source.title?.slice(0, 80),
        bytes: source.file?.buffer.length ?? 0,
        ms: Date.now() - t0,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(
    JSON.stringify({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    }),
  );
  process.exit(1);
});
