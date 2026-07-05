"use client";

import { Sparkles, Upload } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

interface LandingHeroProps {
  onGetStarted: () => void;
  className?: string;
}

export function LandingHero({ onGetStarted, className }: LandingHeroProps) {
  const { t } = useLocale();

  return (
    <section
      className={cn(
        "hero-glow relative pt-8 pb-12 text-center sm:pt-12 sm:pb-16",
        className,
      )}
    >
      <div className="relative z-10">
        <span className="badge-accent mx-auto mb-6 inline-flex animate-fade-in-up">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          AI Transcription
        </span>

        <h1 className="animate-fade-in-up text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
          {t.authTitle}
          <br />
          <span className="text-gradient-accent">{t.authTitleAccent}</span>
        </h1>

        <p className="animate-fade-in-up animate-fade-in-up-delay-1 mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          {t.authSubtitle}
        </p>

        <button
          type="button"
          onClick={onGetStarted}
          className={cn(
            "animate-fade-in-up animate-fade-in-up-delay-2 group mx-auto mt-10 max-w-xl",
            "upload-zone w-full rounded-2xl p-8 text-center transition-all",
            "hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-muted ring-1 ring-accent/15 transition-transform duration-300 group-hover:scale-105">
            <Upload
              className="h-8 w-8 text-accent"
              strokeWidth={1.75}
              aria-hidden
            />
          </div>
          <p className="text-lg font-semibold text-foreground">
            {t.landingHeroUpload}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t.landingHeroUploadHint}
          </p>
        </button>
      </div>
    </section>
  );
}
