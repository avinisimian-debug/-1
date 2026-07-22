import OpenAI from "openai";
import { normalizeSecret } from "@/lib/transcription-ready";
import {
  BadRequestError,
  InternalServerError,
  normalizeApiError,
  type ApiError,
} from "@/shared/api";
import { failure, success, type Result } from "@/shared/lib/result";
import type { AiInsights, GenerateInsightsInput } from "../types";
import { buildInsightsPrompt, buildInsightsUserPrompt } from "./insights-prompts";

const INSIGHTS_MODEL = "gpt-4o-mini";

interface GptInsightsResponse {
  executiveSummary?: string;
  actionItems?: string[];
  topics?: string[];
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

export async function generateAiInsights({
  transcriptText,
  fileName,
}: GenerateInsightsInput): Promise<Result<AiInsights, ApiError>> {
  try {
    const trimmed = transcriptText.trim();
    if (!trimmed) {
      return failure(new BadRequestError("Transcript text is empty."));
    }

    const openai = getOpenAIClient();

    const completion = await openai.chat.completions.create({
      model: INSIGHTS_MODEL,
      response_format: { type: "json_object" },
      temperature: 0.3,
      messages: [
        { role: "system", content: buildInsightsPrompt() },
        {
          role: "user",
          content: buildInsightsUserPrompt(trimmed, fileName),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return failure(
        new InternalServerError("AI Insights model returned no content."),
      );
    }

    const parsed = JSON.parse(raw) as GptInsightsResponse;

    const executiveSummary = parsed.executiveSummary?.trim();
    if (!executiveSummary) {
      return failure(
        new InternalServerError("AI Insights response missing executive summary."),
      );
    }

    return success({
      executiveSummary,
      actionItems: (parsed.actionItems ?? [])
        .map((item) => item.trim())
        .filter(Boolean),
      topics: (parsed.topics ?? []).map((t) => t.trim()).filter(Boolean),
      generatedAt: new Date().toISOString(),
      model: INSIGHTS_MODEL,
    });
  } catch (error) {
    return failure(normalizeApiError(error));
  }
}
