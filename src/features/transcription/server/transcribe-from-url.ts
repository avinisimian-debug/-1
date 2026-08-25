import { AssemblyAI } from "assemblyai";
import { hasFeature } from "@/lib/plan-features";
import type { PlanTier } from "@/lib/constants";
import { PLAN_LIMITS } from "@/lib/constants";
import {
  BadRequestError,
  InternalServerError,
  normalizeApiError,
  type ApiError,
} from "@/shared/api";
import { failure, isFailure, success, type Result } from "@/shared/lib/result";
import type { TranscriptionResult } from "../types";
import { analyzeTranscriptWithOpenAI } from "./analyze-transcript.use-case";
import type { DiarizationUtterance } from "./align-speakers";
import { utterancesToTranscript } from "./align-speakers";
import { isDiarizationConfigured } from "./diarize-audio";
import {
  attachWordsToEntries,
  mapAssemblyAIWordsToTimedWords,
} from "./build-word-timestamps";
import { extractYoutubeAudioSource } from "./extract-youtube-audio";
import { isYouTubeUrl } from "./youtube-url";

function maxDurationSecondsForPlan(plan: PlanTier): number {
  // Free ~30 min, Pro ~3h — keep headroom under marketing labels.
  return plan === "pro" ? 3 * 60 * 60 : 30 * 60;
}

async function transcribeAssemblyAiAudioUrl(input: {
  audioUrl: string;
  plan: PlanTier;
  language?: string | null;
  fileName: string;
  requestId: string;
}): Promise<Result<TranscriptionResult, ApiError>> {
  if (!isDiarizationConfigured()) {
    return failure(
      new BadRequestError(
        "PLATFORM_URL: Set ASSEMBLYAI_API_KEY to transcribe YouTube/Zoom page links, or paste a direct .mp3/.mp4 URL.",
      ),
    );
  }

  const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY!.trim(),
  });

  const isPro = input.plan === "pro";
  const languageCode =
    input.language && input.language !== "auto" ? input.language : undefined;

  console.log(
    `[youtube] stage=transcribing requestId=${input.requestId} file=${input.fileName}`,
  );

  const transcript = await client.transcripts.transcribe({
    audio_url: input.audioUrl,
    speaker_labels: isPro && hasFeature("pro", "speakerDiarization"),
    ...(languageCode
      ? { language_code: languageCode }
      : { language_detection: true }),
  });

  if (transcript.status === "error") {
    const raw = transcript.error ?? "transcription failed";
    console.warn(
      `[youtube] stage=transcribing requestId=${input.requestId} failed=${raw.slice(0, 200)}`,
    );
    return failure(
      new BadRequestError(
        `TRANSCRIBE_FAILED: הצלחנו לקבל את הסרטון, אבל הייתה בעיה ביצירת התמלול. נסו שוב.`,
      ),
    );
  }

  const text = transcript.text?.trim() ?? "";
  if (!text) {
    return failure(
      new InternalServerError("Empty transcript from remote URL."),
    );
  }

  const indexByRaw = new Map<string, number>();
  const speakerLabelByRaw = new Map<
    string,
    { speakerId: string; speakerLabel: string }
  >();

  const utterances: DiarizationUtterance[] = (transcript.utterances ?? []).map(
    (u) => {
      const raw = u.speaker ?? "A";
      if (!indexByRaw.has(raw)) {
        indexByRaw.set(raw, indexByRaw.size + 1);
      }
      const n = indexByRaw.get(raw)!;
      const mapped = {
        speakerId: String(n),
        speakerLabel: `Speaker ${n}`,
      };
      speakerLabelByRaw.set(raw, mapped);
      return {
        speakerId: mapped.speakerId,
        speakerLabel: mapped.speakerLabel,
        startMs: u.start ?? 0,
        endMs: u.end ?? 0,
        text: u.text,
      };
    },
  );

  let lines =
    utterances.length > 0
      ? utterancesToTranscript(utterances)
      : [
          {
            timestamp: "00:00",
            speaker: "Speaker 1",
            speakerId: "1",
            text,
          },
        ];

  const timedWords =
    transcript.words && transcript.words.length > 0
      ? mapAssemblyAIWordsToTimedWords(
          transcript.words.map((w) => ({
            text: w.text,
            start: w.start,
            end: w.end,
            speaker: w.speaker,
          })),
          speakerLabelByRaw,
        )
      : [];

  if (timedWords.length > 0) {
    lines = attachWordsToEntries(lines, timedWords);
  }

  const durationSeconds =
    typeof transcript.audio_duration === "number"
      ? transcript.audio_duration
      : utterances.length > 0
        ? utterances[utterances.length - 1].endMs / 1000
        : 0;

  console.log(
    `[youtube] stage=analyzing requestId=${input.requestId} file=${input.fileName}`,
  );

  const analyzed = await analyzeTranscriptWithOpenAI({
    fileName: input.fileName,
    plan: input.plan,
    transcriptText: text,
    durationSeconds,
    transcript: lines,
    ...(timedWords.length > 0 ? { timedWords } : {}),
    ...(utterances.length > 0 ? { diarizationEnabled: true } : {}),
  });

  if (isFailure(analyzed)) {
    return failure(
      new BadRequestError(
        "ANALYSIS_FAILED: התמלול הושלם, אבל עיבוד התובנות נכשל. נסו שוב.",
      ),
    );
  }
  return success(analyzed.data);
}

