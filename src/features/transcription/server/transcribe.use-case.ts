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
import type { TranscriptionResult } from "../types";
import { prepareAudioForWhisper } from "./prepare-audio";

interface GptAnalysisBase {
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
}

export interface TranscribeInput {
  file: File;
  plan: PlanTier;
  language?: string | null;
}

function buildAnalysisPrompt(isPro: boolean): string {
  if (isPro) {
    return `You are an expert meeting analyst and executive communications specialist. Analyze the meeting transcript and return a JSON object with this exact structure:
{
  "overview": "2-3 polished paragraphs synthesizing the meeting at an executive level",
  "executive": ["bullet point 1", "bullet point 2"],
  "keyTakeaways": ["takeaway 1", "takeaway 2"],
  "sentiment": { "overall": "positive|neutral|mixed|negative", "label": "2-3 word mood label", "description": "one sentence about the meeting tone" },
  "chapters": [{ "timestamp": "MM:SS", "title": "chapter title describing this section" }],
  "actionItems": [
    { "task": "description", "owner": "person name or Unassigned", "deadline": "date or TBD", "priority": "high|medium|low" }
  ]
}
Write in the same language as the transcript. Provide overview, 5-7 executive bullets, 4-6 takeaways, 4-8 chapters with timestamps, sentiment analysis, and all action items with priority. Use "Unassigned" or "TBD" when needed.`;
  }

  return `You are an expert meeting analyst. Analyze the meeting transcript and return a JSON object with this exact structure:
{
  "overview": "2-3 polished paragraphs synthesizing the meeting",
  "executive": ["bullet point 1", "bullet point 2"],
  "keyTakeaways": ["takeaway 1", "takeaway 2"],
  "actionItems": [
    { "task": "description", "owner": "person name or Unassigned", "deadline": "date or TBD" }
  ]
}
Write in the same language as the transcript. Provide overview, 5-7 executive bullets, 4-6 takeaways, and all action items.`;
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
            : `File exceeds the ${limitLabel} limit.`,
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

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "verbose_json",
      ...(isPro && language && language !== "auto" ? { language } : {}),
    });

    const segments = transcription.segments ?? [];
    const transcriptText = transcription.text?.trim() ?? "";

    const durationSeconds =
      segments.length > 0 ? segments[segments.length - 1].end : 0;

    const transcript =
      segments.length > 0
        ? segments.map((segment) => ({
            timestamp: formatTimestamp(segment.start),
            speaker: "Speaker",
            text: segment.text.trim(),
          }))
        : transcriptText
          ? [{ timestamp: "00:00", speaker: "Speaker", text: transcriptText }]
          : [];

    if (!transcriptText) {
      return failure(
        new InternalServerError("Whisper returned an empty transcript."),
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: buildAnalysisPrompt(isPro),
        },
        {
          role: "user",
          content: `Analyze this meeting transcript:\n\n${transcriptText}`,
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
      summary: {
        overview: analysis.overview?.trim() ?? "",
        executive: analysis.executive ?? [],
        keyTakeaways: analysis.keyTakeaways ?? [],
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
      ...(isPro && analysis.chapters?.length ? { chapters: analysis.chapters } : {}),
      ...(isPro && analysis.sentiment ? { sentiment: analysis.sentiment } : {}),
    });
  } catch (error) {
    return failure(normalizeApiError(error));
  }
}
