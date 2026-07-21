import { AssemblyAI } from "assemblyai";
import OpenAI from "openai";
import { formatDuration } from "@/lib/format";
import { hasFeature } from "@/lib/plan-features";
import type { PlanTier } from "@/lib/constants";
import {
  BadRequestError,
  InternalServerError,
  normalizeApiError,
  type ApiError,
} from "@/shared/api";
import { failure, success, type Result } from "@/shared/lib/result";
import type { TranscriptionResult } from "../types";
import {
  buildAnalysisSystemPrompt,
  buildAnalysisUserPrompt,
} from "./analysis-prompts";
import type { DiarizationUtterance } from "./align-speakers";
import { utterancesToTranscript } from "./align-speakers";
import { isDiarizationConfigured } from "./diarize-audio";
import {
  attachWordsToEntries,
  mapAssemblyAIWordsToTimedWords,
} from "./build-word-timestamps";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new InternalServerError("OPENAI_API_KEY is not configured.");
  }
  return new OpenAI({ apiKey });
}

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
      ...(languageCode ? { language_code: languageCode } : {}),
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

    let timedWords =
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
            text,
            "remote-url",
            lines.map((l) => ({ speaker: l.speaker, text: l.text })),
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

    const analysis = JSON.parse(rawAnalysis) as {
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
    };

    const host = (() => {
      try {
        return new URL(input.url).hostname.replace(/^www\./, "");
      } catch {
        return "link";
      }
    })();

    return success({
      fileName: `link-${host}`,
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
      transcript: lines,
      ...(timedWords.length > 0 ? { timedWords } : {}),
      ...(utterances.length > 0 ? { diarizationEnabled: true } : {}),
      ...(isPro && analysis.chapters?.length ? { chapters: analysis.chapters } : {}),
      ...(isPro && analysis.sentiment ? { sentiment: analysis.sentiment } : {}),
      ...(isPro && analysis.keyQuotes?.length
        ? { keyQuotes: analysis.keyQuotes }
        : {}),
      ...(isPro && analysis.risks?.length ? { risks: analysis.risks } : {}),
      ...(isPro && analysis.followUpEmail
        ? { followUpEmail: analysis.followUpEmail }
        : {}),
    });
  } catch (error) {
    return failure(normalizeApiError(error));
  }
}
