"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { MeetingWorkspace } from "@/features/workspace/components/MeetingWorkspace";
import type { TranscriptionResult } from "@/features/transcription/types";
import { cn } from "@/lib/utils";
import { fetchLiveMeeting } from "../api/live-meetings.api";
import type { LiveSessionPublic } from "../types";

type TabId = "summary" | "transcript" | "actions" | "media";

interface LiveSessionViewerProps {
  meetingId: string;
}

function isTranscriptionResult(value: unknown): value is TranscriptionResult {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return Array.isArray(v.transcript) && typeof v.fileName === "string";
}

export function LiveSessionViewer({ meetingId }: LiveSessionViewerProps) {
  const { t } = useLocale();
  const [meeting, setMeeting] = useState<LiveSessionPublic | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>("summary");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchLiveMeeting(meetingId);
      setMeeting(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load meeting.");
    } finally {
      setLoading(false);
    }
  }, [meetingId]);

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
        Loading session…
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <p className="text-sm text-destructive">{error || "Meeting not found"}</p>
        <Link href="/live" className="mt-4 inline-block text-sm text-accent hover:underline">
          Back to Live Hub
        </Link>
      </div>
    );
  }

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: "summary", label: "Summary" },
    { id: "transcript", label: "Transcript" },
    { id: "actions", label: "Action items" },
    { id: "media", label: "Media" },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/live"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t.liveHubTitle}
        </Link>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize text-muted-foreground">
          {meeting.botStatus.replace(/_/g, " ")}
        </span>
      </div>

      <header className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {meeting.title}
        </h1>
        {meeting.description && (
          <p className="mt-2 text-sm text-muted-foreground">{meeting.description}</p>
        )}
      </header>

      {!digest ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-accent" aria-hidden />
          <p className="text-sm font-medium text-foreground">
            {meeting.botStatus === "awaiting_recording"
              ? "Upload a recording from Live Hub to start the AI pipeline."
              : meeting.botStatus === "failed"
                ? meeting.error || "Processing failed."
                : "Waiting for recording & AI digest…"}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Status: {meeting.botStatus}
          </p>
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
                  "rounded-lg px-4 py-2 text-sm font-medium transition",
                  tab === item.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          {tab === "summary" && (
            <section className="space-y-4 rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              {digest.headline && (
                <h2 className="text-xl font-semibold text-foreground">
                  {digest.headline}
                </h2>
              )}
              {digest.summary.overview && (
                <p className="text-sm leading-relaxed text-foreground/90">
                  {digest.summary.overview}
                </p>
              )}
              {digest.summary.executive.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">
                    Executive summary
                  </h3>
                  <ul className="list-disc space-y-1 ps-5 text-sm text-foreground/85">
                    {digest.summary.executive.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
              {digest.topics && digest.topics.length > 0 && (
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
              )}
            </section>
          )}

          {tab === "transcript" && (
            <MeetingWorkspace
              result={digest}
              mediaSrc={mediaSrc}
              mediaKind={mediaKind}
            />
          )}

          {tab === "actions" && (
            <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              {digest.actionItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No action items.</p>
              ) : (
                <ul className="space-y-3">
                  {digest.actionItems.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3"
                    >
                      <p className="text-sm font-medium text-foreground">{item.task}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.owner} · {item.deadline}
                        {item.priority ? ` · ${item.priority}` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
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
                    Download recording
                  </a>
                  <p className="text-xs text-muted-foreground">
                    Secure authenticated stream for your account.
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recording file attached yet.
                </p>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
