"use client";

import { Upload } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { BRAND_NAME } from "@/lib/brand";
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
