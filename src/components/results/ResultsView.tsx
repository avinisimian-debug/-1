"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  CheckSquare,
  Clock,
  Copy,
  FileText,
  ListChecks,
  Search,
  Sparkles,
  User,
} from "lucide-react";
import { ReportDownloadPicker } from "@/components/results/ReportDownloadPicker";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { buildSummaryText, buildTranscriptText, copyToClipboard } from "@/lib/export";
import { hasFeature } from "@/lib/plan-features";
import type { ActionItem, TranscriptionResult } from "@/lib/types";
import { cn } from "@/lib/utils";

type TabKey = "summary" | "actions" | "chapters" | "transcript";

interface ResultsViewProps {
  result: TranscriptionResult;
  onReset: () => void;
}

const SENTIMENT_COLORS = {
  positive: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  neutral: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
  mixed: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  negative: "border-red-500/30 bg-red-500/10 text-red-400",
};

const PRIORITY_STYLES = {
  high: "bg-red-500/15 text-red-400 border-red-500/25",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  low: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
};

export function ResultsView({ result, onReset }: ResultsViewProps) {
  const { t } = useLocale();
  const { plan } = usePlan();
  const [activeTab, setActiveTab] = useState<TabKey>("summary");
  const [actionItems, setActionItems] = useState(result.actionItems);
  const [copied, setCopied] = useState(false);

  const showChapters =
    hasFeature(plan, "meetingChapters") && (result.chapters?.length ?? 0) > 0;

  const tabs: { key: TabKey; label: string; icon: typeof Sparkles }[] = [
    { key: "summary", label: t.resSummary, icon: Sparkles },
    { key: "actions", label: t.resActions, icon: ListChecks },
    ...(showChapters
      ? [{ key: "chapters" as const, label: t.resChapters, icon: BookOpen }]
      : []),
    { key: "transcript", label: t.resTranscript, icon: FileText },
  ];

  const toggleActionItem = (id: string) => {
    setActionItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  const handleCopySummary = async () => {
    const ok = await copyToClipboard(buildSummaryText(result));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const pdfLabels = {
    brand: t.pdfBrand,
    tagline: t.pdfTagline,
    duration: t.pdfDurationLabel,
    processed: t.pdfProcessedLabel,
    overview: t.resOverview,
    executive: t.resExecutive,
    takeaways: t.resTakeaways,
    actions: t.resActions,
    transcript: t.resTranscript,
    owner: t.pdfOwner,
    deadline: t.pdfDeadline,
    completed: t.resCompleted,
    pending: t.pdfPending,
    generatedBy: t.pdfGeneratedBy,
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400/80">
            {t.resComplete}
          </p>
          <h2
            className="mt-1 text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            {result.fileName}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-violet-400" />
              {result.duration}
            </span>
            <span className="text-zinc-700">·</span>
            <span>
              {t.resProcessed} {result.processedAt}
            </span>
            {hasFeature(plan, "sentimentAnalysis") && result.sentiment && (
              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                  SENTIMENT_COLORS[result.sentiment.overall],
                )}
              >
                {result.sentiment.label}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex flex-wrap gap-2">
            {hasFeature(plan, "copyToClipboard") && (
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white"
              >
                <Copy className="h-3.5 w-3.5 text-violet-400" />
                {copied ? t.resCopied : t.resCopySummary}
              </button>
            )}
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white"
            >
              {t.resNewUpload}
            </button>
          </div>
          <ReportDownloadPicker
            result={result}
            actionItems={actionItems}
            pdfLabels={pdfLabels}
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="flex overflow-x-auto border-b border-white/[0.06]">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={cn(
                "flex shrink-0 items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-all",
                activeTab === key
                  ? "border-b-2 border-amber-400 bg-amber-500/5 text-amber-300"
                  : "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="p-5 sm:p-6">
          {activeTab === "summary" && (
            <SummaryTab result={result} plan={plan} />
          )}
          {activeTab === "actions" && (
            <ActionItemsTab
              items={actionItems}
              onToggle={toggleActionItem}
              showPriority={hasFeature(plan, "actionPriorities")}
              t={t}
            />
          )}
          {activeTab === "chapters" && result.chapters && (
            <ChaptersTab chapters={result.chapters} />
          )}
          {activeTab === "transcript" && (
            <TranscriptTab
              entries={result.transcript}
              onCopy={async () => copyToClipboard(buildTranscriptText(result))}
              t={t}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryTab({
  result,
  plan,
}: {
  result: TranscriptionResult;
  plan: "free" | "pro";
}) {
  const { t } = useLocale();
  return (
    <div className="space-y-8">
      {hasFeature(plan, "sentimentAnalysis") && result.sentiment && (
        <section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {t.resSentiment}
          </p>
          <p className="mt-2 text-sm text-zinc-300">{result.sentiment.description}</p>
        </section>
      )}
      {result.summary.overview && (
        <section>
          <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            <FileText className="h-4 w-4 text-amber-400" />
            {t.resOverview}
          </h3>
          <div className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-5">
            {result.summary.overview.split("\n").filter(Boolean).map((para, i) => (
              <p
                key={i}
                className={cn("text-sm leading-relaxed text-zinc-300", i > 0 && "mt-4")}
              >
                {para}
              </p>
            ))}
          </div>
        </section>
      )}
      <section>
        <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          <Sparkles className="h-4 w-4 text-amber-400" />
          {t.resExecutive}
        </h3>
        <ul className="space-y-3">
          {result.summary.executive.map((point, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-zinc-300">
              <span className="mt-2 h-1 w-4 shrink-0 rounded-full bg-gradient-to-r from-violet-500 to-amber-400" />
              {point}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          <CheckSquare className="h-4 w-4 text-violet-400" />
          {t.resTakeaways}
        </h3>
        <ul className="space-y-3">
          {result.summary.keyTakeaways.map((point, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3.5 text-sm leading-relaxed text-zinc-300"
            >
              <span className="font-mono text-xs font-bold text-amber-400/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              {point}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ChaptersTab({
  chapters,
}: {
  chapters: NonNullable<TranscriptionResult["chapters"]>;
}) {
  return (
    <ul className="space-y-2">
      {chapters.map((ch, i) => (
        <li
          key={i}
          className="flex items-center gap-4 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3.5 transition-colors hover:border-violet-500/20"
        >
          <span className="w-14 shrink-0 font-mono text-sm font-semibold text-amber-400">
            {ch.timestamp}
          </span>
          <span className="text-sm text-zinc-300">{ch.title}</span>
        </li>
      ))}
    </ul>
  );
}

function ActionItemsTab({
  items,
  onToggle,
  showPriority,
  t,
}: {
  items: ActionItem[];
  onToggle: (id: string) => void;
  showPriority: boolean;
  t: ReturnType<typeof useLocale>["t"];
}) {
  const completedCount = items.filter((i) => i.completed).length;
  const priorityLabel = {
    high: t.resPriorityHigh,
    medium: t.resPriorityMedium,
    low: t.resPriorityLow,
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          {completedCount} / {items.length} {t.resCompleted}
        </p>
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-400 transition-all"
            style={{ width: `${(completedCount / items.length) * 100}%` }}
          />
        </div>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <label
              className={cn(
                "flex cursor-pointer items-start gap-4 rounded-xl border px-4 py-4 transition-all",
                item.completed
                  ? "border-white/[0.03] bg-white/[0.01] opacity-60"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-violet-500/20",
              )}
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => onToggle(item.id)}
                className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-600 bg-zinc-900 text-violet-600"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      item.completed ? "text-zinc-500 line-through" : "text-zinc-200",
                    )}
                  >
                    {item.task}
                  </p>
                  {showPriority && item.priority && (
                    <span
                      className={cn(
                        "rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                        PRIORITY_STYLES[item.priority],
                      )}
                    >
                      {priorityLabel[item.priority]}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {item.owner}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.deadline}
                  </span>
                </div>
              </div>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TranscriptTab({
  entries,
  onCopy,
  t,
}: {
  entries: TranscriptionResult["transcript"];
  onCopy: () => Promise<boolean>;
  t: ReturnType<typeof useLocale>["t"];
}) {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return entries;
    const q = query.toLowerCase();
    return entries.filter(
      (e) =>
        e.text.toLowerCase().includes(q) ||
        e.speaker.toLowerCase().includes(q),
    );
  }, [entries, query]);

  const handleCopy = async () => {
    const ok = await onCopy();
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.resSearchTranscript}
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2 ps-9 pe-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:border-violet-500/40 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white"
        >
          <Copy className="h-3.5 w-3.5" />
          {copied ? t.resCopied : t.resCopySummary}
        </button>
      </div>
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">{t.resNoResults}</p>
      ) : (
        <div className="max-h-[28rem] space-y-1 overflow-y-auto pe-2">
          {filtered.map((entry, i) => (
            <div
              key={i}
              className="group flex gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.03]"
            >
              <span className="w-12 shrink-0 font-mono text-xs text-amber-400/70">
                {entry.timestamp}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-violet-400/80">{entry.speaker}</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-300">{entry.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
