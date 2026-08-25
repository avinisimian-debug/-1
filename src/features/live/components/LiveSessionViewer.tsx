"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  HelpCircle,
  ListChecks,
  Loader2,
  Scale,
  Sparkles,
} from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { MeetingWorkspace } from "@/features/workspace/components/MeetingWorkspace";
import type { TranscriptionResult } from "@/features/transcription/types";
import { mapDecisionsToTimestamps } from "@/features/staz-workspace/lib/map-decision-timestamp";
import { cn } from "@/lib/utils";
import { fetchLiveMeeting, reprocessLiveMeeting } from "../api/live-meetings.api";
import type { BotStatus, LiveSessionPublic } from "../types";
import { deriveMeetingOutcome } from "../lib/meeting-outcome";

type TabId =
  | "brief"
  | "decisions"
  | "actions"
  | "open"
  | "transcript"
  | "media";

interface LiveSessionViewerProps {
  meetingId: string;
}

function isTranscriptionResult(value: unknown): value is TranscriptionResult {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return Array.isArray(v.transcript) && typeof v.fileName === "string";
}

const STATUS_HE: Record<BotStatus, string> = {
  scheduled: "מתוזמן",
  dispatching: "שולח בוט…",
  joining: "מצטרף לפגישה…",
  recording: "מקליט",
  uploading: "מעלה הקלטה…",
  transcribing: "מתמלל…",
  analyzing: "בונה תמצית מנהלים…",
  ready: "סגירה מוכנה",
  failed: "עיבוד נכשל",
  cancelled: "בוטל",
  awaiting_recording: "ממתין להקלטה",
};

const STATUS_EN: Record<BotStatus, string> = {
  scheduled: "Scheduled",
  dispatching: "Dispatching bot…",
  joining: "Bot joining…",
  recording: "Recording",
  uploading: "Uploading",
  transcribing: "Transcribing…",
  analyzing: "Building closeout…",
  ready: "Closeout ready",
  failed: "Failed",
  cancelled: "Cancelled",
  awaiting_recording: "Awaiting recording",
};

function waitingCopy(status: BotStatus, error: string | undefined, he: boolean) {
  if (status === "failed") {
    return {
      title: he
        ? "משהו השתבש בעיבוד הפגישה."
        : "Something went wrong processing this meeting.",
      body: error?.trim() || (he ? "נסו שוב מההאב — ההקלטה נשמרת." : "Retry from Live Hub — the recording is kept."),
    };
  }
  if (status === "awaiting_recording") {
    return {
      title: he
        ? "מעלים הקלטה מההאב כדי להתחיל סגירה."
        : "Upload a recording from Live Hub to start closeout.",
      body: he
        ? "הבוט מקליט בשקט בזמן הפגישה. אחרי ההקלטה — תמלול ותמצית מנהלים."
        : "The bot records quietly during the meeting. Afterward — transcript and executive closeout.",
    };
  }
  if (status === "transcribing" || status === "analyzing" || status === "uploading") {
    return {
      title: he ? "Staz מעבד את הפגישה…" : "Staz is processing the meeting…",
      body: he
        ? "בונים תמלול, החלטות, משימות וראיות. זה יכול לקחת כמה דקות."
        : "Building transcript, decisions, actions, and evidence. This can take a few minutes.",
    };
  }
  return {
    title: he ? "ממתין להקלטה ולסגירה…" : "Waiting for recording & closeout…",
    body: he
      ? "הבוט מקשיב ומקליט בלבד — בלי להפריע בשיחה."
      : "The bot listens and records only — no mid-meeting interruptions.",
  };
}

