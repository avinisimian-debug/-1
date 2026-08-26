"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { StazMark } from "@/components/brand/Logo";
import { useLocale } from "@/context/LocaleContext";
import { PremiumWorkspace } from "@/features/staz-workspace";
import type { TranscriptionResult } from "@/features/transcription/types";
import { cn } from "@/lib/utils";
import { fetchLiveMeeting, reprocessLiveMeeting } from "../api/live-meetings.api";
import type { BotStatus, LiveSessionPublic } from "../types";
import { deriveMeetingOutcome } from "../lib/meeting-outcome";

interface LiveSessionViewerProps {
  meetingId: string;
}

function isTranscriptionResult(value: unknown): value is TranscriptionResult {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return Array.isArray(v.transcript) && typeof v.fileName === "string";
}

const STAGE_ORDER: BotStatus[] = [
  "scheduled",
  "dispatching",
  "joining",
  "recording",
  "uploading",
  "transcribing",
  "analyzing",
  "ready",
];

function waitingCopy(status: BotStatus, error: string | undefined, he: boolean) {
  if (status === "failed") {
    return {
      title: he
        ? "משהו השתבש בעיבוד הפגישה"
        : "Something went wrong processing this meeting",
      body:
        error?.trim() ||
        (he
          ? "ההקלטה נשמרת — אפשר לנסות שוב או להעלות קובץ מההאב."
          : "The recording is kept — retry or upload from the hub."),
    };
  }
  if (status === "awaiting_recording") {
    return {
      title: he ? "ממתינים להקלטה" : "Waiting for recording",
      body: he
        ? "העלו הקלטה מההאב כדי להתחיל סגירה אוטומטית."
        : "Upload a recording from the hub to start closeout.",
    };
  }
  if (
    status === "transcribing" ||
    status === "analyzing" ||
    status === "uploading"
  ) {
    return {
      title: he ? "Staz סוגר את הפגישה…" : "Staz is closing the meeting…",
      body: he
        ? "בונים תמלול, החלטות ומשימות. זה יכול לקחת כמה דקות."
        : "Building transcript, decisions, and actions. This can take a few minutes.",
    };
  }
  if (status === "joining" || status === "recording" || status === "dispatching") {
    return {
      title: he ? "הבוט בפגישה" : "Bot is in the meeting",
      body: he
        ? "מקשיב ומקליט בשקט — בלי להפריע לשיחה."
        : "Listening and recording quietly — no interruptions.",
    };
  }
  return {
    title: he ? "ממתין להתחלת הפגישה" : "Waiting for the meeting to start",
    body: he
      ? "כשיגיע הזמן הבוט יצטרף אוטומטית (אם מחובר), או שתוכלו להעלות הקלטה אחרי."
      : "When the time comes the bot joins automatically (if connected), or upload a recording after.",
  };
}

