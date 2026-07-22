"use client";

import { useRef, useState } from "react";
import { Loader2, Sparkles, Upload } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { BRAND_NAME } from "@/lib/brand";
import { ACCEPTED_FILE_INPUT } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LandingHeroProps {
  onGetStarted: () => void;
  className?: string;
}

type GuestPreview = {
  fileName: string;
  duration?: string;
  transcriptText: string;
  executiveSummary?: string | null;
  actionItems?: Array<{ task?: string } | string>;
  remainingTrials?: number;
};

export function LandingHero({ onGetStarted, className }: LandingHeroProps) {
  const { t } = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<GuestPreview | null>(null);

  const runGuestTrial = async (file: File) => {
    setError(null);
    setPreview(null);
    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/transcribe/guest", {
        method: "POST",
        body,
      });
      const json = (await res.json()) as {
        data?: GuestPreview;
        error?: { message?: string };
      };
      if (!res.ok || !json.data) {
        throw new Error(json.error?.message || t.landingGuestLimit);
      }
      setPreview(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.landingGuestLimit);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      className={cn(
        "hero-glow relative pt-8 pb-12 text-center sm:pt-12 sm:pb-16",
        className,
      )}
    >
      <div className="relative z-10">
        <p
          className={cn(
            "animate-fade-in-up mb-5 text-3xl font-extrabold tracking-tight text-foreground",
            "sm:text-4xl md:text-5xl",
          )}
        >
          {BRAND_NAME}
        </p>

        <h1 className="animate-fade-in-up text-balance text-2xl font-bold leading-snug tracking-tight text-foreground md:text-3xl lg:text-4xl">
          {t.authTitle}
          <br />
          <span className="text-gradient-accent">{t.authTitleAccent}</span>
        </h1>

        <p className="animate-fade-in-up animate-fade-in-up-delay-1 mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          {t.authSubtitle}
        </p>

        <div className="animate-fade-in-up animate-fade-in-up-delay-2 mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onGetStarted}
            className={cn(
              "btn-cinema inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-8 py-3",
              "text-sm font-semibold shadow-md transition-transform hover:-translate-y-0.5",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            {t.authSubmit}
          </button>
          <a
            href="#pricing"
            className={cn(
              "btn-secondary inline-flex min-h-12 items-center justify-center rounded-xl px-6 py-3",
              "text-sm font-semibold",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            {t.landingPricingTitle}
          </a>
        </div>

        <div
          className={cn(
            "animate-fade-in-up animate-fade-in-up-delay-2 mx-auto mt-10 max-w-xl",
            "upload-zone w-full rounded-2xl p-8 text-center transition-all",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_FILE_INPUT}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void runGuestTrial(file);
            }}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-muted ring-1 ring-accent/15">
              {busy ? (
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              ) : (
                <Upload className="h-8 w-8 text-accent" strokeWidth={1.75} aria-hidden />
              )}
            </div>
            <p className="text-lg font-semibold text-foreground">
              {busy ? t.procTranscribing : t.landingHeroUpload}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t.landingGuestTryHint}
            </p>
          </button>

          {error && (
            <p className="mt-4 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          {preview && (
            <div className="mt-6 rounded-xl border border-border/70 bg-background/80 p-4 text-start">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="h-4 w-4 text-accent" aria-hidden />
                {preview.fileName}
              </div>
              {preview.executiveSummary && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {preview.executiveSummary}
                </p>
              )}
              {!preview.executiveSummary && preview.transcriptText && (
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-6">
                  {preview.transcriptText}
                </p>
              )}
              <button
                type="button"
                onClick={onGetStarted}
                className="btn-cinema mt-4 w-full rounded-xl px-4 py-2.5 text-sm font-semibold"
              >
                {t.landingGuestSignIn}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