export function LiveSessionViewer({ meetingId }: LiveSessionViewerProps) {
  const { locale, t } = useLocale();
  const he = locale === "he";
  const [meeting, setMeeting] = useState<LiveSessionPublic | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>("brief");
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchLiveMeeting(meetingId);
      setMeeting(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : he
            ? "טעינת הפגישה נכשלה."
            : "Failed to load meeting.",
      );
    } finally {
      setLoading(false);
    }
  }, [he, meetingId]);

  const retryCloseout = useCallback(async () => {
    setRetrying(true);
    try {
      const data = await reprocessLiveMeeting(meetingId);
      setMeeting(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : he
            ? "ניסיון חוזר נכשל."
            : "Retry failed.",
      );
    } finally {
      setRetrying(false);
    }
  }, [he, meetingId]);

  useEffect(() => {
    const kickoff = window.setTimeout(() => void refresh(), 0);
    const timer = window.setInterval(() => void refresh(), 8_000);
    return () => {
      window.clearTimeout(kickoff);
      window.clearInterval(timer);
    };
  }, [refresh]);

  const digest = useMemo(() => {
    if (!meeting?.digest || !isTranscriptionResult(meeting.digest)) return null;
    return meeting.digest;
  }, [meeting]);

  const outcome = useMemo(
    () => (digest ? deriveMeetingOutcome(digest, he) : null),
    [digest, he],
  );

  const decisionList = useMemo(() => {
    if (!digest) return [];
    if (digest.decisions && digest.decisions.length > 0) return digest.decisions;
    return digest.summary.keyTakeaways ?? [];
  }, [digest]);

  const decisionMoments = useMemo(
    () =>
      digest
        ? mapDecisionsToTimestamps(decisionList, digest.transcript)
        : [],
    [decisionList, digest],
  );

  const mediaKind = useMemo(() => {
    const ct = meeting?.recordingContentType ?? "";
    if (ct.startsWith("audio/")) return "audio" as const;
    return "video" as const;
  }, [meeting?.recordingContentType]);

  const mediaSrc = meeting?.recordingBlobUrl
    ? `/api/live/meetings/${meeting.id}/media`
    : undefined;

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
        {he ? "טוען מפגש…" : "Loading session…"}
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <p className="text-sm text-destructive">
          {error || (he ? "הפגישה לא נמצאה" : "Meeting not found")}
        </p>
        <Link
          href="/live"
          className="mt-4 inline-block text-sm text-accent hover:underline"
        >
          {he ? "חזרה להאב" : "Back to Live Hub"}
        </Link>
      </div>
    );
  }

  const statusLabel = (he ? STATUS_HE : STATUS_EN)[meeting.botStatus];
  const wait = waitingCopy(meeting.botStatus, meeting.error, he);

  const tabs: Array<{ id: TabId; label: string }> = he
    ? [
        { id: "brief", label: "תמצית מנהלים" },
        { id: "decisions", label: "מה הוחלט" },
        { id: "actions", label: "מי עושה מה" },
        { id: "open", label: "פתוח" },
        { id: "transcript", label: "תמלול" },
        { id: "media", label: "מדיה" },
      ]
    : [
        { id: "brief", label: "Executive brief" },
        { id: "decisions", label: "Decisions" },
        { id: "actions", label: "Action items" },
        { id: "open", label: "Open" },
        { id: "transcript", label: "Transcript" },
        { id: "media", label: "Media" },
      ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6" dir={he ? "rtl" : "ltr"}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/live"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t.liveHubTitle}
        </Link>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {statusLabel}
        </span>
      </div>

      <header className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {meeting.title}
        </h1>
        {meeting.description ? (
          <p className="mt-2 text-sm text-muted-foreground">{meeting.description}</p>
        ) : null}
        {meeting.materials?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {meeting.materials.map((m) => (
              <a
                key={m.id}
                href={m.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-border/60 bg-muted/30 px-3 py-1.5 text-xs font-medium text-accent hover:underline"
              >
                {m.title || m.url}
              </a>
            ))}
          </div>
        ) : null}
        {outcome ? (
          <div className="mt-4 rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {he ? "מצב סגירה" : "Closeout status"}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">{outcome.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {outcome.reason}
            </p>
          </div>
        ) : null}
      </header>

      {!digest ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
          {meeting.botStatus !== "failed" ? (
            <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-accent" aria-hidden />
          ) : null}
          <p className="text-sm font-medium text-foreground">{wait.title}</p>
          <p className="mt-2 text-xs text-muted-foreground">{wait.body}</p>
          {meeting.botStatus === "failed" ? (
            <button
              type="button"
              disabled={retrying || !meeting.recordingBlobUrl}
              onClick={() => void retryCloseout()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
            >
              {retrying ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : null}
              {he ? "נסו שוב" : "Try again"}
            </button>
          ) : null}
        </div>
      ) : (
        <>
          <div
            className="flex flex-wrap gap-1 rounded-xl border border-border/60 bg-muted/30 p-1"
            role="tablist"
          >
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  tab === item.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          {tab === "brief" && (
            <section className="space-y-4 rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="h-4 w-4 text-accent" aria-hidden />
                {he ? "תמצית מנהלים" : "Executive brief"}
              </div>
              {digest.headline ? (
                <h2 className="text-xl font-semibold text-foreground">
                  {digest.headline}
                </h2>
              ) : null}
              {digest.summary.overview ? (
                <p className="text-sm leading-relaxed text-foreground/90">
                  {digest.summary.overview}
                </p>
              ) : null}
              {digest.summary.executive.length > 0 ? (
                <ul className="list-disc space-y-1.5 ps-5 text-sm text-foreground/85">
                  {digest.summary.executive.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : null}
              {digest.followUps && digest.followUps.length > 0 ? (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">
                    {he ? "המשכים" : "Follow-ups"}
                  </h3>
                  <ul className="list-disc space-y-1 ps-5 text-sm text-foreground/85">
                    {digest.followUps.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {digest.topics && digest.topics.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {digest.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              ) : null}
            </section>
          )}

          {tab === "decisions" && (
            <section className="space-y-3 rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
                <Scale className="h-4 w-4 text-accent" aria-hidden />
                {he ? "מה הוחלט" : "Decisions"}
              </div>
              {decisionList.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {he ? "לא זוהו החלטות סופיות." : "No final decisions identified."}
                </p>
              ) : (
                decisionList.map((decision) => {
                  const m = decisionMoments.find((x) => x.decision === decision);
                  return (
                    <div
                      key={decision}
                      className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3"
                    >
                      <p className="text-sm font-medium text-foreground">{decision}</p>
                      {m ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {he ? "ראיה" : "Evidence"} · {m.timestamp}
                          {m.quote ? ` — “${m.quote.slice(0, 80)}${m.quote.length > 80 ? "…" : ""}”` : ""}
                        </p>
                      ) : (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {he
                            ? "לא נמצא רגע מדויק בתמלול"
                            : "No exact transcript moment found"}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </section>
          )}

          {tab === "actions" && (
            <section className="space-y-3 rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
                <ListChecks className="h-4 w-4 text-accent" aria-hidden />
                {he ? "מי עושה מה" : "Who does what"}
              </div>
              {digest.actionItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {he ? "לא זוהו משימות מפורשות." : "No explicit action items."}
                </p>
              ) : (
                digest.actionItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3"
                  >
                    <p className="text-sm font-medium text-foreground">{item.task}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.owner} · {item.deadline}
                      {item.priority ? ` · ${item.priority}` : ""}
                    </p>
                  </div>
                ))
              )}
            </section>
          )}

          {tab === "open" && (
            <section className="space-y-5 rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <HelpCircle className="h-4 w-4 text-accent" aria-hidden />
                  {he ? "שאלות פתוחות" : "Open questions"}
                </div>
                {!digest.openQuestions?.length ? (
                  <p className="text-sm text-muted-foreground">
                    {he ? "אין שאלות פתוחות שזוהו." : "No open questions identified."}
                  </p>
                ) : (
                  <ul className="list-disc space-y-1.5 ps-5 text-sm text-foreground/85">
                    {digest.openQuestions.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                )}
              </div>
              {digest.risks && digest.risks.length > 0 ? (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">
                    {he ? "סיכונים / חסמים" : "Risks / blockers"}
                  </h3>
                  <ul className="space-y-2">
                    {digest.risks.map((r) => (
                      <li
                        key={r.risk}
                        className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm"
                      >
                        <span className="text-xs font-semibold uppercase text-muted-foreground">
                          {r.severity}
                        </span>
                        <p className="mt-1 text-foreground">{r.risk}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          )}

          {tab === "transcript" && (
            <MeetingWorkspace
              result={digest}
              mediaSrc={mediaSrc}
              mediaKind={mediaKind}
            />
          )}

          {tab === "media" && (
            <section className="space-y-4 rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              {mediaSrc ? (
                <>
                  {mediaKind === "video" ? (
                    <video
                      src={mediaSrc}
                      controls
                      className="aspect-video w-full rounded-xl bg-black"
                    />
                  ) : (
                    <audio src={mediaSrc} controls className="w-full" />
                  )}
                  <a
                    href={mediaSrc}
                    download={`${meeting.title.replace(/\s+/g, "-")}.mp4`}
                    className="btn-cinema inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
                  >
                    <Download className="h-4 w-4" aria-hidden />
                    {he ? "הורדת הקלטה" : "Download recording"}
                  </a>
                  <p className="text-xs text-muted-foreground">
                    {he
                      ? "סטרימינג מאובטח לחשבון שלכם בלבד."
                      : "Secure authenticated stream for your account."}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {he ? "עדיין אין קובץ הקלטה." : "No recording file attached yet."}
                </p>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
