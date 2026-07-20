"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, MessageCircle, Sparkles, X } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { getHistory } from "@/lib/history-store";
import { buildTimestampedTranscriptText } from "@/features/chat/lib/transcript-context";
import type { ChatTranscriptResponse } from "@/features/chat/types";
import type { ApiResponse } from "@/shared/api";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";

export function GlobalAiAssistant() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("stazai:open-global-ai", onOpen);
    return () => window.removeEventListener("stazai:open-global-ai", onOpen);
  }, []);

  const ask = useCallback(async () => {
    const q = question.trim();
    if (!q || loading) return;

    const history = getHistory();
    if (history.length === 0) {
      setError(t.globalAiEmptyHistory);
      return;
    }

    const corpus = history
      .slice(0, 12)
      .map((entry) => {
        const text = buildTimestampedTranscriptText(entry.result);
        return `### ${entry.result.fileName}\n${text.slice(0, 4000)}`;
      })
      .join("\n\n");

    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const res = await fetch("/api/chat/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ corpusText: corpus, question: q }),
      });
      const body = (await res.json()) as ApiResponse<ChatTranscriptResponse>;
      if (!res.ok || !body.data) {
        throw new Error(body.error?.message ?? "Request failed");
      }
      setAnswer(body.data.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }, [question, loading, t.globalAiEmptyHistory]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 end-5 z-[90] flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg ring-1 ring-accent/30 transition-transform hover:scale-105"
        aria-label={t.globalAiTitle}
      >
        <MessageCircle className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-end bg-background/50 p-4 backdrop-blur-sm sm:items-center sm:p-8"
          onClick={() => setOpen(false)}
        >
          <div
            className={cn(
              "glass-card flex w-full max-w-md flex-col overflow-hidden shadow-lg animate-fade-in-up",
            )}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={t.globalAiTitle}
          >
            <div className="flex items-start justify-between border-b border-border px-4 py-3">
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 text-accent" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.globalAiTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.globalAiSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 p-4">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                placeholder={t.globalAiPlaceholder}
                className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              />
              <Button
                type="button"
                onClick={() => void ask()}
                disabled={loading || !question.trim()}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t.globalAiAsk
                )}
              </Button>
              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}
              {answer && (
                <div className="max-h-64 overflow-y-auto rounded-lg border border-border bg-muted/30 p-3 text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                  {answer}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
