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
    // Defer fetch so the effect stays a subscription setup (poll + initial load).
    const kickoff = window.setTimeout(() => void refresh(), 0);
    const timer = window.setInterval(() => void refresh(), 15_000);

    // Hobby-compatible bot dispatcher: ping while Live Hub is open.
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
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <header className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950 px-6 py-10 text-zinc-50 shadow-xl sm:px-10">
        <div
          className="pointer-events-none absolute -end-16 -top-16 h-56 w-56 rounded-full bg-accent/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 -start-10 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-wrap items-start gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-accent ring-1 ring-white/15 backdrop-blur">
            <Video className="h-7 w-7" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 text-start">
            <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              <Radio className="h-3.5 w-3.5" aria-hidden />
              {t.liveHubBadge}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {t.liveHubTitle}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
              {t.liveHubDesc}
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                <Bot className="h-3.5 w-3.5 text-accent" aria-hidden />
                Auto bot join
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
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
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {t.liveHubUpcoming}
          </h2>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {sessions.length} {t.liveHubSessions}
          </span>
        </div>

        {loading ? (
          <div className="space-y-3" aria-busy="true">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-2xl border border-border/50 bg-muted/40"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-8 text-center text-sm text-destructive">
            {error}
            <button
              type="button"
              className="mt-3 block w-full text-accent underline"
              onClick={() => void refresh()}
            >
              Retry
            </button>
          </div>
        ) : sessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center text-sm text-muted-foreground">
            {t.liveHubEmpty}
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

      <aside className="rounded-2xl border border-border/70 bg-card/80 p-5 text-start text-sm text-muted-foreground shadow-sm">
        <p className="font-medium text-foreground">{t.liveHubConfigTitle}</p>
        <p className="mt-2 leading-relaxed">{t.liveHubConfigBody}</p>
        <p className="mt-3">
          <Link href="/dashboard" className="font-medium text-accent hover:underline">
            Open dashboard
          </Link>
          {" · "}
          Set <code className="text-xs">RECALL_AI_API_KEY</code> for autonomous join,
          or upload recordings after the call.
        </p>
      </aside>
    </div>
  );
}
