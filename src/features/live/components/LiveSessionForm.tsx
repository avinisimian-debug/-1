"use client";

import { ChevronDown, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";
import { detectPlatform, isValidMeetingUrl } from "../lib/platform";
import type { LiveSessionInput } from "../types";

interface LiveSessionFormProps {
  hostName?: string | null;
  onCreated: (input: LiveSessionInput) => Promise<void>;
  onCancel?: () => void;
}

function defaultLocalDatetime(): string {
  const d = new Date(Date.now() + 60 * 60_000);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

const PLATFORM_HE: Record<string, string> = {
  zoom: "Zoom",
  google_meet: "Google Meet",
  microsoft_teams: "Teams",
  rtmp: "RTMP",
  webrtc: "WebRTC",
  other: "קישור פגישה",
};

export function LiveSessionForm({
  hostName,
  onCreated,
  onCancel,
}: LiveSessionFormProps) {
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
  const [language, setLanguage] = useState("he");
  const [attendeesText, setAttendeesText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  const timezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jerusalem",
    [],
  );

  const detected = meetingUrl.trim()
    ? detectPlatform(meetingUrl)
    : null;

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
        attendeeEmails: attendeesText
          .split(/[,;\s]+/)
          .map((e) => e.trim())
          .filter(Boolean),
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
      setAttendeesText("");
      setMoreOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.liveHubScheduleFail);
    } finally {
      setSubmitting(false);
    }
  };

  const field =
    "rounded-xl border border-[var(--line-strong)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm text-[var(--ink-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)]";

  return (
    <div className="staz-surface-card staz-surface-card--static overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line-subtle)] px-5 py-4 sm:px-6">
        <div className="text-start">
          <h2 className="text-base font-semibold tracking-tight text-[var(--ink-primary)]">
            {t.liveHubScheduleTitle}
          </h2>
          <p className="mt-1 text-sm text-[var(--ink-secondary)]">
            {t.liveHubScheduleDesc}
          </p>
        </div>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="lat-btn-ghost !min-h-9 !rounded-full !px-3.5 !text-sm"
          >
            {t.liveHubCancel}
          </button>
        ) : null}
      </div>

      <form
        onSubmit={(e) => void submit(e)}
        className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6 sm:py-6"
      >
        <label className="grid gap-1.5 text-start text-sm sm:col-span-2">
          <span className="font-medium text-[var(--ink-primary)]">
            {t.liveHubFieldTitle}
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={field}
            placeholder={t.liveHubTitlePlaceholder}
            required
          />
        </label>

        <div className="grid gap-2 text-start text-sm sm:col-span-2">
          <label className="grid gap-1.5">
            <span className="font-medium text-[var(--ink-primary)]">
              {t.liveHubFieldUrl}
            </span>
            <input
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              placeholder="https://meet.google.com/… · zoom.us · teams.microsoft.com"
              className={field}
              required
              aria-describedby="live-meeting-bot-transparency"
            />
          </label>
          {detected && detected !== "other" ? (
            <p className="text-xs font-medium text-[var(--accent)]">
              {t.liveHubDetectedPlatform.replace(
                "{platform}",
                PLATFORM_HE[detected] ?? detected,
              )}
            </p>
          ) : null}
          <p
            id="live-meeting-bot-transparency"
            className="flex items-start gap-2.5 rounded-xl border border-[color-mix(in_srgb,var(--accent)_22%,transparent)] bg-[var(--accent-soft)] px-3.5 py-3 text-[13px] leading-relaxed text-[var(--ink-secondary)]"
          >
            <ShieldCheck
              className="mt-0.5 size-4 shrink-0 text-[var(--accent)]"
              aria-hidden
            />
            <span>{t.liveHubBotTransparency}</span>
          </p>
        </div>

        <label className="grid gap-1.5 text-start text-sm">
          <span className="font-medium text-[var(--ink-primary)]">
            {t.liveHubFieldStarts}
          </span>
          <input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            className={field}
            required
          />
          <span className="text-[11px] text-[var(--ink-tertiary)]">{timezone}</span>
        </label>

        <label className="grid gap-1.5 text-start text-sm">
          <span className="font-medium text-[var(--ink-primary)]">
            {t.liveHubFieldDuration}
          </span>
          <input
            type="number"
            min={15}
            max={480}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value) || 60)}
            className={field}
          />
        </label>

        <div className="sm:col-span-2 grid gap-3 rounded-xl border border-[var(--line-subtle)] bg-[var(--bg-subtle)]/60 p-4 sm:grid-cols-3">
          <label className="flex items-center gap-2.5 text-sm text-[var(--ink-primary)]">
            <input
              type="checkbox"
              checked={botEnabled}
              onChange={(e) => setBotEnabled(e.target.checked)}
              className="size-4 rounded border-[var(--line-strong)] accent-[var(--accent)]"
            />
            <span>{t.liveHubBotAutoJoin}</span>
          </label>
          <label className="flex items-center gap-2.5 text-sm text-[var(--ink-primary)]">
            <input
              type="checkbox"
              checked={diarization}
              onChange={(e) => setDiarization(e.target.checked)}
              className="size-4 rounded border-[var(--line-strong)] accent-[var(--accent)]"
            />
            <span>{t.liveHubBotDiarization}</span>
          </label>
          <label className="grid gap-1 text-start text-sm">
            <span className="text-xs text-[var(--ink-tertiary)]">
              {t.liveHubBotLanguage}
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={cn(field, "!py-1.5")}
            >
              <option value="auto">{t.langAuto}</option>
              <option value="he">{t.langHe}</option>
              <option value="en">{t.langEn}</option>
              <option value="ar">{t.langAr}</option>
              <option value="es">{t.langEs}</option>
              <option value="fr">{t.langFr}</option>
            </select>
          </label>
        </div>

        <div className="sm:col-span-2">
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--ink-secondary)] transition hover:text-[var(--ink-primary)]"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                moreOpen && "rotate-180",
              )}
              aria-hidden
            />
            {t.liveHubMoreOptions}
          </button>
        </div>

        {moreOpen ? (
          <>
            <label className="grid gap-1.5 text-start text-sm sm:col-span-2">
              <span className="font-medium text-[var(--ink-primary)]">
                {t.liveHubFieldDesc}
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className={field}
              />
            </label>

            <label className="grid gap-1.5 text-start text-sm sm:col-span-2">
              <span className="font-medium text-[var(--ink-primary)]">
                {t.liveHubFieldAgenda}
              </span>
              <textarea
                value={agendaText}
                onChange={(e) => setAgendaText(e.target.value)}
                rows={3}
                placeholder={t.liveHubAgendaPlaceholder}
                className={field}
              />
            </label>

            <label className="grid gap-1.5 text-start text-sm">
              <span className="font-medium text-[var(--ink-primary)]">
                {t.liveHubFieldMaterialTitle}
              </span>
              <input
                value={materialTitle}
                onChange={(e) => setMaterialTitle(e.target.value)}
                className={field}
              />
            </label>
            <label className="grid gap-1.5 text-start text-sm">
              <span className="font-medium text-[var(--ink-primary)]">
                {t.liveHubFieldMaterialUrl}
              </span>
              <input
                value={materialUrl}
                onChange={(e) => setMaterialUrl(e.target.value)}
                className={field}
              />
            </label>

            <label className="grid gap-1.5 text-start text-sm sm:col-span-2">
              <span className="font-medium text-[var(--ink-primary)]">
                {t.liveAttendeesLabel}
              </span>
              <input
                value={attendeesText}
                onChange={(e) => setAttendeesText(e.target.value)}
                placeholder="name@company.co.il, …"
                className={field}
              />
              <span className="text-[11px] text-[var(--ink-tertiary)]">
                {t.liveAttendeesHint}
              </span>
            </label>
          </>
        ) : null}

        {error ? (
          <p
            role="alert"
            className="sm:col-span-2 rounded-xl border border-destructive/25 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}

        <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="lat-btn-primary !rounded-full disabled:opacity-60"
          >
            {submitting ? t.liveHubScheduling : t.liveHubSave}
          </button>
          <p className="text-xs text-[var(--ink-tertiary)]">
            {t.liveHubSaveHint}
          </p>
        </div>
      </form>
    </div>
  );
}
