"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  CheckSquare,
  Clock,
  Copy,
  FileText,
  Lightbulb,
  ListChecks,
  Mail,
  MessageSquareQuote,
  ShieldAlert,
  Sparkles,
  Tag,
  User,
} from "lucide-react";
import { LockedTab } from "@/components/billing/LockedFeatureTrigger";
import { useFeatureGate } from "@/context/FeatureGateContext";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { buildSummaryText, copyToClipboard } from "@/lib/export";
import { hasFeature } from "@/lib/plan-features";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import type { ActionItem, TranscriptionResult } from "../types";
import { ReportDownloadPicker } from "./ReportDownloadPicker";
import { PushActionItemsButton } from "@/features/integrations/components/PushActionItemsButton";
import { SummaryTemplatePanel } from "@/features/summarization";
import { ShareLinkPanel } from "@/features/sharing";
import { MeetingWorkspace } from "@/features/workspace";

type TabKey = "summary" | "actions" | "insights" | "chapters" | "transcript";

interface ResultsViewProps {
  result: TranscriptionResult;
  audioSrc?: string;
  onReset: () => void;
}

const SENTIMENT_COLORS = {
  positive: "border-emerald-200 bg-emerald-50 text-emerald-700",
  neutral: "border-border bg-muted/50 text-muted-foreground",
  mixed: "border-amber-200 bg-amber-50 text-amber-700",
  negative: "border-red-200 bg-red-50 text-red-700",
};

const PRIORITY_STYLES = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-muted/50 text-muted-foreground border-border",
};

