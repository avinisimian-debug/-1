"use client";

import { Upload } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

interface LandingHeroProps {
  onGetStarted: () => void;
  className?: string;
}

export function LandingHero({ onGetStarted, className }: LandingHeroProps) {
  const { t } = useLocale();

  return (
    <section className={cn("pt-8 pb-12 text-center sm:pt-12 sm:pb-16", className)}>
      <h1 className="animate-fade-in-up text-balance text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
        {t.authTitle}
        <br />
        <span className="text-accent">{t.authTitleAccent}</span>
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
        <Upload
          className="mx-auto mb-4 h-12 w-12 text-accent transition-transform duration-200 group-hover:scale-105"
          strokeWidth={1.75}
          aria-hidden
        />
        <p className="text-lg font-medium text-foreground">{t.landingHeroUpload}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t.landingHeroUploadHint}</p>
      </button>
    </section>
  );
}