/**
 * Transcribe a YouTube URL: extract audio (yt-dlp) → AssemblyAI → GPT closeout.
 * Never passes a YouTube page URL to AssemblyAI (unsupported).
 */
export async function transcribeYouTubeUrl(input: {
  url: string;
  plan: PlanTier;
  language?: string | null;
  requestId?: string;
}): Promise<Result<TranscriptionResult, ApiError>> {
  const requestId = input.requestId ?? `yt-${Date.now().toString(36)}`;
  try {
    if (!isYouTubeUrl(input.url)) {
      return failure(
        new BadRequestError(
          "YT_INVALID_URL: הקישור שהוזן לא נראה כמו קישור YouTube תקין.",
        ),
      );
    }

    if (!isDiarizationConfigured()) {
      return failure(
        new BadRequestError(
          "PLATFORM_URL: Set ASSEMBLYAI_API_KEY to transcribe YouTube links, or upload an MP3/MP4 file.",
        ),
      );
    }

    const { source } = await extractYoutubeAudioSource({
      url: input.url,
      maxDurationSeconds: maxDurationSecondsForPlan(input.plan),
      requestId,
      // Prefer download+upload — googlevideo stream URLs are often IP-bound
      // and fail when AssemblyAI fetches them from another network.
      preferDownload: true,
    });

    const client = new AssemblyAI({
      apiKey: process.env.ASSEMBLYAI_API_KEY!.trim(),
    });

    let audioUrl = source.streamUrl;
    if (source.file) {
      const maxBytes = PLAN_LIMITS[input.plan].maxFileSizeBytes;
      if (source.file.buffer.length > maxBytes) {
        return failure(
          new BadRequestError(
            `YT_TOO_LONG: קובץ האודיו גדול מדי לתוכנית שלכם (מקס׳ ${PLAN_LIMITS[input.plan].maxFileSizeLabel}).`,
          ),
        );
      }
      console.log(
        `[youtube] stage=uploading_audio requestId=${requestId} bytes=${source.file.buffer.length}`,
      );
      audioUrl = await client.files.upload(source.file.buffer);
    }

    if (!audioUrl) {
      return failure(
        new BadRequestError(
          "YT_NO_AUDIO: לא מצאנו ערוץ שמע זמין בסרטון. נסו סרטון אחר או העלו MP3/WAV.",
        ),
      );
    }

    const safeTitle = source.title.replace(/[^\w\u0590-\u05FF.\-() ]+/g, "_").slice(0, 80);
    return await transcribeAssemblyAiAudioUrl({
      audioUrl,
      plan: input.plan,
      language: input.language,
      fileName: `${safeTitle || source.videoId}.m4a`,
      requestId,
    });
  } catch (error) {
    if (error instanceof BadRequestError) return failure(error);
    console.error(`[youtube] requestId=${requestId} unexpected`, error);
    return failure(normalizeApiError(error));
  }
}

/**
 * Transcribe a public *direct* media URL via AssemblyAI's audio_url.
 * Do not use for YouTube page links.
 */
export async function transcribeRemoteUrlWithAssemblyAI(input: {
  url: string;
  plan: PlanTier;
  language?: string | null;
}): Promise<Result<TranscriptionResult, ApiError>> {
  try {
    if (isYouTubeUrl(input.url)) {
      return transcribeYouTubeUrl(input);
    }

    const host = (() => {
      try {
        return new URL(input.url).hostname.replace(/^www\./, "");
      } catch {
        return "link";
      }
    })();

    return await transcribeAssemblyAiAudioUrl({
      audioUrl: input.url,
      plan: input.plan,
      language: input.language,
      fileName: `link-${host}`,
      requestId: `url-${Date.now().toString(36)}`,
    });
  } catch (error) {
    return failure(normalizeApiError(error));
  }
}
