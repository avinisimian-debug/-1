"use client";

import { useCallback, useRef, useState } from "react";
import { Loader2, MessageSquare, Send, Sparkles, X } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import type { TranscriptionResult } from "@/features/transcription/types";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import { useTranscriptChat } from "../hooks/useTranscriptChat";
import { CHAT_PROMPT_PRESETS } from "../types";

interface TranscriptChatPanelProps {
  result: TranscriptionResult;
  onCiteSeek: (timestamp: string) => void;
  className?: string;
}

export function TranscriptChatPanel({
  result,
  onCiteSeek,
  className,
}: TranscriptChatPanelProps) {
  const { t } = useLocale();
  const { messages, loading, error, ask, clear } = useTranscriptChat(result);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const submit = useCallback(async () => {
    const q = input.trim();
    if (!q) return;
    setInput("");
    await ask(q);
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [ask, input]);

  return (
    <aside
      className={cn(
        "flex h-full min-h-[420px] max-h-[min(70vh,720px)] flex-col overflow-hidden rounded-xl border border-border/80 bg-card/80 shadow-sm backdrop-blur-xl",
        className,
      )}
      aria-label={t.chatTitle}
    >
      <div className="flex items-center justify-between border-b border-border/70 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-muted">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">{t.chatTitle}</p>
            <p className="text-[10px] text-muted-foreground">{t.chatSubtitle}</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={t.chatClear}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 border-b border-border/60 px-3 py-2">
        {CHAT_PROMPT_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            disabled={loading}
            onClick={() => ask(preset.prompt)}
            className="rounded-full border border-border bg-background/80 px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:border-accent/30 hover:bg-accent-muted hover:text-accent disabled:opacity-50"
          >
            {t[preset.labelKey]}
          </button>
        ))}
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
        {messages.length === 0 && !loading && (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">{t.chatEmpty}</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "rounded-xl px-3 py-2 text-sm leading-relaxed",
              msg.role === "user"
                ? "ms-6 bg-foreground text-background"
                : "me-2 border border-border/70 bg-muted/40 text-foreground",
            )}
          >
            <p className="whitespace-pre-wrap text-[13px]">{msg.content}</p>
            {msg.citations && msg.citations.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {msg.citations.map((cite, i) => (
                  <button
                    key={`${cite.timestamp}-${i}`}
                    type="button"
                    onClick={() => onCiteSeek(cite.timestamp)}
                    className="inline-flex items-center gap-1 rounded-md border border-accent/25 bg-accent-muted px-2 py-0.5 font-mono text-[10px] font-medium text-accent transition-colors hover:bg-accent/15"
                    title={cite.quote ?? cite.speaker}
                  >
                    {cite.timestamp}
                    {cite.speaker ? ` · ${cite.speaker}` : ""}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
            {t.chatThinking}
          </div>
        )}

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}
      </div>

      <div className="border-t border-border/70 p-2.5">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void submit();
              }
            }}
            rows={2}
            placeholder={t.chatPlaceholder}
            className="min-h-[2.5rem] flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            disabled={loading}
          />
          <Button
            type="button"
            size="icon"
            onClick={() => void submit()}
            disabled={loading || !input.trim()}
            aria-label={t.chatSend}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
