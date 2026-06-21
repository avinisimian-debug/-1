"use client";

import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { testimonialsByLocale } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

const ROTATE_MS = 5500;

interface TestimonialsCarouselProps {
  variant?: "default" | "premium" | "compact";
  className?: string;
}

export function TestimonialsCarousel({
  variant = "default",
  className,
}: TestimonialsCarouselProps) {
  const { t, locale } = useLocale();
  const items = testimonialsByLocale[locale];
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActive((i) => (i + 1) % items.length);
        setVisible(true);
      }, 350);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, [items.length]);

  const current = items[active];
  const isPremium = variant === "premium";
  const isCompact = variant === "compact";

  if (isCompact) {
    return (
      <div className={cn("rounded-lg border border-border bg-muted/40 p-3", className)}>
        <div className="mb-2 flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
          ))}
          <span className="ms-1 text-[9px] font-medium text-muted-foreground">4.9</span>
        </div>
        <p
          className={cn(
            "text-[11px] leading-relaxed text-muted-foreground transition-all duration-300",
            visible ? "opacity-100" : "opacity-0",
          )}
        >
          &ldquo;{current.quote.length > 90 ? `${current.quote.slice(0, 90)}…` : current.quote}&rdquo;
        </p>
        <p className="mt-2 text-[10px] font-medium text-foreground">{current.name}</p>
      </div>
    );
  }

  return (
    <section
      className={cn(
        isPremium
          ? "glass-card relative overflow-hidden rounded-2xl p-8 sm:p-10"
          : "glass-card rounded-xl p-6 sm:p-8",
        className,
      )}
    >
      {isPremium && (
        <div className="pointer-events-none absolute -end-20 -top-20 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
      )}

      <div className="relative mb-6 flex items-center justify-between">
        <div className="text-start">
          <p
            className={cn(
              "font-semibold uppercase tracking-wider text-muted-foreground",
              isPremium ? "text-[11px] tracking-[0.2em]" : "text-[10px]",
            )}
          >
            {t.testimonialsTag}
          </p>
          <h3
            className={cn(
              "mt-1 font-semibold tracking-tight text-foreground",
              isPremium ? "text-xl" : "text-lg",
            )}
          >
            {t.testimonialsTitle}
          </h3>
          {isPremium && (
            <p className="mt-1 text-xs text-muted-foreground">{t.trustTeamsCount}</p>
          )}
        </div>
        <div className="hidden items-center gap-0.5 sm:flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "fill-amber-400 text-amber-400",
                isPremium ? "h-4 w-4" : "h-3.5 w-3.5",
              )}
            />
          ))}
          <span className="ms-2 text-xs font-medium text-muted-foreground">4.9</span>
        </div>
      </div>

      <div
        className={cn(
          "relative text-start transition-all duration-300",
          visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        )}
      >
        <Quote
          className={cn(
            "text-border",
            isPremium ? "mb-4 h-9 w-9" : "mb-3 h-7 w-7",
          )}
        />
        <blockquote
          className={cn(
            "leading-relaxed text-muted-foreground",
            isPremium
              ? "text-lg font-light tracking-tight sm:text-xl"
              : "text-base sm:text-lg",
          )}
        >
          &ldquo;{current.quote}&rdquo;
        </blockquote>

        <div className="mt-6 flex items-center gap-4">
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white shadow-md ring-2 ring-card",
              isPremium ? "h-12 w-12" : "h-10 w-10",
            )}
            style={{ backgroundColor: current.accent }}
          >
            {current.initials}
          </div>
          <div>
            <p className={cn("font-medium text-foreground", isPremium && "text-base")}>
              {current.name}
            </p>
            <p className="text-xs text-muted-foreground">{current.role}</p>
          </div>
        </div>
      </div>

      <div className="relative mt-6 flex items-center justify-center gap-2">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Testimonial ${i + 1}`}
            onClick={() => {
              setVisible(false);
              setTimeout(() => {
                setActive(i);
                setVisible(true);
              }, 200);
            }}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === active ? "w-6 bg-foreground" : "w-1.5 bg-border hover:bg-muted-foreground/40",
            )}
          />
        ))}
      </div>
    </section>
  );
}
