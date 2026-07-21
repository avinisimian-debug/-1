import OpenAI from "openai";
import {
  ACCEPTED_EXTENSIONS,
  getMaxFileSizeForPlan,
  WHISPER_MAX_BYTES,
  type PlanTier,
} from "@/lib/constants";
import { formatTimestamp } from "@/lib/format";
import {
  BadRequestError,
  InternalServerError,
  normalizeApiError,
  type ApiError,
} from "@/shared/api";
import { failure, isFailure, type Result } from "@/shared/lib/result";
import type { TimedWord, TranscriptionResult } from "../types";
import { analyzeTranscriptWithOpenAI } from "./analyze-transcript.use-case";
import { prepareAudioForWhisper } from "./prepare-audio";
import {
  alignWhisperSegmentsWithDiarization,
  utterancesToTranscript,
} from "./align-speakers";
import {
  attachWordsToEntries,
  mapWhisperWordsToTimedWords,
} from "./build-word-timestamps";
import {
  diarizeAudioUtterances,
  isAssemblyAIConfigured,
  transcribeWithAssemblyAI,
} from "./diarize-audio";
import { hasFeature } from "@/lib/plan-features";

export interface TranscribeInput {
  file: File;
  plan: PlanTier;
  language?: string | null;
}

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new InternalServerError(
      "OPENAI_API_KEY is not configured. Add it to your .env.local file.",
    );
  }
  return new OpenAI({ apiKey });
}

export async function transcribeAudio({
  file,
  plan,
  language = null,
}: TranscribeInput): Promise<Result<TranscriptionResult, ApiError>> {
  try {
    const isPro = plan === "pro";

    const maxSize = getMaxFileSizeForPlan(plan === "pro" ? "pro" : "free");

    if (file.size > maxSize) {
      const limitLabel = plan === "pro" ? "500 MB" : "25 MB";
      return failure(
        new BadRequestError(
          plan === "free"
            ? `File exceeds the ${limitLabel} free tier limit. Upgrade to Pro for files up to 500 MB.`
            : `PLAN_LIMIT_PRO: File exceeds the ${limitLabel} limit.`,
        ),
      );
    }

    if (file.size > WHISPER_MAX_BYTES && plan !== "pro") {
      return failure(
        new BadRequestError(
          "Files over 25 MB require a Pro plan. Upgrade to process longer videos.",
        ),
      );
    }

    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      return failure(
        new BadRequestError(
          "Unsupported file type. Use MP3, WAV, M4A, AAC, FLAC, OGG, MP4, MOV, WEBM, MKV, or AVI.",
        ),
      );
    }

    const openai = getOpenAIClient();

    const prepared = await prepareAudioForWhisper(file);
    if (isFailure(prepared)) {
      return failure(new BadRequestError(prepared.error.message));
    }
    const audioFile = prepared.data.file;
    const useSpeakerLabels =
      isPro &&
      hasFeature("pro", "speakerDiarization") &&
      isAssemblyAIConfigured();

    let transcriptText = "";
    let durationSeconds = 0;
    let transcript: TranscriptionResult["transcript"] = [];
    let diarizationEnabled = false;
    let timedWords: TimedWord[] = [];

    // Primary STT: AssemblyAI when configured; OpenAI Whisper is the fallback.
    if (isAssemblyAIConfigured()) {
      const assembly = await transcribeWithAssemblyAI(audioFile, {
        language,
        speakerLabels: useSpeakerLabels,
      });
      if (!isFailure(assembly)) {
        const {
          utterances,
          transcriptText: aaiText,
          durationSeconds: dur,
          timedWords: aaiWords,
        } = assembly.data;
        transcriptText = aaiText;
        durationSeconds = dur;
        if (utterances.length > 0) {
          transcript = utterancesToTranscript(utterances);
          diarizationEnabled = useSpeakerLabels;
        } else if (transcriptText) {
          transcript = [
            {
              timestamp: "00:00",
              speaker: "Speaker 1",
              speakerId: "1",
              text: transcriptText,
            },
          ];
        }
        if (aaiWords?.length) {
          timedWords = aaiWords;
          transcript = attachWordsToEntries(transcript, timedWords);
        }
      } else {
        console.warn(
          "[transcribe] AssemblyAI failed; falling back to Whisper:",
          assembly.error.message,
        );
      }
    }

    if (!transcriptText) {
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
        response_format: "verbose_json",
        timestamp_granularities: ["word", "segment"],
        ...(language && language !== "auto" ? { language } : {}),
      });

      const segments = transcription.segments ?? [];
      const whisperWords = transcription.words ?? [];
      transcriptText = transcription.text?.trim() ?? "";

      durationSeconds =
        segments.length > 0 ? segments[segments.length - 1].end : 0;

      if (useSpeakerLabels && segments.length > 0) {
        const utterancesResult = await diarizeAudioUtterances(audioFile, language);
        if (!isFailure(utterancesResult) && utterancesResult.data.length > 0) {
          transcript = alignWhisperSegmentsWithDiarization(
            segments.map((s) => ({
              start: s.start,
              end: s.end,
              text: s.text,
            })),
            utterancesResult.data,
          );
          diarizationEnabled = true;
        } else {
          transcript = segments.map((segment) => ({
            timestamp: formatTimestamp(segment.start),
            speaker: "Speaker 1",
            speakerId: "1",
            text: segment.text.trim(),
          }));
        }
      } else {
        transcript =
          segments.length > 0
            ? segments.map((segment) => ({
                timestamp: formatTimestamp(segment.start),
                speaker: "Speaker 1",
                speakerId: "1",
                text: segment.text.trim(),
              }))
            : transcriptText
              ? [
                  {
                    timestamp: "00:00",
                    speaker: "Speaker 1",
                    speakerId: "1",
                    text: transcriptText,
                  },
                ]
              : [];
      }

      if (whisperWords.length > 0 && timedWords.length === 0) {
        timedWords = mapWhisperWordsToTimedWords(
          transcript,
          whisperWords.map((w) => ({
            word: w.word,
            start: w.start,
            end: w.end,
          })),
        );
        transcript = attachWordsToEntries(transcript, timedWords);
      }
    }

    if (!transcriptText) {
      return failure(
        new InternalServerError("Speech-to-text returned an empty transcript."),
      );
    }

    return analyzeTranscriptWithOpenAI({
      fileName: file.name,
      plan,
      transcriptText,
      durationSeconds,
      transcript,
      timedWords,
      diarizationEnabled,
    });
  } catch (error) {
    return failure(normalizeApiError(error));
  }
}
