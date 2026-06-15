"use client";

import { useEffect, useState } from "react";
import { FileCheck, Sparkles, UserPlus, Zap } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { LIVE_ACTIVITY_EVENTS, type LiveActivityEvent } from "@/lib/trust-data";
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
  const { t } = useLocale();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const event = LIVE_ACTIVITY_EVENTS[index % LIVE_ACTIVITY_EVENTS.length];
  const Icon = ICONS[event.type];

  useEffect(() => {
    const initial = setTimeout(() => setVisible(true), 2400);
    return () => clearTimeout(initial);
  }, []);

  useEffect(() => {
    if (dismissed) return;

    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % LIVE_ACTIVITY_EVENTS.length);
        setVisible(true);
      }, 400);
    }, 9000);

    return () => clearInterval(cycle);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed bottom-4 start-4 z-[45] max-w-xs sm:max-w-sm",
        "transition-all duration-500 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
      )}
    >
      <div className="pointer-events-auto flex items-start gap-3 rounded-lg border border-zinc-200/80 bg-white/95 px-3.5 py-3 shadow-lg shadow-zinc-900/5 backdrop-blur-md">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-100">
          <Icon className="h-4 w-4 text-zinc-600" />
          <span className="absolute -end-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
            {t.liveActivityLabel}
          </p>
          <p className="mt-0.5 text-xs leading-snug text-zinc-700">
            {formatActivityMessage(event, t)}
          </p>
          <p className="mt-1 text-[10px] text-zinc-400">
            {formatTimeAgo(event.minutesAgo, t)}
          </p>
        </div>
        <button
          type="button"
          aria-label={t.liveActivityDismiss}
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded p-1 text-zinc-300 hover:bg-zinc-100 hover:text-zinc-500"
        >
          <span className="text-xs leading-none">×</span>
        </button>
      </div>
    </div>
  );
}
