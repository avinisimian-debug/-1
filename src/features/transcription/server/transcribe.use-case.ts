import OpenAI from "openai";
import {
  ACCEPTED_EXTENSIONS,
  getMaxFileSizeForPlan,
  WHISPER_MAX_BYTES,
  type PlanTier,
} from "@/lib/constants";
import { formatDuration, formatTimestamp } from "@/lib/format";
import {
  BadRequestError,
  InternalServerError,
  normalizeApiError,
  type ApiError,
} from "@/shared/api";
import { failure, isFailure, success, type Result } from "@/shared/lib/result";
import type { TimedWord, TranscriptionResult } from "../types";
import { prepareAudioForWhisper } from "./prepare-audio";
import {
  buildAnalysisSystemPrompt,
  buildAnalysisUserPrompt,
} from "./analysis-prompts";
import {
  alignWhisperSegmentsWithDiarization,
  utterancesToTranscript,
} from "./align-speakers";
import {
  attachWordsToEntries,
  mapAssemblyAIWordsToTimedWords,
  mapWhisperWordsToTimedWords,
} from "./build-word-timestamps";
import {
  diarizeAudioUtterances,
  isDiarizationConfigured,
  transcribeWithDiarization,
} from "./diarize-audio";
import { hasFeature } from "@/lib/plan-features";

interface GptAnalysisBase {
  headline?: string;
  topics?: string[];
  decisions?: string[];
  overview?: string;
  executive: string[];
  keyTakeaways: string[];
  actionItems: Array<{
    task: string;
    owner: string;
    deadline: string;
    priority?: "high" | "medium" | "low";
  }>;
}

interface GptAnalysisPro extends GptAnalysisBase {
  sentiment?: {
    overall: "positive" | "neutral" | "mixed" | "negative";
    label: string;
    description: string;
  };
  chapters?: Array<{ timestamp: string; title: string }>;
  keyQuotes?: Array<{ quote: string; context: string }>;
  risks?: Array<{ risk: string; severity: "high" | "medium" | "low" }>;
  followUpEmail?: { subject: string; body: string };
  markdownReport?: string;
}

export interface TranscribeInput {
  file: File;
  plan: PlanTier;
  language?: string | null;
}

function buildAnalysisPrompt(isPro: boolean): string {
  return buildAnalysisSystemPrompt(isPro);
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
        new BadRequestError("Unsupported file type. Use MP3, WAV, MP4, or M4A."),
      );
    }

    const openai = getOpenAIClient();

    const prepared = await prepareAudioForWhisper(file);
    if (isFailure(prepared)) {
      return failure(new BadRequestError(prepared.error.message));
    }
    const audioFile = prepared.data.file;
    const useDiarization =
      isPro &&
      hasFeature("pro", "speakerDiarization") &&
      isDiarizationConfigured();

    let transcriptText = "";
    let durationSeconds = 0;
    let transcript: TranscriptionResult["transcript"] = [];
    let diarizationEnabled = false;
    let timedWords: TimedWord[] = [];

    if (useDiarization) {
      const diarized = await transcribeWithDiarization(audioFile, language);
      if (!isFailure(diarized)) {
        const {
          utterances,
          transcriptText: diarizedText,
          durationSeconds: dur,
          timedWords: diarizedWords,
        } = diarized.data;
        transcriptText = diarizedText;
        durationSeconds = dur;
        transcript = utterancesToTranscript(utterances);
        diarizationEnabled = transcript.length > 0;
        if (diarizedWords?.length) {
          timedWords = diarizedWords;
          transcript = attachWordsToEntries(transcript, timedWords);
        }
      }
    }

    if (!transcriptText) {
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
        response_format: "verbose_json",
        timestamp_granularities: ["word", "segment"],
        ...(isPro && language && language !== "auto" ? { language } : {}),
      });

      const segments = transcription.segments ?? [];
      const whisperWords = transcription.words ?? [];
      transcriptText = transcription.text?.trim() ?? "";

      durationSeconds =
        segments.length > 0 ? segments[segments.length - 1].end : 0;

      if (useDiarization && isDiarizationConfigured() && segments.length > 0) {
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
        new InternalServerError("Whisper returned an empty transcript."),
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: buildAnalysisPrompt(isPro),
        },
        {
          role: "user",
          content: buildAnalysisUserPrompt(
            transcriptText,
            file.name,
            diarizationEnabled
              ? transcript.map((line) => ({
                  speaker: line.speaker,
                  text: line.text,
                }))
              : undefined,
          ),
        },
      ],
    });

    const rawAnalysis = completion.choices[0]?.message?.content;
    if (!rawAnalysis) {
      return failure(
        new InternalServerError("GPT-4o did not return an analysis."),
      );
    }

    const analysis = JSON.parse(rawAnalysis) as GptAnalysisPro;

    return success({
      fileName: file.name,
      duration: formatDuration(durationSeconds),
      processedAt: new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      ...(analysis.headline?.trim() ? { headline: analysis.headline.trim() } : {}),
      ...(analysis.topics?.length ? { topics: analysis.topics } : {}),
      ...(analysis.decisions?.length ? { decisions: analysis.decisions } : {}),
      summary: {
        overview: analysis.overview?.trim() ?? "",
        executive: analysis.executive ?? [],
        keyTakeaways: analysis.keyTakeaways ?? [],
        ...(analysis.markdownReport?.trim()
          ? { markdown: analysis.markdownReport.trim() }
          : {}),
      },
      actionItems: (analysis.actionItems ?? []).map((item, index) => ({
        id: String(index + 1),
        task: item.task,
        owner: item.owner || "Unassigned",
        deadline: item.deadline || "TBD",
        completed: false,
        ...(isPro && item.priority ? { priority: item.priority } : {}),
      })),
      transcript,
      ...(timedWords.length > 0 ? { timedWords } : {}),
      ...(diarizationEnabled ? { diarizationEnabled: true } : {}),
      ...(isPro && analysis.chapters?.length ? { chapters: analysis.chapters } : {}),
      ...(isPro && analysis.sentiment ? { sentiment: analysis.sentiment } : {}),
      ...(isPro && analysis.keyQuotes?.length ? { keyQuotes: analysis.keyQuotes } : {}),
      ...(isPro && analysis.risks?.length ? { risks: analysis.risks } : {}),
      ...(isPro && analysis.followUpEmail ? { followUpEmail: analysis.followUpEmail } : {}),
    });
  } catch (error) {
    return failure(normalizeApiError(error));
  }
}
