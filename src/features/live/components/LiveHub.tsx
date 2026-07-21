"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Radio, Video } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import {
  deleteLiveSession,
  listLiveSessions,
  seedDemoSessions,
} from "../lib/live-store";
import type { LiveSession } from "../types";
import { LiveSessionCard } from "./LiveSessionCard";
import { LiveSessionForm } from "./LiveSessionForm";

export function LiveHub() {
  const { t } = useLocale();
  const { data: session } = useSession();
  const email = session?.user?.email?.toLowerCase() ?? "";
  const [sessions, setSessions] = useState<LiveSession[]>([]);

  const refresh = useCallback(() => {
    if (!email) return;
    setSessions(listLiveSessions(email));
  }, [email]);

  useEffect(() => {
    if (!email) return;
    seedDemoSessions(email);
    refresh();
  }, [email, refresh]);

  const handleDelete = (id: string) => {
    if (!email) return;
    deleteLiveSession(email, id);
    refresh();
  };

  if (!email) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-border/80 bg-zinc-950 px-6 py-8 text-zinc-50 shadow-lg sm:px-8">
        <div
          className="pointer-events-none absolute -end-10 -top-10 h-40 w-40 rounded-full bg-accent/40 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-wrap items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/25 text-accent">
            <Video className="h-6 w-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 text-start">
            <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
              <Radio className="h-3.5 w-3.5" aria-hidden />
              {t.liveHubBadge}
            </p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t.liveHubTitle}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-300 sm:text-base">
              {t.liveHubDesc}
            </p>
          </div>
        </div>
      </header>

      <LiveSessionForm
        email={email}
        hostName={session?.user?.name}
        onCreated={refresh}
      />

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground">
            {t.liveHubUpcoming}
          </h2>
          <span className="text-xs text-muted-foreground">
            {sessions.length} {t.liveHubSessions}
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center text-sm text-muted-foreground">
            {t.liveHubEmpty}
          </div>
        ) : (
          sessions.map((item) => (
            <LiveSessionCard
              key={item.id}
              session={item}
              email={email}
              userName={session?.user?.name}
              onChanged={refresh}
              onDelete={handleDelete}
            />
          ))
        )}
      </section>

      <aside className="rounded-2xl border border-border/70 bg-muted/30 p-5 text-start text-sm text-muted-foreground">
        <p className="font-medium text-foreground">{t.liveHubConfigTitle}</p>
        <p className="mt-2">{t.liveHubConfigBody}</p>
      </aside>
    </div>
  );
}
