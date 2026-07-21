"use client";

import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";
import {
  createLiveSession,
  detectPlatform,
  isValidMeetingUrl,
} from "../lib/live-store";
import type { LivePlatform } from "../types";

interface LiveSessionFormProps {
  email: string;
  hostName?: string | null;
  onCreated: () => void;
}

export function LiveSessionForm({
  email,
  hostName,
  onCreated,
}: LiveSessionFormProps) {
  const { t } = useLocale();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [agendaText, setAgendaText] = useState("");
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialUrl, setMaterialUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError(t.liveHubErrorTitle);
      return;
    }
    if (!isValidMeetingUrl(meetingUrl)) {
      setError(t.liveHubErrorUrl);
      return;
    }
    if (!startsAt) {
      setError(t.liveHubErrorTime);
      return;
    }

    const platform: LivePlatform = detectPlatform(meetingUrl);
    const agenda = agendaText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    createLiveSession(email, {
      title,
      description,
      platform,
      meetingUrl,
      startsAt: new Date(startsAt).toISOString(),
      durationMinutes,
      agenda,
      materials:
        materialTitle.trim() && materialUrl.trim()
          ? [{ title: materialTitle, url: materialUrl }]
          : [],
      hostName: hostName ?? undefined,
    });

    setTitle("");
    setDescription("");
    setMeetingUrl("");
    setStartsAt("");
    setAgendaText("");
    setMaterialTitle("");
    setMaterialUrl("");
    setOpen(false);
    onCreated();
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-start">
          <h2 className="text-base font-semibold text-foreground">
            {t.liveHubScheduleTitle}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.liveHubScheduleDesc}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-semibold",
            open ? "btn-secondary" : "btn-cinema",
          )}
        >
          {open ? t.liveHubCancel : t.liveHubNewSession}
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-start text-sm sm:col-span-2">
            <span className="font-medium text-foreground">{t.liveHubFieldTitle}</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2"
              required
            />
          </label>

          <label className="grid gap-1 text-start text-sm sm:col-span-2">
            <span className="font-medium text-foreground">{t.liveHubFieldUrl}</span>
            <input
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              placeholder="https://zoom.us/j/… or https://meet.google.com/…"
              className="rounded-xl border border-border bg-background px-3 py-2"
              required
            />
          </label>

          <label className="grid gap-1 text-start text-sm">
            <span className="font-medium text-foreground">{t.liveHubFieldStarts}</span>
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2"
              required
            />
          </label>

          <label className="grid gap-1 text-start text-sm">
            <span className="font-medium text-foreground">{t.liveHubFieldDuration}</span>
            <input
              type="number"
              min={15}
              max={480}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value) || 60)}
              className="rounded-xl border border-border bg-background px-3 py-2"
            />
          </label>

          <label className="grid gap-1 text-start text-sm sm:col-span-2">
            <span className="font-medium text-foreground">{t.liveHubFieldDesc}</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="rounded-xl border border-border bg-background px-3 py-2"
            />
          </label>

          <label className="grid gap-1 text-start text-sm sm:col-span-2">
            <span className="font-medium text-foreground">{t.liveHubFieldAgenda}</span>
            <textarea
              value={agendaText}
              onChange={(e) => setAgendaText(e.target.value)}
              rows={3}
              placeholder={t.liveHubAgendaPlaceholder}
              className="rounded-xl border border-border bg-background px-3 py-2"
            />
          </label>

          <label className="grid gap-1 text-start text-sm">
            <span className="font-medium text-foreground">{t.liveHubFieldMaterialTitle}</span>
            <input
              value={materialTitle}
              onChange={(e) => setMaterialTitle(e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-start text-sm">
            <span className="font-medium text-foreground">{t.liveHubFieldMaterialUrl}</span>
            <input
              value={materialUrl}
              onChange={(e) => setMaterialUrl(e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2"
            />
          </label>

          {error && (
            <p className="sm:col-span-2 text-sm text-destructive">{error}</p>
          )}

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="btn-cinema w-full rounded-xl px-4 py-3 text-sm font-semibold sm:w-auto"
            >
              {t.liveHubSave}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
