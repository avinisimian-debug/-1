import OpenAI from "openai";
import type { PlanTier } from "@/lib/constants";
import { formatDuration } from "@/lib/format";
import { normalizeSecret } from "@/lib/transcription-ready";
import {
  InternalServerError,
  type ApiError,
} from "@/shared/api";
import { failure, success, type Result } from "@/shared/lib/result";
import type { TimedWord, TranscriptionResult } from "../types";
import {
  buildAnalysisSystemPrompt,
  buildAnalysisUserPrompt,
  detectTranscriptLanguageHint,
  type AnalysisTranscriptLine,
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

/** Keep GPT prompts under model limits for long international meetings. */
const MAX_ANALYSIS_CHARS = 90_000;
const MAX_ANALYSIS_CHARS_RETRY = 45_000;

function getOpenAIClient() {
  const apiKey = normalizeSecret(process.env.OPENAI_API_KEY);
  if (!apiKey) {
    throw new InternalServerError(
      "OPENAI_API_KEY is not configured. Add it to your .env.local file.",
    );
  }
  return new OpenAI({ apiKey });
}

function isHebrewCloseout(text: string): boolean {
  return detectTranscriptLanguageHint(text) === "he";
}

function normalizeOwner(owner: string | undefined, hebrew: boolean): string {
  const raw = (owner ?? "").trim();
  if (!raw) return hebrew ? "לא צוין" : "Unassigned";
  const lower = raw.toLowerCase();
  if (
    lower === "unassigned" ||
    lower === "unknown" ||
    lower === "n/a" ||
    raw === "לא ידוע" ||
    raw === "לא צוין"
  ) {
    return hebrew ? "לא צוין" : "Unassigned";
  }
  return raw;
}

function normalizeDeadline(deadline: string | undefined, hebrew: boolean): string {
  const raw = (deadline ?? "").trim();
  if (!raw) return hebrew ? "לא צוין" : "TBD";
  const lower = raw.toLowerCase();
  if (lower === "tbd" || lower === "n/a" || raw === "לא צוין") {
    return hebrew ? "לא צוין" : "TBD";
  }
  return raw;
}

function cleanBulletList(items: string[] | undefined, max = 8): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items ?? []) {
    const t = item.replace(/\s+/g, " ").trim();
    if (t.length < 3) continue;
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
    if (out.length >= max) break;
  }
  return out;
}

function validateChapters(
  chapters: TranscriptionResult["chapters"] | undefined,
  transcript: TranscriptionResult["transcript"],
): TranscriptionResult["chapters"] | undefined {
  if (!chapters?.length || !transcript.length) return undefined;
  const allowed = new Set(transcript.map((l) => l.timestamp));
  const cleaned = chapters
    .map((c) => ({
      timestamp: (c.timestamp ?? "").trim(),
      title: (c.title ?? "").trim(),
    }))
    .filter((c) => c.title && allowed.has(c.timestamp));
  return cleaned.length ? cleaned : undefined;
}

function validateKeyQuotes(
  quotes: TranscriptionResult["keyQuotes"] | undefined,
  transcript: TranscriptionResult["transcript"],
): TranscriptionResult["keyQuotes"] | undefined {
  if (!quotes?.length || !transcript.length) return undefined;
  const blob = transcript.map((l) => l.text).join("\n");
  const cleaned = quotes
    .map((q) => ({
      quote: (q.quote ?? "").trim(),
      context: (q.context ?? "").trim(),
    }))
    .filter((q) => {
      if (q.quote.length < 8) return false;
      const needle = q.quote.slice(0, Math.min(24, q.quote.length));
      return blob.includes(needle) || blob.includes(q.quote);
    });
  return cleaned.length ? cleaned : undefined;
}

function truncateLinesForAnalysis(
  lines: AnalysisTranscriptLine[],
  maxChars: number,
): AnalysisTranscriptLine[] {
  const out: AnalysisTranscriptLine[] = [];
  let used = 0;
  for (const line of lines) {
    const cost = (line.timestamp?.length ?? 0) + line.speaker.length + line.text.length + 12;
    if (out.length > 0 && used + cost > maxChars) break;
    out.push(line);
    used += cost;
  }
  return out.length > 0 ? out : lines.slice(0, Math.min(40, lines.length));
}

function buildPartialCloseout(
  input: SttPayloadForAnalysis,
  hebrew: boolean,
): TranscriptionResult {
  const snippets = input.transcript
    .map((l) => l.text.trim())
    .filter((t) => t.length > 20)
    .slice(0, 6);

  const overview = snippets.slice(0, 2).join(" ");
  const executive = snippets.slice(0, 5).map((s) =>
    s.length > 140 ? `${s.slice(0, 137)}…` : s,
  );

  return {
    fileName: input.fileName,
    duration: formatDuration(input.durationSeconds),
    processedAt: new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    headline: hebrew
      ? "התמלול מוכן — התמצית המלאה לא הושלמה"
      : "Transcript ready — full brief incomplete",
    summary: {
      overview:
        overview ||
        (hebrew
          ? "התמלול נשמר. נסו שוב את הניתוח או קובץ קצר יותר."
          : "Transcript saved. Retry analysis or use a shorter file."),
      executive:
        executive.length > 0
          ? executive
          : [
              hebrew
                ? "התמלול זמין למטה. הניתוח האוטומטי נכשל זמנית."
                : "Transcript is available below. Automatic analysis failed temporarily.",
            ],
      keyTakeaways: [],
    },
    decisions: [],
    actionItems: [],
    transcript: input.transcript,
    ...(input.timedWords?.length ? { timedWords: input.timedWords } : {}),
    ...(input.diarizationEnabled ? { diarizationEnabled: true } : {}),
  };
}