export function LiveSessionViewer({ meetingId }: LiveSessionViewerProps) {
  const { locale, t } = useLocale();
  const he = locale === "he";
  const [meeting, setMeeting] = useState<LiveSessionPublic | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  const mediaKind = useMemo(() => {
    const ct = meeting?.recordingContentType ?? "";
    if (ct.startsWith("audio/")) return "audio" as const;
    return "video" as const;
  }, [meeting?.recordingContentType]);

  const mediaSrc = meeting?.recordingBlobUrl
    ? `/api/live/meetings/${meeting.id}/media`
    : undefined;

  const statusLabels: Record<BotStatus, string> = {
    scheduled: t.liveStatusScheduled,
    dispatching: t.liveStatusDispatching,
    joining: t.liveStatusJoining,
    recording: t.liveStatusRecording,
    uploading: t.liveStatusUploading,
    transcribing: t.liveStatusTranscribing,
    analyzing: t.liveStatusAnalyzing,
    ready: t.liveStatusReady,
    failed: t.liveStatusFailed,
    cancelled: t.liveStatusCancelled,
    awaiting_recording: t.liveStatusAwaitingRecording,
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-[var(--ink-tertiary)]">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--accent)]" aria-hidden />
        {he ? "טוען פגישה…" : "Loading session…"}
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="mx-auto max-w-lg rounded-[1.15rem] border border-destructive/30 bg-destructive/5 p-8 text-center">
        <p className="text-sm text-destructive">
          {error || (he ? "הפגישה לא נמצאה" : "Meeting not found")}
        </p>
        <Link
          href="/live"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:underline"
        >
          {he ? "חזרה לבוט פגישות" : "Back to meeting bot"}
          <ArrowRight className="h-3.5 w-3.5 rotate-180" aria-hidden />
        </Link>
      </div>
    );
  }

  const wait = waitingCopy(meeting.botStatus, meeting.error, he);
  const stageIdx = Math.max(0, STAGE_ORDER.indexOf(meeting.botStatus));

  return (
    <div
      className="mx-auto w-full max-w-6xl space-y-5 page-enter"
      dir={he ? "rtl" : "ltr"}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/live"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-tertiary)] transition hover:text-[var(--ink-primary)]"
        >
          <ArrowRight className="h-4 w-4 rotate-180" aria-hidden />
          {t.liveHubTitle}
        </Link>
        <span className="rounded-full bg-[var(--bg-subtle)] px-3 py-1 text-xs font-medium text-[var(--ink-secondary)]">
          {statusLabels[meeting.botStatus]}
        </span>
      </div>

      <header className="staz-surface-card staz-surface-card--static px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-wrap items-start gap-3">
          <StazMark size={36} />
          <div className="min-w-0 flex-1">
            <h1 className="font-brand text-xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-2xl">
              {meeting.title}
            </h1>
            {meeting.description ? (
              <p className="mt-2 text-sm text-[var(--ink-secondary)]">
                {meeting.description}
              </p>
            ) : null}
            {meeting.materials?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {meeting.materials.map((m) => (
                  <a
                    key={m.id}
                    href={m.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-[var(--line-subtle)] bg-[var(--bg-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--accent)] hover:underline"
                  >
                    {m.title || m.url}
                  </a>
                ))}
              </div>
            ) : null}
            {outcome ? (
              <div className="mt-4 rounded-xl border border-[var(--line-subtle)] bg-[var(--bg-subtle)]/50 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-tertiary)]">
                  {he ? "מצב סגירה" : "Closeout status"}
                </p>
                <p className="mt-1 text-sm font-medium text-[var(--ink-primary)]">
                  {outcome.label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--ink-tertiary)]">
                  {outcome.reason}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {!digest ? (
        <div className="lat-stage flex flex-col items-center rounded-[1.15rem] px-6 py-14 text-center">
          <StazMark size={48} />
          {meeting.botStatus !== "failed" ? (
            <Loader2
              className="mt-5 h-5 w-5 animate-spin text-[#5eead4]"
              aria-hidden
            />
          ) : null}
          <p className="mt-4 text-base font-semibold text-[#ededea]">{wait.title}</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-[#a8aea8]">
            {wait.body}
          </p>

          {meeting.botStatus !== "failed" && meeting.botStatus !== "cancelled" ? (
            <ol className="mt-8 flex w-full max-w-md flex-wrap justify-center gap-2">
              {STAGE_ORDER.filter((s) => s !== "ready").map((s, i) => (
                <li
                  key={s}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-medium",
                    i <= stageIdx
                      ? "bg-teal-400/15 text-[#5eead4]"
                      : "bg-white/5 text-white/35",
                  )}
                >
                  {statusLabels[s]}
                </li>
              ))}
            </ol>
          ) : null}

          {meeting.botStatus === "failed" ? (
            <button
              type="button"
              disabled={retrying || !meeting.recordingBlobUrl}
              onClick={() => void retryCloseout()}
              className="lat-btn-primary mt-6 !rounded-full disabled:opacity-50"
            >
              {retrying ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : null}
              {he ? "נסו שוב" : "Try again"}
            </button>
          ) : null}

          <Link
            href="/live"
            className="mt-6 text-sm text-[#5eead4]/80 hover:text-[#5eead4] hover:underline"
          >
            {he ? "חזרה להאב — העלאת הקלטה" : "Back to hub — upload recording"}
          </Link>
        </div>
      ) : (
        <PremiumWorkspace
          result={digest}
          mediaSrc={mediaSrc}
          mediaKind={mediaKind}
          className="h-[min(100svh,920px)] min-h-[560px] border-[var(--line-subtle)] shadow-[var(--shadow-premium)]"
        />
      )}
    </div>
  );
}
