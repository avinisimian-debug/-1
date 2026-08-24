"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Bot, Radio, Sparkles, Video } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { useToast } from "@/context/ToastContext";
import {
  createLiveMeeting,
  deleteLiveMeeting,
  fetchLiveMeetings,
} from "../api/live-meetings.api";
import type { LiveSessionPublic } from "../types";
import { LiveSessionCard } from "./LiveSessionCard";
import { LiveSessionForm } from "./LiveSessionForm";

export function LiveHub() {
  const { t } = useLocale();
  const { toast } = useToast();
  const { data: session } = useSession();
  const email = session?.user?.email?.toLowerCase() ?? "";
  const [sessions, setSessions] = useState<LiveSessionPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!email) return;
    try {
      setError(null);
      const list = await fetchLiveMeetings();
      setSessions(list);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not load meetings.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (!email) return;
    const kickoff = window.setTimeout(() => void refresh(), 0);
    const timer = window.setInterval(() => void refresh(), 15_000);

    const dispatchOnce = () => {
      void fetch("/api/live/dispatch", {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
    };
    const dispatchKickoff = window.setTimeout(dispatchOnce, 2_000);
    const dispatchTimer = window.setInterval(dispatchOnce, 60_000);

    return () => {
      window.clearTimeout(kickoff);
      window.clearInterval(timer);
      window.clearTimeout(dispatchKickoff);
      window.clearInterval(dispatchTimer);
    };
  }, [email, refresh]);

  const handleCreated = async (input: Parameters<typeof createLiveMeeting>[0]) => {
    const created = await createLiveMeeting(input);
    setSessions((prev) =>
      [...prev, created].sort(
        (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
      ),
    );
    toast({ title: t.liveHubSave, variant: "success" });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLiveMeeting(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : t.liveHubDelete,
        variant: "error",
      });
    }
  };

  if (!email) return null;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 page-enter">
      <header className="staz-surface-card staz-surface-card--static relative overflow-hidden px-5 py-6 sm:px-8 sm:py-7">
        <div
          className="pointer-events-none absolute -end-16 -top-16 h-48 w-48 rounded-full bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-wrap items-start gap-4 sm:gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] ring-1 ring-[color-mix(in_srgb,var(--accent)_18%,transparent)] sm:h-14 sm:w-14">
            <Video className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 text-start">
            <p className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              <Radio className="h-3.5 w-3.5" aria-hidden />
              {t.liveHubBadge}
            </p>
            <p className="text-lg font-semibold tracking-tight text-[var(--ink-primary)] sm:text-xl">
              {t.liveHubTitle}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-[0.95rem]">
              {t.liveHubDesc}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--ink-tertiary)]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line-subtle)] bg-[var(--bg-subtle)] px-3 py-1">
                <Bot className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden />
                Auto bot join
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line-subtle)] bg-[var(--bg-subtle)] px-3 py-1">
                <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden />
                AI digest after meeting
              </span>
            </div>
          </div>
        </div>
      </header>

      <LiveSessionForm
        hostName={session?.user?.name}
        onCreated={handleCreated}
      />

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold tracking-tight text-[var(--ink-primary)] sm:text-lg">
            {t.liveHubUpcoming}
          </h2>
          <span className="rounded-full bg-[var(--bg-subtle)] px-2.5 py-0.5 text-xs font-medium text-[var(--ink-tertiary)]">
            {sessions.length} {t.liveHubSessions}
          </span>
        </div>

        {loading ? (
          <div className="space-y-3" aria-busy="true">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-[1.15rem] border border-[var(--line-subtle)] bg-[var(--bg-subtle)]"
              />
            ))}
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-[1.15rem] border border-destructive/30 bg-destructive/5 px-6 py-8 text-center text-sm text-destructive"
          >
            {error}
            <button
              type="button"
              className="mt-3 block w-full text-[var(--accent)] underline underline-offset-2"
              onClick={() => void refresh()}
            >
              Retry
            </button>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center rounded-[1.15rem] border border-dashed border-[var(--line-strong)] bg-[var(--bg-subtle)]/40 px-6 py-14 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <Video className="h-6 w-6" strokeWidth={1.75} aria-hidden />
            </div>
            <p className="text-base font-semibold text-[var(--ink-primary)]">
              {t.liveHubEmpty}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--ink-tertiary)]">
              {t.liveHubScheduleDesc}
            </p>
          </div>
        ) : (
          sessions.map((item) => (
            <LiveSessionCard
              key={item.id}
              session={item}
              userName={session?.user?.name}
              onChanged={() => void refresh()}
              onDelete={(id) => void handleDelete(id)}
            />
          ))
        )}
      </section>

      <aside className="lat-panel p-5 text-start text-sm text-[var(--ink-secondary)]">
        <p className="font-medium text-[var(--ink-primary)]">{t.liveHubConfigTitle}</p>
        <p className="mt-2 leading-relaxed">{t.liveHubConfigBody}</p>
        <p className="mt-3">
          <Link href="/" className="font-medium text-[var(--accent)] hover:underline">
            Open workspace
          </Link>
          {" · "}
          Set <code className="rounded bg-[var(--bg-subtle)] px-1 text-xs">RECALL_AI_API_KEY</code> for
          autonomous join, or upload recordings after the call.
        </p>
      </aside>
    </div>
  );
}
