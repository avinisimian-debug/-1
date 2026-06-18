"use client";

import { useEffect, useState } from "react";
import { Play, Sparkles } from "lucide-react";
import { LoginProductPreview } from "@/components/auth/LoginProductPreview";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

export function LoginDemoSection({ className }: { className?: string }) {
  const { t } = useLocale();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!playing) {
      setProgress(0);
      return;
    }

    const start = Date.now();
    const duration = 4200;

    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const next = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(next);
      if (next >= 100) clearInterval(tick);
    }, 80);

    return () => clearInterval(tick);
  }, [playing]);

  return (
    <section className={cn("w-full", className)}>
      <div className="mb-8 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-600">
          {t.authDemoEyebrow}
        </p>
        <h2 className="text-2xl font-semibold text-zinc-900 sm:text-3xl">
          {t.authDemoTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500 sm:text-base">
          {t.authDemoSubtitle}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xl shadow-zinc-900/5">
        {!playing ? (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group relative flex w-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-zinc-50 to-white px-6 py-16 sm:py-20"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg transition-transform group-hover:scale-105">
              <Play className="ms-0.5 h-7 w-7 fill-current" aria-hidden />
            </span>
            <span className="text-sm font-medium text-zinc-700">{t.authDemoPlay}</span>
            <span className="text-xs text-zinc-400">{t.authDemoDuration}</span>
          </button>
        ) : (
          <div className="p-4 sm:p-6">
            <div className="mb-4 flex items-center gap-2 text-xs font-medium text-indigo-700">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" aria-hidden />
              {progress < 100 ? t.authDemoProcessing : t.authDemoReady}
            </div>
            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <LoginProductPreview
              className={cn(
                "transition-opacity duration-500",
                progress < 55 ? "opacity-40" : "opacity-100",
              )}
            />
          </div>
        )}
      </div>
    </section>
  );
}
