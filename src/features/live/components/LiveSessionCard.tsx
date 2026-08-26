"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Bot,
  CalendarPlus,
  ChevronDown,
  Download,
  ExternalLink,
  FileVideo,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Upload,
} from "lucide-react";
import { put } from "@vercel/blob/client";
import { useLocale } from "@/context/LocaleContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";
import {
  attachMeetingRecording,
  postLiveMeetingQa,
} from "../api/live-meetings.api";
import { buildGoogleCalendarUrl, buildIcsDataUrl } from "../lib/calendar";
import type { BotStatus, LiveSessionPublic } from "../types";
import { LiveCountdown } from "./LiveCountdown";
import { TRANSCRIPTION_UPLOAD_PATH } from "@/features/transcription/constants";

function buildLiveRecordingPath(email: string, fileName: string): string {
  const safeName = fileName.replace(/[^\w.\-() ]+/g, "_").slice(0, 180);
  return `transcribe/${email.toLowerCase()}/${Date.now()}-${safeName}`;
}

interface LiveSessionCardProps {
  session: LiveSessionPublic;
  userName?: string | null;
  onChanged: () => void;
  onDelete: (id: string) => void;
}

const platformLabel: Record<LiveSessionPublic["platform"], string> = {
  zoom: "Zoom",
  google_meet: "Google Meet",
  microsoft_teams: "Teams",
  rtmp: "RTMP",
  webrtc: "WebRTC",
  other: "פגישה",
};

function statusTone(status: BotStatus): string {
  if (status === "ready") {
    return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400";
  }
  if (status === "failed") {
    return "bg-destructive/15 text-destructive";
  }
  if (
    status === "joining" ||
    status === "recording" ||
    status === "dispatching" ||
    status === "transcribing" ||
    status === "analyzing" ||
    status === "uploading"
  ) {
    return "bg-[var(--accent-soft)] text-[var(--accent)]";
  }
  return "bg-[var(--bg-subtle)] text-[var(--ink-tertiary)]";
}

