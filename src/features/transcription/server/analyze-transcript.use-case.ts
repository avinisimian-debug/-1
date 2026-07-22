import OpenAI from "openai";
import type { PlanTier } from "@/lib/constants";
import { formatDuration } from "@/lib/format";
import { normalizeSecret } from "@/lib/transcription-ready";
import {
  InternalServerError,
  normalizeApiError,
  type ApiError,
} from "@/shared/api";
import { failure, success, type Result } from "@/shared/lib/result";
import type { TimedWord, TranscriptionResult } from "../types";
import {
  buildAnalysisSystemPrompt,
  buildAnalysisUserPrompt,
} from "./analysis-prompts";

interface GptAnalysisPro {
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
  sentiment?: TranscriptionResult["sentiment"];
  chapters?: TranscriptionResult["chapters"];
  keyQuotes?: TranscriptionResult["keyQuotes"];
  risks?: TranscriptionResult["risks"];
  followUpEmail?: TranscriptionResult["followUpEmail"];
  markdownReport?: string;
}

export interface SttPayloadForAnalysis {
  fileName: string;
  plan: PlanTier;
  transcriptText: string;
  durationSeconds: number;
  transcript: TranscriptionResult["transcript"];
  timedWords?: TimedWord[];
  diarizationEnabled?: boolean;
}

function getOpenAIClient() {
  const apiKey = normalizeSecret(process.env.OPENAI_API_KEY);
  if (!apiKey) {
    throw new InternalServerError(
      "OPENAI_API_KEY is not configured. Add it to your .env.local file.",
    );
  }
  return new OpenAI({ apiKey });
}

/**
 * GPT-4o insights from an already-completed STT payload (Whisper or AssemblyAI).
 * Used by sync transcription and by the AssemblyAI webhook completion path.
 */
export async function analyzeTranscriptWithOpenAI(
  input: SttPayloadForAnalysis,
): Promise<Result<TranscriptionResult, ApiError>> {
  try {
    const isPro = input.plan === "pro";
    const openai = getOpenAIClient();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      temperature: 0.2,
      messages: [
        { role: "system", content: buildAnalysisSystemPrompt(isPro) },
        {
          role: "user",
          content: buildAnalysisUserPrompt(
            input.transcriptText,
            input.fileName,
            input.diarizationEnabled
              ? input.transcript.map((line) => ({
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
      fileName: input.fileName,
      duration: formatDuration(input.durationSeconds),
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
      transcript: input.transcript,
      ...(input.timedWords?.length ? { timedWords: input.timedWords } : {}),
      ...(input.diarizationEnabled ? { diarizationEnabled: true } : {}),
      ...(isPro && analysis.chapters?.length ? { chapters: analysis.chapters } : {}),
      ...(isPro && analysis.sentiment ? { sentiment: analysis.sentiment } : {}),
      ...(isPro && analysis.keyQuotes?.length ? { keyQuotes: analysis.keyQuotes } : {}),
      ...(isPro && analysis.risks?.length ? { risks: analysis.risks } : {}),
      ...(isPro && analysis.followUpEmail
        ? { followUpEmail: analysis.followUpEmail }
        : {}),
    });
  } catch (error) {
    return failure(normalizeApiError(error));
  }
}