function mapAnalysisToResult(
  input: SttPayloadForAnalysis,
  analysis: GptAnalysisPro,
  hebrew: boolean,
): TranscriptionResult {
  const isPro = input.plan === "pro";
  const chapters = isPro
    ? validateChapters(analysis.chapters, input.transcript)
    : undefined;
  const keyQuotes = isPro
    ? validateKeyQuotes(analysis.keyQuotes, input.transcript)
    : undefined;

  return {
    fileName: input.fileName,
    duration: formatDuration(input.durationSeconds),
    processedAt: new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    ...(analysis.headline?.trim() ? { headline: analysis.headline.trim() } : {}),
    ...(analysis.topics?.length ? { topics: cleanBulletList(analysis.topics, 6) } : {}),
    ...(analysis.decisions?.length
      ? { decisions: cleanBulletList(analysis.decisions, 8) }
      : {}),
    summary: {
      overview: analysis.overview?.trim() ?? "",
      executive: cleanBulletList(analysis.executive, 8),
      keyTakeaways: cleanBulletList(analysis.keyTakeaways, 8),
      ...(analysis.markdownReport?.trim()
        ? { markdown: analysis.markdownReport.trim() }
        : {}),
    },
    actionItems: (analysis.actionItems ?? [])
      .map((item) => ({
        task: (item.task ?? "").replace(/\s+/g, " ").trim(),
        owner: normalizeOwner(item.owner, hebrew),
        deadline: normalizeDeadline(item.deadline, hebrew),
        priority: item.priority,
      }))
      .filter((item) => item.task.length >= 3)
      .slice(0, 12)
      .map((item, index) => ({
        id: String(index + 1),
        task: item.task,
        owner: item.owner,
        deadline: item.deadline,
        completed: false,
        ...(isPro && item.priority ? { priority: item.priority } : {}),
      })),
    transcript: input.transcript,
    ...(input.timedWords?.length ? { timedWords: input.timedWords } : {}),
    ...(input.diarizationEnabled ? { diarizationEnabled: true } : {}),
    ...(chapters?.length ? { chapters } : {}),
    ...(isPro && analysis.sentiment ? { sentiment: analysis.sentiment } : {}),
    ...(keyQuotes?.length ? { keyQuotes } : {}),
    ...(isPro && analysis.risks?.length ? { risks: analysis.risks } : {}),
    ...(isPro && analysis.followUpEmail
      ? { followUpEmail: analysis.followUpEmail }
      : {}),
  };
}

async function runGptAnalysis(options: {
  model: string;
  isPro: boolean;
  fileName: string;
  lines: AnalysisTranscriptLine[];
  transcriptText: string;
  maxChars: number;
}): Promise<GptAnalysisPro> {
  const openai = getOpenAIClient();
  const truncated = truncateLinesForAnalysis(options.lines, options.maxChars);
  const completion = await openai.chat.completions.create({
    model: options.model,
    response_format: { type: "json_object" },
    temperature: 0.15,
    messages: [
      { role: "system", content: buildAnalysisSystemPrompt(options.isPro) },
      {
        role: "user",
        content: buildAnalysisUserPrompt(
          options.transcriptText.slice(0, options.maxChars),
          options.fileName,
          truncated,
        ),
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new InternalServerError("GPT did not return an analysis.");
  }
  return JSON.parse(raw) as GptAnalysisPro;
}

/**
 * GPT closeout from STT payload.
 * Retries with a smaller model / shorter context; never loses the transcript.
 */
export async function analyzeTranscriptWithOpenAI(
  input: SttPayloadForAnalysis,
): Promise<Result<TranscriptionResult, ApiError>> {
  const corpus =
    input.transcript.map((l) => l.text).join(" ") || input.transcriptText;
  const hebrew = isHebrewCloseout(corpus);
  const isPro = input.plan === "pro";
  const lines: AnalysisTranscriptLine[] = input.transcript.map((line) => ({
    timestamp: line.timestamp,
    speaker: line.speaker,
    text: line.text,
  }));

  if (!input.transcriptText.trim() && input.transcript.length === 0) {
    return failure(new InternalServerError("Empty transcript — nothing to analyze."));
  }

  const attempts: Array<{ model: string; maxChars: number }> = [
    { model: "gpt-4o", maxChars: MAX_ANALYSIS_CHARS },
    { model: "gpt-4o", maxChars: MAX_ANALYSIS_CHARS_RETRY },
    { model: "gpt-4o-mini", maxChars: MAX_ANALYSIS_CHARS_RETRY },
  ];

  let lastError: unknown;
  for (const attempt of attempts) {
    try {
      const analysis = await runGptAnalysis({
        model: attempt.model,
        isPro,
        fileName: input.fileName,
        lines,
        transcriptText: input.transcriptText,
        maxChars: attempt.maxChars,
      });

      const result = mapAnalysisToResult(input, analysis, hebrew);
      // Require at least some executive content; otherwise retry.
      if (result.summary.executive.length === 0 && !result.summary.overview) {
        throw new Error("Empty analysis payload");
      }
      return success(result);
    } catch (error) {
      lastError = error;
      console.error(
        `[analyze] ${attempt.model}/${attempt.maxChars} failed:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  // Soft success: keep transcript so the user is not stuck on a hard failure.
  console.error(
    "[analyze] all GPT attempts failed; returning partial closeout",
    lastError instanceof Error ? lastError.message : lastError,
  );
  return success(buildPartialCloseout(input, hebrew));
}

/** Exported for unit tests. */
export const __analyzeTestUtils = {
  truncateLinesForAnalysis,
  buildPartialCloseout,
};
