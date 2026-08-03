"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Copy,
  ListChecks,
  Loader2,
  Scale,
  Send,
  Sparkles,
} from "lucide-react";
import type { TranscriptionResult } from "@/features/transcription/types";
import { useTranscriptChat } from "@/features/chat/hooks/useTranscriptChat";
import { buildSummaryText, copyToClipboard } from "@/lib/export";
import { cn } from "@/lib/utils";
import { mapDecisionsToTimestamps } from "../lib/map-decision-timestamp";

type RailSection = "brief" | "decisions" | "actions" | "chat";

const SUGGESTIONS_HE = [
  "מה הוחלט?",
  "מה המשימות?",
  "טיוטת מייל לצוות",
];

interface AiAssistantRailProps {
  result: TranscriptionResult;
  onSeek: (timestamp: string) => void;
  defaultSection?: RailSection;
  className?: string;
}

export function AiAssistantRail({
  result,
  onSeek,
  defaultSection = "brief",
  className,
}: AiAssistantRailProps) {
  const [section, setSection] = useState<RailSection>(defaultSection);
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const { messages, loading, error, ask } = useTranscriptChat(result);

  const decisionList =
    result.decisions && result.decisions.length > 0
      ? result.decisions
      : result.summary.keyTakeaways;

  const decisionMoments = useMemo(
    () => mapDecisionsToTimestamps(decisionList, result.transcript),
    [decisionList, result.transcript],
  );

  const actionMoments = useMemo(
    () =>
      result.actionItems.map((a) => ({
        id: a.id,
        task: a.task,
        owner: a.owner,
        deadline: a.deadline,
        moment: mapDecisionsToTimestamps([a.task], result.transcript)[0],
      })),
    [result.actionItems, result.transcript],
  );

  const copyBrief = useCallback(async () => {
    const text = buildSummaryText(result);
    await copyToClipboard(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const send = useCallback(async () => {
    const q = input.trim();
    if (!q) return;
    setInput("");
    setSection("chat");
    await ask(q);
  }, [ask, input]);

  return (
    <aside
      className={cn(
        "lat-panel flex h-full min-h-0 flex-col overflow-hidden",
        className,
      )}
      aria-label="עוזר מנהלים"
    >
      <div className="flex items-center gap-2 border-b border-[var(--line-subtle)] px-3 py-2.5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--accent-soft)]">
          <Sparkles className="size-4 text-[var(--accent)]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--ink-primary)]">
            Staz · עוזר מנהלים
          </p>
          <p className="truncate text-[11px] text-[var(--ink-tertiary)]">
            תשובות מבוססות תמלול בלבד
          </p>
        </div>
        <button
          type="button"
          onClick={() => void copyBrief()}
          className="lat-btn-ghost !min-h-9 !px-2 text-xs"
        >
          <Copy className="size-3.5" />
          {copied ? "הועתק" : "העתק"}
        </button>
      </div>

      <div className="flex gap-1 border-b border-[var(--line-subtle)] px-2 py-1.5">
        {(
          [
            ["brief", "תמצית"],
            ["decisions", "החלטות"],
            ["actions", "משימות"],
            ["chat", "שאלו"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setSection(id)}
            className={cn(
              "flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition",
              section === id
                ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                : "text-[var(--ink-secondary)] hover:bg-[var(--bg-subtle)]",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {section === "brief" && (
          <div className="lat-fade-rise space-y-3">
            <h3 className="text-sm font-semibold text-[var(--ink-primary)]">
              תמצית מנהלים
            </h3>
            {result.headline ? (
              <p className="text-[15px] font-medium leading-relaxed text-[var(--ink-primary)]">
                {result.headline}
              </p>
            ) : null}
            <ul className="space-y-2.5">
              {result.summary.executive.map((line) => (
                <li
                  key={line}
                  className="text-sm leading-relaxed text-[var(--ink-secondary)]"
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )}

        {section === "decisions" && (
          <div className="lat-fade-rise space-y-2">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Scale className="size-4 text-[var(--accent)]" />
              החלטות
            </div>
            {decisionMoments.length === 0 ? (
              <p className="text-xs text-[var(--ink-tertiary)]">אין החלטות</p>
            ) : (
              decisionMoments.map((m) => (
                <div
                  key={m.decision}
                  className="rounded-xl border border-[var(--line-subtle)] bg-[var(--bg-subtle)] px-3 py-2.5 text-sm leading-relaxed"
                >
                  <p>{m.decision}</p>
                  <button
                    type="button"
                    onClick={() => onSeek(m.timestamp)}
                    className="lat-time-chip mt-2"
                    title={m.quote}
                  >
                    {m.timestamp} ↗
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {section === "actions" && (
          <div className="lat-fade-rise space-y-2">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <ListChecks className="size-4 text-[var(--accent)]" />
              משימות
            </div>
            {actionMoments.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-[var(--line-subtle)] px-3 py-2.5"
              >
                <p className="text-sm font-medium text-[var(--ink-primary)]">
                  {a.task}
                </p>
                <p className="mt-1 text-xs text-[var(--ink-tertiary)]">
                  {a.owner}
                  {a.deadline ? ` · ${a.deadline}` : ""}
                </p>
                {a.moment ? (
                  <button
                    type="button"
                    onClick={() => onSeek(a.moment.timestamp)}
                    className="lat-time-chip mt-2"
                  >
                    {a.moment.timestamp} ↗
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {section === "chat" && (
          <div className="flex min-h-[200px] flex-col gap-3">
            {messages.length === 0 && !loading ? (
              <div className="space-y-2">
                <p className="text-xs text-[var(--ink-tertiary)]">
                  שאלו על הפגישה — התשובה תקושר לרגע בתמלול
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS_HE.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={loading}
                      onClick={() => void ask(s)}
                      className="rounded-full border border-[var(--line-strong)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs font-medium text-[var(--ink-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ms-6 bg-[var(--brand-ink)] text-[var(--ink-inverse)]"
                    : "me-2 border border-[var(--line-subtle)] bg-[var(--bg-subtle)]",
                )}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
                {m.citations && m.citations.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.citations.map((c) => (
                      <button
                        key={`${c.timestamp}-${c.quote}`}
                        type="button"
                        onClick={() => onSeek(c.timestamp)}
                        className="lat-time-chip"
                        title={c.quote}
                      >
                        {c.timestamp} ↗
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {loading ? (
              <div className="flex items-center gap-2 text-xs text-[var(--ink-tertiary)]">
                <Loader2 className="size-3.5 animate-spin" />
                Staz חושב…
              </div>
            ) : null}
            {error ? (
              <p className="text-xs text-[var(--danger)]">{error}</p>
            ) : null}
          </div>
        )}
      </div>

      <div className="border-t border-[var(--line-subtle)] p-2.5">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setSection("chat")}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            rows={2}
            placeholder="שאלו על הפגישה…"
            className="min-h-[44px] flex-1 resize-none rounded-xl border border-[var(--line-strong)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)]"
          />
          <button
            type="button"
            disabled={loading || !input.trim()}
            onClick={() => void send()}
            className="lat-btn-primary !min-h-11 !px-3 disabled:opacity-40"
            aria-label="שליחה"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
