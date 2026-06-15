"use client";

import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { testimonialsByLocale } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

const ROTATE_MS = 5500;

export function TestimonialsCarousel() {
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

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] via-transparent to-violet-600/[0.04] p-6 sm:p-8">
      <div className="pointer-events-none absolute -end-16 -top-16 h-48 w-48 rounded-full bg-violet-600/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -start-12 h-36 w-36 rounded-full bg-amber-500/6 blur-3xl" />

      <div className="relative">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400/80">
              {t.testimonialsTag}
            </p>
            <h3
              className="mt-1 text-lg font-bold text-white"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              {t.testimonialsTitle}
            </h3>
          </div>
          <div className="hidden items-center gap-0.5 sm:flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
              />
            ))}
            <span className="ms-2 text-xs font-medium text-zinc-500">4.9</span>
          </div>
        </div>

        <div
          className={cn(
            "testimonial-content transition-all duration-300",
            visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          <Quote className="mb-3 h-8 w-8 text-violet-500/30" />
          <blockquote className="text-base leading-relaxed text-zinc-300 sm:text-lg">
            &ldquo;{current.quote}&rdquo;
          </blockquote>

          <div className="mt-6 flex items-center gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${current.accent}, ${current.accent}99)`,
                boxShadow: `0 4px 20px ${current.accent}40`,
              }}
            >
              {current.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{current.name}</p>
              <p className="text-xs text-zinc-500">{current.role}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
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
                i === active
                  ? "w-6 bg-gradient-to-r from-violet-500 to-amber-400"
                  : "w-1.5 bg-zinc-700 hover:bg-zinc-500",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