export function LiveSessionCard({
  session,
  userName,
  onChanged,
  onDelete,
}: LiveSessionCardProps) {
  const { t, locale } = useLocale();
  const { toast } = useToast();
  const [qaText, setQaText] = useState("");
  const [showExtras, setShowExtras] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

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

  const starts = new Date(session.startsAt);
  const when = starts.toLocaleString(locale === "he" ? "he-IL" : undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: session.timezone || undefined,
  });

  const closeoutReady =
    session.botStatus === "ready" || session.digest != null;
  const needsUpload =
    session.botStatus === "awaiting_recording" ||
    session.botStatus === "failed" ||
    session.botStatus === "scheduled";
  const inProgress = [
    "dispatching",
    "joining",
    "recording",
    "uploading",
    "transcribing",
    "analyzing",
  ].includes(session.botStatus);

  const handleReminder = async () => {
    if (!("Notification" in window)) {
      toast({ title: t.liveHubReminderUnsupported, variant: "error" });
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      toast({ title: t.liveHubReminderDenied, variant: "error" });
      return;
    }
    const delay = new Date(session.startsAt).getTime() - Date.now() - 5 * 60_000;
    if (delay <= 0) {
      new Notification(session.title, {
        body: t.liveHubReminderNow.replace("{url}", session.meetingUrl),
      });
    } else {
      window.setTimeout(() => {
        new Notification(session.title, {
          body: `${t.liveHubJoin} — ${session.meetingUrl}`,
        });
      }, Math.min(delay, 2_147_000_000));
    }
    toast({ title: t.liveHubReminderSet, variant: "success" });
  };

  const submitQa = async () => {
    if (!qaText.trim()) return;
    try {
      await postLiveMeetingQa(session.id, qaText, userName || t.liveHubYou);
      setQaText("");
      onChanged();
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : t.liveHubQaFail,
        variant: "error",
      });
    }
  };

  const uploadRecording = async (file: File) => {
    setUploading(true);
    setUploadPct(0);
    try {
      const pathname = buildLiveRecordingPath(session.ownerEmail, file.name);
      const tokenRes = await fetch(TRANSCRIPTION_UPLOAD_PATH, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "blob.generate-client-token",
          payload: { pathname, multipart: true, clientPayload: null },
        }),
      });
      const tokenBody = (await tokenRes.json()) as {
        clientToken?: string;
        error?: string;
      };
      if (!tokenRes.ok || !tokenBody.clientToken) {
        throw new Error(tokenBody.error || t.liveHubUploadAuthFail);
      }

      const blob = await put(pathname, file, {
        access: "private",
        token: tokenBody.clientToken,
        multipart: true,
        contentType: file.type || "video/mp4",
        onUploadProgress: (e) => {
          const total = e.total || file.size;
          setUploadPct(total ? Math.round((e.loaded / total) * 100) : 0);
        },
      });

      await attachMeetingRecording(session.id, {
        blobUrl: blob.url,
        pathname: blob.pathname,
        fileName: file.name,
        contentType: file.type || "video/mp4",
        fileSize: file.size,
      });

      toast({ title: t.liveHubUploadStarted, variant: "success" });
      onChanged();
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : t.liveHubUploadFail,
        variant: "error",
      });
    } finally {
      setUploading(false);
      setUploadPct(0);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <article className="staz-surface-card staz-surface-card--static overflow-hidden transition duration-200 hover:border-[color-mix(in_srgb,var(--accent)_22%,var(--line-subtle))]">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-6">
        <div className="min-w-0 flex-1 text-start">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-[var(--line-subtle)] bg-[var(--bg-subtle)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--ink-tertiary)]">
              {platformLabel[session.platform]}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                statusTone(session.botStatus),
              )}
            >
              <Bot className="h-3 w-3" aria-hidden />
              {statusLabels[session.botStatus]}
            </span>
          </div>
          <h3 className="text-lg font-semibold tracking-tight text-[var(--ink-primary)]">
            {session.title}
          </h3>
          {session.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-[var(--ink-secondary)]">
              {session.description}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-[var(--ink-tertiary)]">
            {when}
            {session.hostName ? ` · ${session.hostName}` : ""}
            {` · ${session.durationMinutes} ${t.liveHubMinutes}`}
          </p>
          {session.error ? (
            <p className="mt-2 text-xs text-destructive">{session.error}</p>
          ) : null}
        </div>
        <LiveCountdown
          startsAt={session.startsAt}
          durationMinutes={session.durationMinutes}
          liveLabel={t.liveHubLiveNow}
          pastLabel={t.liveHubEnded}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--line-subtle)] px-5 py-4 sm:px-6">
        <a
          href={session.meetingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="lat-btn-primary inline-flex items-center gap-2 !rounded-full !px-4"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          {t.liveHubJoin}
        </a>

        {closeoutReady ? (
          <Link
            href={`/live/${session.id}`}
            className="lat-btn-primary inline-flex items-center gap-2 !rounded-full !px-4 !bg-[var(--bg-elevated)] !text-[var(--ink-primary)] !shadow-none ring-1 ring-[var(--line-strong)]"
          >
            <FileVideo className="h-4 w-4" aria-hidden />
            {t.liveHubOpenCloseout}
          </Link>
        ) : inProgress || needsUpload ? (
          <Link
            href={`/live/${session.id}`}
            className="lat-btn-ghost inline-flex items-center gap-2 !rounded-full !px-3.5 !text-sm"
          >
            {t.liveHubViewStatus}
          </Link>
        ) : null}

        {needsUpload ? (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="lat-btn-ghost inline-flex items-center gap-2 !rounded-full !px-3.5 !text-sm disabled:opacity-60"
          >
            <Upload className="h-4 w-4" aria-hidden />
            {uploading ? `${uploadPct}%` : t.liveHubUploadRecording}
          </button>
        ) : null}

        <input
          ref={fileRef}
          type="file"
          accept="video/*,audio/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void uploadRecording(file);
          }}
        />

        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="lat-btn-ghost ms-auto inline-flex items-center gap-1.5 !rounded-full !px-3 !text-sm"
          aria-expanded={showMore}
        >
          <MoreHorizontal className="h-4 w-4" aria-hidden />
          {t.liveHubMore}
        </button>
      </div>

      {uploading ? (
        <div className="mx-5 mb-4 h-1.5 overflow-hidden rounded-full bg-[var(--bg-subtle)] sm:mx-6">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all"
            style={{ width: `${uploadPct}%` }}
          />
        </div>
      ) : null}

      {showMore ? (
        <div className="flex flex-wrap gap-2 border-t border-[var(--line-subtle)] bg-[var(--bg-subtle)]/40 px-5 py-3 sm:px-6">
          <a
            href={buildGoogleCalendarUrl(session)}
            target="_blank"
            rel="noopener noreferrer"
            className="lat-btn-ghost inline-flex items-center gap-2 !min-h-9 !rounded-full !px-3 !text-xs"
          >
            <CalendarPlus className="h-3.5 w-3.5" aria-hidden />
            {t.liveHubAddCalendar}
          </a>
          <a
            href={buildIcsDataUrl(session)}
            download={`${session.title.replace(/\s+/g, "-")}.ics`}
            className="lat-btn-ghost inline-flex items-center gap-2 !min-h-9 !rounded-full !px-3 !text-xs"
          >
            <Download className="h-3.5 w-3.5" aria-hidden />
            ICS
          </a>
          <button
            type="button"
            onClick={() => void handleReminder()}
            className="lat-btn-ghost inline-flex items-center gap-2 !min-h-9 !rounded-full !px-3 !text-xs"
          >
            <Bell className="h-3.5 w-3.5" aria-hidden />
            {t.liveHubSetReminder}
          </button>
          <button
            type="button"
            onClick={() => setShowExtras((v) => !v)}
            className="lat-btn-ghost inline-flex items-center gap-2 !min-h-9 !rounded-full !px-3 !text-xs"
          >
            <MessageSquare className="h-3.5 w-3.5" aria-hidden />
            {t.liveHubExtras}
            <ChevronDown
              className={cn("h-3.5 w-3.5 transition", showExtras && "rotate-180")}
              aria-hidden
            />
          </button>
          {!needsUpload ? (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="lat-btn-ghost inline-flex items-center gap-2 !min-h-9 !rounded-full !px-3 !text-xs disabled:opacity-60"
            >
              <Upload className="h-3.5 w-3.5" aria-hidden />
              {t.liveHubUploadRecording}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => onDelete(session.id)}
            className="lat-btn-ghost ms-auto inline-flex items-center gap-1.5 !min-h-9 !rounded-full !px-3 !text-xs !text-destructive hover:!bg-destructive/10"
            aria-label={t.liveHubDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t.liveHubDelete}
          </button>
        </div>
      ) : null}

      {showExtras ? (
        <div className="grid gap-4 border-t border-[var(--line-subtle)] px-5 py-5 md:grid-cols-2 sm:px-6">
          <div className="text-start">
            <h4 className="mb-2 text-sm font-semibold text-[var(--ink-primary)]">
              {t.liveHubAgenda}
            </h4>
            {session.agenda.length === 0 ? (
              <p className="text-xs text-[var(--ink-tertiary)]">
                {t.liveHubAgendaEmpty}
              </p>
            ) : (
              <ol className="list-decimal space-y-1 ps-4 text-sm text-[var(--ink-secondary)]">
                {session.agenda.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            )}
          </div>

          <div className="text-start">
            <h4 className="mb-2 text-sm font-semibold text-[var(--ink-primary)]">
              {t.liveHubQa}
            </h4>
            <div className="mb-3 max-h-40 space-y-2 overflow-y-auto rounded-xl border border-[var(--line-subtle)] bg-[var(--bg-subtle)]/50 p-3">
              {session.qa.length === 0 ? (
                <p className="text-xs text-[var(--ink-tertiary)]">
                  {t.liveHubQaEmpty}
                </p>
              ) : (
                session.qa.map((item) => (
                  <div key={item.id} className="text-sm">
                    <span className="font-semibold text-[var(--ink-primary)]">
                      {item.author}:{" "}
                    </span>
                    <span className="text-[var(--ink-secondary)]">{item.text}</span>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={qaText}
                onChange={(e) => setQaText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void submitQa();
                }}
                placeholder={t.liveHubQaPlaceholder}
                className="min-w-0 flex-1 rounded-xl border border-[var(--line-strong)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)]"
              />
              <button
                type="button"
                onClick={() => void submitQa()}
                className="lat-btn-primary !rounded-full !px-3.5 !text-sm"
              >
                {t.liveHubQaSend}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
