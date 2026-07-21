"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";
import { detectPlatform, isValidMeetingUrl } from "../lib/platform";
import type { LiveSessionInput } from "../types";

interface LiveSessionFormProps {
  hostName?: string | null;
  onCreated: (input: LiveSessionInput) => Promise<void>;
}

function defaultLocalDatetime(): string {
  const d = new Date(Date.now() + 60 * 60_000);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function LiveSessionForm({ hostName, onCreated }: LiveSessionFormProps) {
  const { t } = useLocale();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [startsAt, setStartsAt] = useState(defaultLocalDatetime);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [agendaText, setAgendaText] = useState("");
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialUrl, setMaterialUrl] = useState("");
  const [botEnabled, setBotEnabled] = useState(true);
  const [diarization, setDiarization] = useState(true);
  const [language, setLanguage] = useState("auto");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(true);

  const timezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    [],
  );

  const submit = async (e: React.FormEvent) => {
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

    const agenda = agendaText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    setSubmitting(true);
    try {
      await onCreated({
        title,
        description,
        platform: detectPlatform(meetingUrl),
        meetingUrl,
        startsAt: new Date(startsAt).toISOString(),
        timezone,
        durationMinutes,
        agenda,
        materials:
          materialTitle.trim() && materialUrl.trim()
            ? [{ title: materialTitle, url: materialUrl }]
            : [],
        hostName: hostName ?? undefined,
        bot: {
          enabled: botEnabled,
          diarization,
          language,
          joinEarlyMinutes: 2,
        },
      });

      setTitle("");
      setDescription("");
      setMeetingUrl("");
      setStartsAt(defaultLocalDatetime());
      setAgendaText("");
      setMaterialTitle("");
      setMaterialUrl("");
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not schedule meeting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-start">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
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
            "rounded-xl px-4 py-2 text-sm font-semibold transition",
            open ? "btn-secondary" : "btn-cinema",
          )}
        >
          {open ? t.liveHubCancel : t.liveHubNewSession}
        </button>
      </div>

      {open && (
        <form onSubmit={(e) => void submit(e)} className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-start text-sm sm:col-span-2">
            <span className="font-medium text-foreground">{t.liveHubFieldTitle}</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2.5 outline-none ring-accent/30 focus:ring-2"
              required
            />
          </label>

          <label className="grid gap-1 text-start text-sm sm:col-span-2">
            <span className="font-medium text-foreground">{t.liveHubFieldUrl}</span>
            <input
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              placeholder="Zoom · Meet · Teams · rtmp:// · WebRTC"
              className="rounded-xl border border-border bg-background px-3 py-2.5 outline-none ring-accent/30 focus:ring-2"
              required
            />
          </label>

          <label className="grid gap-1 text-start text-sm">
            <span className="font-medium text-foreground">{t.liveHubFieldStarts}</span>
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2.5 outline-none ring-accent/30 focus:ring-2"
              required
            />
            <span className="text-[11px] text-muted-foreground">{timezone}</span>
          </label>

          <label className="grid gap-1 text-start text-sm">
            <span className="font-medium text-foreground">{t.liveHubFieldDuration}</span>
            <input
              type="number"
              min={15}
              max={480}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value) || 60)}
              className="rounded-xl border border-border bg-background px-3 py-2.5 outline-none ring-accent/30 focus:ring-2"
            />
          </label>

          <label className="grid gap-1 text-start text-sm sm:col-span-2">
            <span className="font-medium text-foreground">{t.liveHubFieldDesc}</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="rounded-xl border border-border bg-background px-3 py-2.5 outline-none ring-accent/30 focus:ring-2"
            />
          </label>

          <label className="grid gap-1 text-start text-sm sm:col-span-2">
            <span className="font-medium text-foreground">{t.liveHubFieldAgenda}</span>
            <textarea
              value={agendaText}
              onChange={(e) => setAgendaText(e.target.value)}
              rows={3}
              placeholder={t.liveHubAgendaPlaceholder}
              className="rounded-xl border border-border bg-background px-3 py-2.5 outline-none ring-accent/30 focus:ring-2"
            />
          </label>

          <label className="grid gap-1 text-start text-sm">
            <span className="font-medium text-foreground">{t.liveHubFieldMaterialTitle}</span>
            <input
              value={materialTitle}
              onChange={(e) => setMaterialTitle(e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2.5"
            />
          </label>
          <label className="grid gap-1 text-start text-sm">
            <span className="font-medium text-foreground">{t.liveHubFieldMaterialUrl}</span>
            <input
              value={materialUrl}
              onChange={(e) => setMaterialUrl(e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2.5"
            />
          </label>

          <div className="sm:col-span-2 grid gap-3 rounded-xl border border-border/70 bg-muted/20 p-4 sm:grid-cols-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={botEnabled}
                onChange={(e) => setBotEnabled(e.target.checked)}
                className="size-4 rounded border-border accent-[var(--accent)]"
              />
              <span>Auto-join bot</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={diarization}
                onChange={(e) => setDiarization(e.target.checked)}
                className="size-4 rounded border-border accent-[var(--accent)]"
              />
              <span>Speaker diarization</span>
            </label>
            <label className="grid gap-1 text-start text-sm">
              <span className="text-xs text-muted-foreground">Language</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
              >
                <option value="auto">Auto-detect</option>
                <option value="en">English</option>
                <option value="he">Hebrew</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ar">Arabic</option>
              </select>
            </label>
          </div>

          {error && (
            <p className="sm:col-span-2 text-sm text-destructive">{error}</p>
          )}

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-cinema w-full rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-60 sm:w-auto"
            >
              {submitting ? "Scheduling…" : t.liveHubSave}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
