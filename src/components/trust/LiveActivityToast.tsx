"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Download, FileCheck, Sparkles, UserPlus, Zap } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import {
  pickRandomLiveActivity,
  type LiveActivityEvent,
} from "@/lib/trust-data";
import { cn } from "@/lib/utils";

const ICONS = {
  signup: UserPlus,
  transcription: FileCheck,
  upgrade: Zap,
  export: Sparkles,
  download: Download,
} as const;

const DISMISS_KEY = "staz-live-activity-dismissed";

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
    download: t.liveActivityDownload,
  };
  return templates[event.type]
    .replace("{name}", vars.name)
    .replace("{location}", vars.location);
}

function formatTimeAgo(minutes: number, t: ReturnType<typeof useLocale>["t"]): string {
  if (minutes <= 1) return t.liveActivityJustNow;
  return t.liveActivityMinutesAgo.replace("{n}", String(minutes));
}

type LiveActivityToastProps = {
  /** Extra bottom offset on landing pages with a fixed mobile CTA. */
  landingOffset?: boolean;
};

export function LiveActivityToast({ landingOffset }: LiveActivityToastProps) {
  const { t, locale } = useLocale();
  const pathname = usePathname();
  const { status } = useSession();
  const [event, setEvent] = useState<LiveActivityEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const isMarketing =
    landingOffset ??
    (status !== "authenticated" || pathname === "/login");

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "1") {
        setDismissed(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    setEvent(pickRandomLiveActivity(locale));
  }, [locale]);

  useEffect(() => {
    if (dismissed || !event) return;

    const initial = setTimeout(() => setVisible(true), 2800);
    return () => clearTimeout(initial);
  }, [dismissed, event]);

  useEffect(() => {
    if (dismissed) return;

    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setEvent(pickRandomLiveActivity(locale));
        setVisible(true);
      }, 420);
    }, 8500);

    return () => clearInterval(cycle);
  }, [dismissed, locale]);

  if (dismissed || !event) return null;

  const Icon = ICONS[event.type];

  return (
    <div
      className={cn(
        "pointer-events-none fixed z-[45] max-w-xs sm:max-w-sm",
        "start-4 sm:start-6",
        isMarketing
          ? "bottom-[calc(5.75rem+env(safe-area-inset-bottom,0px))] lg:bottom-6"
          : "bottom-4 sm:bottom-6",
        "transition-all duration-500 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
      )}
    >
      <div className="pointer-events-auto flex items-start gap-3 rounded-xl border border-white/12 bg-[#0a1210]/95 px-3.5 py-3 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.85)] backdrop-blur-md">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/8">
          <Icon className="h-4 w-4 text-[#5eead4]" />
          <span className="absolute -end-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#0a1210]" />
        </div>
        <div className="min-w-0 flex-1 text-start">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
            {t.liveActivityLabel}
          </p>
          <p className="mt-0.5 text-xs leading-snug text-white/90">
            {formatActivityMessage(event, t)}
          </p>
          <p className="mt-1 text-[10px] text-white/45">
            {formatTimeAgo(event.minutesAgo, t)}
          </p>
        </div>
        <button
          type="button"
          aria-label={t.liveActivityDismiss}
          onClick={() => {
            setDismissed(true);
            try {
              sessionStorage.setItem(DISMISS_KEY, "1");
            } catch {
              /* ignore */
            }
          }}
          className="shrink-0 rounded-md p-1 text-white/40 transition-colors hover:bg-white/8 hover:text-white/70"
        >
          <span className="text-xs leading-none">×</span>
        </button>
      </div>
    </div>
  );
}
