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
      <div className={cn("rounded-md border border-zinc-200 bg-zinc-50/80 p-3", className)}>
        <div className="mb-2 flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
          ))}
          <span className="ms-1 text-[9px] font-medium text-zinc-400">4.9</span>
        </div>
        <p
          className={cn(
            "text-[11px] leading-relaxed text-zinc-600 transition-all duration-300",
            visible ? "opacity-100" : "opacity-0",
          )}
        >
          &ldquo;{current.quote.length > 90 ? `${current.quote.slice(0, 90)}…` : current.quote}&rdquo;
        </p>
        <p className="mt-2 text-[10px] font-medium text-zinc-800">{current.name}</p>
      </div>
    );
  }

  return (
    <section
      className={cn(
        isPremium
          ? "relative overflow-hidden rounded-lg border border-zinc-200 bg-gradient-to-b from-white to-zinc-50/80 p-8 shadow-sm sm:p-10"
          : "glass-card rounded-lg p-6 sm:p-8",
        className,
      )}
    >
      {isPremium && (
        <div className="pointer-events-none absolute -end-20 -top-20 h-40 w-40 rounded-full bg-indigo-100/40 blur-3xl" />
      )}

      <div className="relative mb-6 flex items-center justify-between">
        <div>
          <p
            className={cn(
              "font-semibold uppercase tracking-wider text-zinc-400",
              isPremium ? "text-[11px] tracking-[0.2em]" : "text-[10px]",
            )}
          >
            {t.testimonialsTag}
          </p>
          <h3
            className={cn(
              "mt-1 font-semibold text-zinc-900",
              isPremium ? "text-xl tracking-tight" : "text-lg",
            )}
          >
            {t.testimonialsTitle}
          </h3>
          {isPremium && (
            <p className="mt-1 text-xs text-zinc-500">{t.trustTeamsCount}</p>
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
          <span className="ms-2 text-xs font-medium text-zinc-500">4.9</span>
        </div>
      </div>

      <div
        className={cn(
          "relative transition-all duration-300",
          visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        )}
      >
        <Quote
          className={cn(
            "text-zinc-200",
            isPremium ? "mb-4 h-9 w-9" : "mb-3 h-7 w-7",
          )}
        />
        <blockquote
          className={cn(
            "leading-relaxed text-zinc-600",
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
              "flex shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ring-2 ring-white shadow-md",
              isPremium ? "h-12 w-12" : "h-10 w-10",
            )}
            style={{ backgroundColor: current.accent }}
          >
            {current.initials}
          </div>
          <div>
            <p className={cn("font-medium text-zinc-900", isPremium && "text-base")}>
              {current.name}
            </p>
            <p className="text-xs text-zinc-500">{current.role}</p>
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
              i === active ? "w-6 bg-zinc-900" : "w-1.5 bg-zinc-300 hover:bg-zinc-400",
            )}
          />
        ))}
      </div>
    </section>
  );
}
