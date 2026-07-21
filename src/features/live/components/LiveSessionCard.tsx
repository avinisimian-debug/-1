"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Bot,
  CalendarPlus,
  Download,
  ExternalLink,
  FileVideo,
  MessageSquare,
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
  other: "Meeting",
};

const statusLabel: Record<BotStatus, string> = {
  scheduled: "Scheduled",
  dispatching: "Dispatching bot…",
  joining: "Bot joining…",
  recording: "Recording",
  uploading: "Uploading",
  transcribing: "Transcribing…",
  analyzing: "AI analysis…",
  ready: "Digest ready",
  failed: "Failed",
  cancelled: "Cancelled",
  awaiting_recording: "Awaiting recording",
};

export function LiveSessionCard({
  session,
  userName,
  onChanged,
  onDelete,
}: LiveSessionCardProps) {
  const { t } = useLocale();
  const { toast } = useToast();
  const [qaText, setQaText] = useState("");
  const [showExtras, setShowExtras] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const starts = new Date(session.startsAt);
  const when = starts.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: session.timezone || undefined,
  });

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
      await postLiveMeetingQa(session.id, qaText, userName || "You");
      setQaText("");
      onChanged();
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : "Q&A failed",
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
        throw new Error(tokenBody.error || "Upload authorization failed.");
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

      toast({ title: "Recording uploaded — AI pipeline started", variant: "success" });
      onChanged();
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : "Upload failed",
        variant: "error",
      });
    } finally {
      setUploading(false);
      setUploadPct(0);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border border-border/80 bg-card p-5 shadow-sm",
        "transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-6",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 text-start">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
              {platformLabel[session.platform]}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                session.botStatus === "ready"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : session.botStatus === "failed"
                    ? "bg-destructive/15 text-destructive"
                    : "bg-muted text-muted-foreground",
              )}
            >
              <Bot className="h-3 w-3" aria-hidden />
              {statusLabel[session.botStatus]}
            </span>
          </div>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {session.title}
          </h3>
          {session.description && (
            <p className="mt-1 text-sm text-muted-foreground">{session.description}</p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            {when}
            {session.hostName ? ` · ${session.hostName}` : ""}
            {` · ${session.durationMinutes} ${t.liveHubMinutes}`}
            {session.timezone ? ` · ${session.timezone}` : ""}
          </p>
          {session.error && (
            <p className="mt-2 text-xs text-destructive">{session.error}</p>
          )}
        </div>
        <LiveCountdown
          startsAt={session.startsAt}
          durationMinutes={session.durationMinutes}
          liveLabel={t.liveHubLiveNow}
          pastLabel={t.liveHubEnded}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href={session.meetingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-cinema inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          {t.liveHubJoin}
        </a>

        {(session.botStatus === "ready" || session.digest != null) && (
          <Link
            href={`/live/${session.id}`}
            className="btn-cinema inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            <FileVideo className="h-4 w-4" aria-hidden />
            Open digest
          </Link>
        )}

        <a
          href={buildGoogleCalendarUrl(session)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium"
        >
          <CalendarPlus className="h-4 w-4" aria-hidden />
          {t.liveHubAddCalendar}
        </a>
        <a
          href={buildIcsDataUrl(session)}
          download={`${session.title.replace(/\s+/g, "-")}.ics`}
          className="btn-secondary inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium"
        >
          <Download className="h-4 w-4" aria-hidden />
          ICS
        </a>
        <button
          type="button"
          onClick={() => void handleReminder()}
          className="btn-secondary inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium"
        >
          <Bell className="h-4 w-4" aria-hidden />
          {t.liveHubSetReminder}
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="btn-secondary inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium disabled:opacity-60"
        >
          <Upload className="h-4 w-4" aria-hidden />
          {uploading ? `${uploadPct}%` : "Upload recording"}
        </button>
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
          onClick={() => setShowExtras((v) => !v)}
          className="btn-secondary inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium"
        >
          <MessageSquare className="h-4 w-4" aria-hidden />
          {t.liveHubExtras}
        </button>
        <button
          type="button"
          onClick={() => onDelete(session.id)}
          className="ms-auto inline-flex items-center gap-1 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-destructive"
          aria-label={t.liveHubDelete}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {uploading && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${uploadPct}%` }}
          />
        </div>
      )}

      {showExtras && (
        <div className="mt-5 grid gap-4 border-t border-border/70 pt-5 md:grid-cols-2">
          <div className="text-start">
            <h4 className="mb-2 text-sm font-semibold text-foreground">
              {t.liveHubAgenda}
            </h4>
            {session.agenda.length === 0 ? (
              <p className="text-xs text-muted-foreground">{t.liveHubAgendaEmpty}</p>
            ) : (
              <ol className="list-decimal space-y-1 ps-4 text-sm text-foreground/90">
                {session.agenda.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            )}
          </div>

          <div className="text-start">
            <h4 className="mb-2 text-sm font-semibold text-foreground">
              {t.liveHubQa}
            </h4>
            <div className="mb-3 max-h-40 space-y-2 overflow-y-auto rounded-xl border border-border/60 bg-muted/30 p-3">
              {session.qa.length === 0 ? (
                <p className="text-xs text-muted-foreground">{t.liveHubQaEmpty}</p>
              ) : (
                session.qa.map((item) => (
                  <div key={item.id} className="text-sm">
                    <span className="font-semibold text-foreground">
                      {item.author}:{" "}
                    </span>
                    <span className="text-foreground/85">{item.text}</span>
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
                className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => void submitQa()}
                className="btn-cinema rounded-xl px-3 py-2 text-sm font-semibold"
              >
                {t.liveHubQaSend}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
