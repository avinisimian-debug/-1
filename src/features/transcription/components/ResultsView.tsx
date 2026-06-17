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
import { LockedTab } from "@/components/billing/LockedFeatureTrigger";
import { useFeatureGate } from "@/context/FeatureGateContext";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { buildSummaryText, buildTranscriptText, copyToClipboard } from "@/lib/export";
import { hasFeature } from "@/lib/plan-features";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import type { ActionItem, TranscriptionResult } from "../types";
import { ReportDownloadPicker } from "./ReportDownloadPicker";

type TabKey = "summary" | "actions" | "chapters" | "transcript";

interface ResultsViewProps {
  result: TranscriptionResult;
  onReset: () => void;
}

const SENTIMENT_COLORS = {
  positive: "border-emerald-200 bg-emerald-50 text-emerald-700",
  neutral: "border-zinc-200 bg-zinc-50 text-zinc-600",
  mixed: "border-amber-200 bg-amber-50 text-amber-700",
  negative: "border-red-200 bg-red-50 text-red-700",
};

const PRIORITY_STYLES = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-zinc-50 text-zinc-500 border-zinc-200",
};

export function ResultsView({ result, onReset }: ResultsViewProps) {
  const { t } = useLocale();
  const { plan } = usePlan();
  const { promptUpgrade } = useFeatureGate();
  const [activeTab, setActiveTab] = useState<TabKey>("summary");
  const [actionItems, setActionItems] = useState(result.actionItems);
  const [copied, setCopied] = useState(false);

  const hasChaptersData = (result.chapters?.length ?? 0) > 0;
  const showChapters =
    hasFeature(plan, "meetingChapters") && hasChaptersData;

  const tabs: { key: TabKey; label: string; icon: typeof Sparkles; locked?: boolean }[] = [
    { key: "summary", label: t.resSummary, icon: Sparkles },
    { key: "actions", label: t.resActions, icon: ListChecks },
    ...(!hasFeature(plan, "meetingChapters") || showChapters
      ? [{
          key: "chapters" as const,
          label: t.resChapters,
          icon: BookOpen,
          locked: !hasFeature(plan, "meetingChapters"),
        }]
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
          <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
            {t.resComplete}
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-zinc-900">
            {result.fileName}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-zinc-400" />
              {result.duration}
            </span>
            <span className="text-zinc-300">·</span>
            <span>
              {t.resProcessed} {result.processedAt}
            </span>
            {hasFeature(plan, "sentimentAnalysis") && result.sentiment ? (
              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                  SENTIMENT_COLORS[result.sentiment.overall],
                )}
              >
                {result.sentiment.label}
              </span>
            ) : !hasFeature(plan, "sentimentAnalysis") ? (
              <button
                type="button"
                onClick={() => promptUpgrade("sentimentAnalysis")}
                className="rounded-full border border-dashed border-zinc-300 bg-zinc-50 px-2.5 py-0.5 text-[11px] font-medium text-zinc-500 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
              >
                + {t.gateSentimentTeaser}
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex flex-wrap gap-2">
            {hasFeature(plan, "copyToClipboard") && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopySummary}
                className="gap-2"
              >
                <Copy className="h-3.5 w-3.5 text-violet-400" />
                {copied ? t.resCopied : t.resCopySummary}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onReset}
              className="gap-2 text-zinc-500"
            >
              {t.resNewUpload}
            </Button>
          </div>
          <ReportDownloadPicker
            result={result}
            actionItems={actionItems}
            pdfLabels={pdfLabels}
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden rounded-lg">
        <div className="flex overflow-x-auto border-b border-zinc-200">
          {tabs.map(({ key, label, icon: Icon, locked }) =>
            locked ? (
              <LockedTab
                key={key}
                feature="meetingChapters"
                label={label}
                icon={<Icon className="h-4 w-4" />}
                active={activeTab === key}
                onSelect={() => setActiveTab(key)}
              />
            ) : (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={cn(
                  "flex shrink-0 items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-all",
                  activeTab === key
                    ? "border-b-2 border-zinc-900 text-zinc-900"
                    : "text-zinc-500 hover:text-zinc-700",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ),
          )}
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
              onPrioritiesLocked={() => promptUpgrade("actionPriorities")}
              t={t}
            />
          )}
          {activeTab === "chapters" && result.chapters && hasFeature(plan, "meetingChapters") && (
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
        <section className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {t.resSentiment}
          </p>
          <p className="mt-2 text-sm text-zinc-600">{result.sentiment.description}</p>
        </section>
      )}
      {result.summary.overview && (
        <section>
          <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            <FileText className="h-4 w-4 text-zinc-400" />
            {t.resOverview}
          </h3>
          <div className="rounded-md border border-indigo-100 bg-indigo-50/50 p-5">
            {result.summary.overview.split("\n").filter(Boolean).map((para, i) => (
              <p
                key={i}
                className={cn("text-sm leading-relaxed text-zinc-700", i > 0 && "mt-4")}
              >
                {para}
              </p>
            ))}
          </div>
        </section>
      )}
      <section>
        <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          <Sparkles className="h-4 w-4 text-zinc-400" />
          {t.resExecutive}
        </h3>
        <ul className="space-y-3">
          {result.summary.executive.map((point, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-zinc-700">
              <span className="mt-2 h-1 w-4 shrink-0 rounded-full bg-zinc-900" />
              {point}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          <CheckSquare className="h-4 w-4 text-zinc-400" />
          {t.resTakeaways}
        </h3>
        <ul className="space-y-3">
          {result.summary.keyTakeaways.map((point, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm leading-relaxed text-zinc-700"
            >
              <span className="font-mono text-xs font-bold text-zinc-400">
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
          className="flex items-center gap-4 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3.5 transition-colors hover:border-zinc-300"
        >
          <span className="w-14 shrink-0 font-mono text-sm font-semibold text-indigo-600">
            {ch.timestamp}
          </span>
          <span className="text-sm text-zinc-700">{ch.title}</span>
        </li>
      ))}
    </ul>
  );
}

function ActionItemsTab({
  items,
  onToggle,
  showPriority,
  onPrioritiesLocked,
  t,
}: {
  items: ActionItem[];
  onToggle: (id: string) => void;
  showPriority: boolean;
  onPrioritiesLocked?: () => void;
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
      {!showPriority && onPrioritiesLocked && (
        <button
          type="button"
          onClick={onPrioritiesLocked}
          className="mb-4 flex w-full items-center justify-between rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-start transition-colors hover:border-indigo-300 hover:bg-indigo-50/50"
        >
          <span className="text-xs text-zinc-600">
            <span className="font-medium text-zinc-800">+ {t.gatePrioritiesTeaser}</span>
            {" — "}
            {t.gatePrioritiesLine1}
          </span>
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-indigo-600">
            Pro
          </span>
        </button>
      )}
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          {completedCount} / {items.length} {t.resCompleted}
        </p>
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all"
            style={{ width: `${(completedCount / items.length) * 100}%` }}
          />
        </div>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <label
              className={cn(
                "flex cursor-pointer items-start gap-4 rounded-md border px-4 py-4 transition-all",
                item.completed
                  ? "border-zinc-100 bg-zinc-50 opacity-60"
                  : "border-zinc-200 bg-white hover:border-zinc-300",
              )}
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => onToggle(item.id)}
                className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-300 text-indigo-600"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      item.completed ? "text-zinc-400 line-through" : "text-zinc-800",
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
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.resSearchTranscript}
            className="ps-9"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-2"
        >
          <Copy className="h-3.5 w-3.5" />
          {copied ? t.resCopied : t.resCopySummary}
        </Button>
      </div>
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">{t.resNoResults}</p>
      ) : (
        <div className="max-h-[28rem] space-y-1 overflow-y-auto pe-2">
          {filtered.map((entry, i) => (
            <div
              key={i}
              className="group flex gap-4 rounded-md px-3 py-3 transition-colors hover:bg-zinc-50"
            >
              <span className="w-12 shrink-0 font-mono text-xs text-zinc-400">
                {entry.timestamp}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-indigo-600">{entry.speaker}</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-700">{entry.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
