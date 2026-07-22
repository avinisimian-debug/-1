import OpenAI from "openai";
import { normalizeSecret } from "@/lib/transcription-ready";
import {
  BadRequestError,
  InternalServerError,
  normalizeApiError,
  type ApiError,
} from "@/shared/api";
import { failure, success, type Result } from "@/shared/lib/result";
import type { ChatCitation, ChatTranscriptResponse } from "../types";
import {
  buildChatSystemPrompt,
  buildChatUserPrompt,
  buildWorkspaceChatSystemPrompt,
} from "./chat-prompts";

const CHAT_MODEL = "gpt-4o-mini";

interface GptChatResponse {
  answer?: string;
  citations?: Array<{
    timestamp?: string;
    speaker?: string;
    quote?: string;
  }>;
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

function normalizeCitations(
  citations: GptChatResponse["citations"],
): ChatCitation[] {
  return (citations ?? [])
    .map((c) => ({
      timestamp: (c.timestamp ?? "").trim(),
      speaker: c.speaker?.trim() || undefined,
      quote: c.quote?.trim() || undefined,
    }))
    .filter((c) => Boolean(c.timestamp));
}

export async function chatWithTranscript(input: {
  transcriptText: string;
  fileName?: string;
  question: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}): Promise<Result<ChatTranscriptResponse, ApiError>> {
  try {
    const transcriptText = input.transcriptText.trim();
    const question = input.question.trim();
    if (!transcriptText) {
      return failure(new BadRequestError("Transcript text is empty."));
    }
    if (!question) {
      return failure(new BadRequestError("Question is required."));
    }

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      response_format: { type: "json_object" },
      temperature: 0.3,
      messages: [
        { role: "system", content: buildChatSystemPrompt() },
        {
          role: "user",
          content: buildChatUserPrompt({
            transcriptText,
            fileName: input.fileName,
            history: input.history ?? [],
            question,
          }),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return failure(new InternalServerError("Chat model returned no content."));
    }

    const parsed = JSON.parse(raw) as GptChatResponse;
    const answer = parsed.answer?.trim();
    if (!answer) {
      return failure(new InternalServerError("Chat response missing answer."));
    }

    return success({
      answer,
      citations: normalizeCitations(parsed.citations),
      model: CHAT_MODEL,
    });
  } catch (error) {
    return failure(normalizeApiError(error));
  }
}

export async function chatWithWorkspaceCorpus(input: {
  corpusText: string;
  question: string;
}): Promise<Result<ChatTranscriptResponse, ApiError>> {
  try {
    const corpusText = input.corpusText.trim();
    const question = input.question.trim();
    if (!corpusText) {
      return failure(new BadRequestError("Workspace corpus is empty."));
    }
    if (!question) {
      return failure(new BadRequestError("Question is required."));
    }

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      response_format: { type: "json_object" },
      temperature: 0.3,
      messages: [
        { role: "system", content: buildWorkspaceChatSystemPrompt() },
        {
          role: "user",
          content: `MEETING CORPUS:\n${corpusText.slice(0, 48_000)}\n\nQUESTION:\n${question}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return failure(new InternalServerError("Chat model returned no content."));
    }

    const parsed = JSON.parse(raw) as GptChatResponse;
    const answer = parsed.answer?.trim();
    if (!answer) {
      return failure(new InternalServerError("Chat response missing answer."));
    }

    return success({
      answer,
      citations: normalizeCitations(parsed.citations),
      model: CHAT_MODEL,
    });
  } catch (error) {
    return failure(normalizeApiError(error));
  }
}