export function ResultsView({ result, audioSrc, onReset }: ResultsViewProps) {
  const { t } = useLocale();
  const { plan } = usePlan();
  const { promptUpgrade } = useFeatureGate();
  const [activeTab, setActiveTab] = useState<TabKey>("summary");
  const [actionItems, setActionItems] = useState(result.actionItems);
  const [copied, setCopied] = useState(false);

  const hasChaptersData = (result.chapters?.length ?? 0) > 0;
  const showChapters =
    hasFeature(plan, "meetingChapters") && hasChaptersData;

  const hasInsightsData =
    (result.keyQuotes?.length ?? 0) > 0 ||
    (result.risks?.length ?? 0) > 0 ||
    Boolean(result.followUpEmail);
  const showInsights =
    !hasFeature(plan, "keyQuotes") || hasInsightsData;

  const tabs: { key: TabKey; label: string; icon: typeof Sparkles; locked?: boolean; lockFeature?: "meetingChapters" | "keyQuotes" }[] = [
    { key: "summary", label: t.resSummary, icon: Sparkles },
    { key: "actions", label: t.resActions, icon: ListChecks },
    ...(showInsights
      ? [{
          key: "insights" as const,
          label: t.resInsights,
          icon: Lightbulb,
          locked: !hasFeature(plan, "keyQuotes"),
          lockFeature: "keyQuotes" as const,
        }]
      : []),
    ...(!hasFeature(plan, "meetingChapters") || showChapters
      ? [{
          key: "chapters" as const,
          label: t.resChapters,
          icon: BookOpen,
          locked: !hasFeature(plan, "meetingChapters"),
          lockFeature: "meetingChapters" as const,
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
    <div className={cn("mx-auto w-full", activeTab === "transcript" ? "max-w-6xl" : "max-w-4xl")}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-accent">
            {t.resComplete}
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-foreground">
            {result.fileName}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
              {result.duration}
            </span>
            <span className="text-border">·</span>
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
                className="rounded-full border border-dashed border-border bg-muted/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-indigo-300 hover:bg-accent-muted hover:text-indigo-700"
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
              className="gap-2 text-muted-foreground"
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

      <details className="mb-4 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
        <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
          {t.shareTitle}
        </summary>
        <div className="mt-3">
          <ShareLinkPanel meetingTitle={result.fileName} />
        </div>
      </details>

      <div className="glass-card overflow-hidden rounded-lg">
        <div className="flex overflow-x-auto border-b border-border">
          {tabs.map(({ key, label, icon: Icon, locked, lockFeature }) =>
            locked && lockFeature ? (
              <LockedTab
                key={key}
                feature={lockFeature}
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
                    ? "border-b-2 border-zinc-900 text-foreground"
                    : "text-muted-foreground hover:text-foreground/90",
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
              result={result}
              items={actionItems}
              onToggle={toggleActionItem}
              showPriority={hasFeature(plan, "actionPriorities")}
              onPrioritiesLocked={() => promptUpgrade("actionPriorities")}
              t={t}
            />
          )}
          {activeTab === "insights" && hasFeature(plan, "keyQuotes") && (
            <InsightsTab result={result} />
          )}
          {activeTab === "chapters" && result.chapters && hasFeature(plan, "meetingChapters") && (
            <ChaptersTab chapters={result.chapters} />
          )}
          {activeTab === "transcript" && (
            <MeetingWorkspace result={result} audioSrc={audioSrc} />
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
      <SummaryTemplatePanel result={result} />
      {result.headline && (
        <section className="rounded-md border border-accent/20 bg-accent-muted/30 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t.resHeadline}
          </p>
          <p className="mt-2 text-base font-medium leading-relaxed text-foreground">
            {result.headline}
          </p>
        </section>
      )}
      {(result.topics?.length ?? 0) > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <Tag className="h-4 w-4 text-muted-foreground/70" />
            {t.resTopics}
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.topics!.map((topic, i) => (
              <span
                key={i}
                className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground/90"
              >
                {topic}
              </span>
            ))}
          </div>
        </section>
      )}
      {(result.decisions?.length ?? 0) > 0 && (
        <section>
          <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <CheckSquare className="h-4 w-4 text-muted-foreground/70" />
            {t.resDecisions}
          </h3>
          <ul className="space-y-2">
            {result.decisions!.map((decision, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-md border border-emerald-200/60 bg-emerald-50/50 px-4 py-3 text-sm leading-relaxed text-foreground/90"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                {decision}
              </li>
            ))}
          </ul>
        </section>
      )}
      {hasFeature(plan, "sentimentAnalysis") && result.sentiment && (
        <section className="rounded-md border border-border bg-muted/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t.resSentiment}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{result.sentiment.description}</p>
        </section>
      )}
      {result.summary.overview && (
        <section>
          <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <FileText className="h-4 w-4 text-muted-foreground/70" />
            {t.resOverview}
          </h3>
          <div className="rounded-md border border-accent/15 bg-accent-muted/50 p-5">
            {result.summary.overview.split("\n").filter(Boolean).map((para, i) => (
              <p
                key={i}
                className={cn("text-sm leading-relaxed text-foreground/90", i > 0 && "mt-4")}
              >
                {para}
              </p>
            ))}
          </div>
        </section>
      )}
      <section>
        <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-4 w-4 text-muted-foreground/70" />
          {t.resExecutive}
        </h3>
        <ul className="space-y-3">
          {result.summary.executive.map((point, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground/90">
              <span className="mt-2 h-1 w-4 shrink-0 rounded-full bg-foreground" />
              {point}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          <CheckSquare className="h-4 w-4 text-muted-foreground/70" />
          {t.resTakeaways}
        </h3>
        <ul className="space-y-3">
          {result.summary.keyTakeaways.map((point, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-md border border-border bg-muted/50 px-4 py-3.5 text-sm leading-relaxed text-foreground/90"
            >
              <span className="font-mono text-xs font-bold text-muted-foreground/70">
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

function InsightsTab({ result }: { result: TranscriptionResult }) {
  const { t } = useLocale();
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = async () => {
    if (!result.followUpEmail) return;
    const text = `Subject: ${result.followUpEmail.subject}\n\n${result.followUpEmail.body}`;
    const ok = await copyToClipboard(text);
    if (ok) {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    }
  };

  const riskSeverityStyle = {
    high: "border-red-200 bg-red-50 text-red-700",
    medium: "border-amber-200 bg-amber-50 text-amber-700",
    low: "border-border bg-muted/50 text-muted-foreground",
  };

  return (
    <div className="space-y-8">
      {(result.keyQuotes?.length ?? 0) > 0 && (
        <section>
          <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <MessageSquareQuote className="h-4 w-4 text-muted-foreground/70" />
            {t.resKeyQuotes}
          </h3>
          <ul className="space-y-3">
            {result.keyQuotes!.map((item, i) => (
              <li
                key={i}
                className="rounded-md border border-border bg-muted/50 px-4 py-4"
              >
                <p className="text-sm font-medium leading-relaxed text-foreground">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{item.context}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
      {(result.risks?.length ?? 0) > 0 && (
        <section>
          <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <ShieldAlert className="h-4 w-4 text-muted-foreground/70" />
            {t.resRisks}
          </h3>
          <ul className="space-y-2">
            {result.risks!.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-md border border-border bg-white px-4 py-3"
              >
                <span
                  className={cn(
                    "mt-0.5 shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                    riskSeverityStyle[item.severity],
                  )}
                >
                  {item.severity}
                </span>
                <p className="text-sm leading-relaxed text-foreground/90">{item.risk}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
      {result.followUpEmail && (
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Mail className="h-4 w-4 text-muted-foreground/70" />
              {t.resFollowUpEmail}
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyEmail}
              className="gap-2"
            >
              <Copy className="h-3.5 w-3.5" />
              {emailCopied ? t.resCopied : t.resCopyEmail}
            </Button>
          </div>
          <div className="rounded-md border border-border bg-muted/50 p-5">
            <p className="text-xs font-semibold text-muted-foreground">
              {result.followUpEmail.subject}
            </p>
            <div className="mt-3 space-y-3">
              {result.followUpEmail.body.split("\n").filter(Boolean).map((para, i) => (
                <p key={i} className="text-sm leading-relaxed text-foreground/90">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}
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
          className="flex items-center gap-4 rounded-md border border-border bg-muted/50 px-4 py-3.5 transition-colors hover:border-border"
        >
          <span className="w-14 shrink-0 font-mono text-sm font-semibold text-accent">
            {ch.timestamp}
          </span>
          <span className="text-sm text-foreground/90">{ch.title}</span>
        </li>
      ))}
    </ul>
  );
}

function ActionItemsTab({
  result,
  items,
  onToggle,
  showPriority,
  onPrioritiesLocked,
  t,
}: {
  result: TranscriptionResult;
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
          className="mb-4 flex w-full items-center justify-between rounded-md border border-dashed border-border bg-muted/50 px-4 py-3 text-start transition-colors hover:border-indigo-300 hover:bg-accent-muted/50"
        >
          <span className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">+ {t.gatePrioritiesTeaser}</span>
            {" — "}
            {t.gatePrioritiesLine1}
          </span>
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-accent">
            Pro
          </span>
        </button>
      )}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {completedCount} / {items.length} {t.resCompleted}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <PushActionItemsButton result={result} actionItems={items} />
          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all"
              style={{ width: `${(completedCount / items.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <label
              className={cn(
                "flex cursor-pointer items-start gap-4 rounded-md border px-4 py-4 transition-all",
                item.completed
                  ? "border-border/60 bg-muted/50 opacity-60"
                  : "border-border bg-white hover:border-border",
              )}
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => onToggle(item.id)}
                className="mt-1 h-4 w-4 shrink-0 rounded border-border text-accent"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      item.completed ? "text-muted-foreground/70 line-through" : "text-foreground",
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
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
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
