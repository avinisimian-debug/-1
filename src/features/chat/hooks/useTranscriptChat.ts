"use client";

import { useCallback, useState } from "react";
import type { TranscriptionResult } from "@/features/transcription/types";
import type { ApiResponse } from "@/shared/api";
import { buildTimestampedTranscriptText } from "../lib/transcript-context";
import type { ChatMessage, ChatTranscriptResponse } from "../types";

export function useTranscriptChat(result: TranscriptionResult) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || loading) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);
      setError(null);

      try {
        const history = [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch("/api/chat/transcript", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcriptText: buildTimestampedTranscriptText(result),
            fileName: result.fileName,
            question: trimmed,
            history: history.slice(0, -1),
          }),
        });

        const body = (await res.json()) as ApiResponse<ChatTranscriptResponse>;
        if (!res.ok || !body.data) {
          throw new Error(body.error?.message ?? "Chat failed.");
        }

        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: body.data.answer,
          citations: body.data.citations,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Chat failed. Please try again.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, result],
  );

  const clear = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, ask, clear };
}
