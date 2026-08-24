import { AssemblyAI } from "assemblyai";
import { hasFeature } from "@/lib/plan-features";
import type { PlanTier } from "@/lib/constants";
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

/**
 * Transcribe a public platform URL (YouTube, etc.) via AssemblyAI's audio_url.
 */
export async function transcribeRemoteUrlWithAssemblyAI(input: {
  url: string;
  plan: PlanTier;
  language?: string | null;
}): Promise<Result<TranscriptionResult, ApiError>> {
  try {
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

    const transcript = await client.transcripts.transcribe({
      audio_url: input.url,
      speaker_labels: isPro && hasFeature("pro", "speakerDiarization"),
      ...(languageCode ? { language_code: languageCode } : { language_detection: true }),
    });

    if (transcript.status === "error") {
      return failure(
        new BadRequestError(
          transcript.error ??
            "Could not transcribe this link. Try a direct MP3/MP4 URL or download the file.",
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

    const host = (() => {
      try {
        return new URL(input.url).hostname.replace(/^www\./, "");
      } catch {
        return "link";
      }
    })();

    const analyzed = await analyzeTranscriptWithOpenAI({
      fileName: `link-${host}`,
      plan: input.plan,
      transcriptText: text,
      durationSeconds,
      transcript: lines,
      ...(timedWords.length > 0 ? { timedWords } : {}),
      ...(utterances.length > 0 ? { diarizationEnabled: true } : {}),
    });

    if (isFailure(analyzed)) return analyzed;
    return success(analyzed.data);
  } catch (error) {
    return failure(normalizeApiError(error));
  }
}
