"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Bot, Plus, Radio, Sparkles, Video } from "lucide-react";
import { StazMark } from "@/components/brand/Logo";
import { useLocale } from "@/context/LocaleContext";
import { useToast } from "@/context/ToastContext";
import {
  createLiveMeeting,
  deleteLiveMeeting,
  fetchLiveMeetings,
  fetchLivePipelineStatus,
  kickLiveDispatch,
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
  const [formOpen, setFormOpen] = useState(false);
  const [autoJoin, setAutoJoin] = useState(false);
  const [closeoutReady, setCloseoutReady] = useState(true);

  const refresh = useCallback(async () => {
    if (!email) return;
    try {
      setError(null);
      const list = await fetchLiveMeetings();
      setSessions(list);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t.liveHubLoadError;
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [email, t.liveHubLoadError]);

  useEffect(() => {
    if (!email) return;
    void fetchLivePipelineStatus()
      .then((s) => {
        setAutoJoin(s.autoJoin);
        setCloseoutReady(s.closeoutReady);
      })
      .catch(() => {});
  }, [email]);

  useEffect(() => {
    if (!email) return;
    const kickoff = window.setTimeout(() => void refresh(), 0);
    const timer = window.setInterval(() => void refresh(), 15_000);

    const dispatchOnce = () => {
      void kickLiveDispatch();
    };
    const dispatchKickoff = window.setTimeout(dispatchOnce, 1_500);
    const dispatchTimer = window.setInterval(dispatchOnce, 30_000);

    return () => {
      window.clearTimeout(kickoff);
      window.clearInterval(timer);
      window.clearTimeout(dispatchKickoff);
      window.clearInterval(dispatchTimer);
    };
  }, [email, refresh]);

  useEffect(() => {
    if (!loading && sessions.length === 0) {
      setFormOpen(true);
    }
  }, [loading, sessions.length]);

  const handleCreated = async (
    input: Parameters<typeof createLiveMeeting>[0],
  ) => {
    const created = await createLiveMeeting(input);
    setSessions((prev) =>
      [...prev, created].sort(
        (a, b) =>
          new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
      ),
    );
    setFormOpen(false);
    void kickLiveDispatch();
    toast({ title: t.liveHubCreatedToast, variant: "success" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t.liveHubDeleteConfirm)) return;
    try {
      await deleteLiveMeeting(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      toast({ title: t.liveHubDeletedToast, variant: "success" });
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : t.liveHubDelete,
        variant: "error",
      });
    }
  };

  if (!email) return null;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 page-enter">
      <header className="staz-surface-card staz-surface-card--static relative overflow-hidden px-5 py-6 sm:px-7 sm:py-7">
        <div
          className="pointer-events-none absolute -end-20 -top-20 h-56 w-56 rounded-full bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-wrap items-start gap-4">
          <StazMark size={48} title="STAZ" />
          <div className="min-w-0 flex-1 text-start">
            <p className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              <Radio className="h-3.5 w-3.5" aria-hidden />
              {t.liveHubBadge}
            </p>
            <h1 className="font-brand text-xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-2xl">
              {t.liveHubTitle}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--ink-secondary)]">
              {t.liveHubDesc}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--ink-tertiary)]">
              <span
                className={
                  autoJoin
                    ? "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-400"
                    : "inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-amber-800 dark:text-amber-300"
                }
              >
                <Bot className="h-3.5 w-3.5" aria-hidden />
                {autoJoin ? t.liveHubModeAuto : t.liveHubModeManual}
              </span>
              <span
                className={
                  closeoutReady
                    ? "inline-flex items-center gap-1.5 rounded-full border border-[var(--line-subtle)] bg-[var(--bg-subtle)] px-3 py-1"
                    : "inline-flex items-center gap-1.5 rounded-full border border-destructive/25 bg-destructive/5 px-3 py-1 text-destructive"
                }
              >
                <Sparkles
                  className="h-3.5 w-3.5 text-[var(--accent)]"
                  aria-hidden
                />
                {closeoutReady
                  ? t.liveHubModeCloseoutOk
                  : t.liveHubModeCloseoutMissing}
              </span>
            </div>
          </div>
          {!formOpen ? (
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="lat-btn-primary inline-flex items-center gap-2 !rounded-full"
            >
              <Plus className="h-4 w-4" aria-hidden />
              {t.liveHubNewSession}
            </button>
          ) : null}
        </div>
      </header>

      {formOpen ? (
        <LiveSessionForm
          hostName={session?.user?.name}
          onCreated={handleCreated}
          onCancel={() => setFormOpen(false)}
        />
      ) : null}

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3 px-0.5">
          <h2 className="text-base font-semibold tracking-tight text-[var(--ink-primary)]">
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
                className="h-32 animate-pulse rounded-[1.15rem] border border-[var(--line-subtle)] bg-[var(--bg-subtle)]"
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
              className="mt-3 block w-full font-medium text-[var(--accent)] underline underline-offset-2"
              onClick={() => void refresh()}
            >
              {t.liveHubRetry}
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
              {t.liveHubEmptyHint}
            </p>
            {!formOpen ? (
              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="lat-btn-primary mt-5 inline-flex items-center gap-2 !rounded-full"
              >
                <Plus className="h-4 w-4" aria-hidden />
                {t.liveHubNewSession}
              </button>
            ) : null}
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((item) => (
              <LiveSessionCard
                key={item.id}
                session={item}
                userName={session?.user?.name}
                onChanged={() => void refresh()}
                onDelete={(id) => void handleDelete(id)}
              />
            ))}
          </div>
        )}
      </section>

      <p className="px-1 text-center text-xs leading-relaxed text-[var(--ink-tertiary)]">
        {autoJoin ? t.liveHubHowItWorks : t.liveHubHowItWorksManual}
      </p>
    </div>
  );
}
