"use client";

import { useState } from "react";
import {
  Bell,
  CalendarPlus,
  Download,
  ExternalLink,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";
import { buildGoogleCalendarUrl, buildIcsDataUrl } from "../lib/calendar";
import { addLiveQa } from "../lib/live-store";
import type { LiveSession } from "../types";
import { LiveCountdown } from "./LiveCountdown";

interface LiveSessionCardProps {
  session: LiveSession;
  email: string;
  userName?: string | null;
  onChanged: () => void;
  onDelete: (id: string) => void;
}

const platformLabel: Record<LiveSession["platform"], string> = {
  zoom: "Zoom",
  google_meet: "Google Meet",
  other: "Meeting",
};

export function LiveSessionCard({
  session,
  email,
  userName,
  onChanged,
  onDelete,
}: LiveSessionCardProps) {
  const { t } = useLocale();
  const { toast } = useToast();
  const [qaText, setQaText] = useState("");
  const [showExtras, setShowExtras] = useState(false);

  const starts = new Date(session.startsAt);
  const when = starts.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleReminder = async () => {
    if (!("Notification" in window)) {
      toast({
        title: t.liveHubReminderUnsupported,
        variant: "error",
      });
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

  const submitQa = () => {
    if (!qaText.trim()) return;
    addLiveQa(email, session.id, userName || "You", qaText);
    setQaText("");
    onChanged();
  };

  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border border-border/80 bg-card p-5 shadow-sm",
        "transition-transform duration-300 hover:-translate-y-0.5 sm:p-6",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 text-start">
          <div className="mb-2 inline-flex items-center rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
            {platformLabel[session.platform]}
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
          </p>
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

            <h4 className="mb-2 mt-4 text-sm font-semibold text-foreground">
              {t.liveHubMaterials}
            </h4>
            {session.materials.length === 0 ? (
              <p className="text-xs text-muted-foreground">{t.liveHubMaterialsEmpty}</p>
            ) : (
              <ul className="space-y-1.5">
                {session.materials.map((m) => (
                  <li key={m.id}>
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-accent hover:underline"
                    >
                      {m.title}
                    </a>
                  </li>
                ))}
              </ul>
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
                  if (e.key === "Enter") submitQa();
                }}
                placeholder={t.liveHubQaPlaceholder}
                className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={submitQa}
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
