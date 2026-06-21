"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { FileCheck, Sparkles, UserPlus, Zap } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import {
  getLiveActivityEvents,
  type LiveActivityEvent,
} from "@/lib/trust-data";
import { cn } from "@/lib/utils";

const ICONS = {
  signup: UserPlus,
  transcription: FileCheck,
  upgrade: Zap,
  export: Sparkles,
} as const;

function formatActivityMessage(
  event: LiveActivityEvent,
  t: ReturnType<typeof useLocale>["t"],
): string {
  const vars = { name: event.name, location: event.location };
  const templates = {
    signup: t.liveActivitySignup,
    transcription: t.liveActivityTranscription,
    upgrade: t.liveActivityUpgrade,
    export: t.liveActivityExport,
  };
  return templates[event.type]
    .replace("{name}", vars.name)
    .replace("{location}", vars.location);
}

function formatTimeAgo(minutes: number, t: ReturnType<typeof useLocale>["t"]): string {
  if (minutes <= 1) return t.liveActivityJustNow;
  return t.liveActivityMinutesAgo.replace("{n}", String(minutes));
}

export function LiveActivityToast() {
  const { t, locale } = useLocale();
  const { status } = useSession();
  const events = useMemo(() => getLiveActivityEvents(locale), [locale]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const event = events[index % events.length];
  const Icon = ICONS[event.type];

  useEffect(() => {
    setIndex(0);
  }, [locale]);

  useEffect(() => {
    const initial = setTimeout(() => setVisible(true), 2400);
    return () => clearTimeout(initial);
  }, []);

  useEffect(() => {
    if (dismissed) return;

    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % events.length);
        setVisible(true);
      }, 400);
    }, 9000);

    return () => clearInterval(cycle);
  }, [dismissed, events.length]);

  if (dismissed || status !== "authenticated") return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed bottom-4 z-[45] max-w-xs sm:max-w-sm",
        "start-4 sm:start-6",
        "transition-all duration-500 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
      )}
    >
      <div className="pointer-events-auto flex items-start gap-3 rounded-xl border border-border/80 bg-card/95 px-3.5 py-3 shadow-lg backdrop-blur-md">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="absolute -end-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-card" />
        </div>
        <div className="min-w-0 flex-1 text-start">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
            {t.liveActivityLabel}
          </p>
          <p className="mt-0.5 text-xs leading-snug text-foreground/90">
            {formatActivityMessage(event, t)}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            {formatTimeAgo(event.minutesAgo, t)}
          </p>
        </div>
        <button
          type="button"
          aria-label={t.liveActivityDismiss}
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-md p-1 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-muted-foreground"
        >
          <span className="text-xs leading-none">×</span>
        </button>
      </div>
    </div>
  );
}
