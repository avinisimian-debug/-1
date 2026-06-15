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
    <section className="glass-card rounded-lg p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            {t.testimonialsTag}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-zinc-900">
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
          "transition-all duration-300",
          visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        )}
      >
        <Quote className="mb-3 h-7 w-7 text-zinc-200" />
        <blockquote className="text-base leading-relaxed text-zinc-600 sm:text-lg">
          &ldquo;{current.quote}&rdquo;
        </blockquote>

        <div className="mt-6 flex items-center gap-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: current.accent }}
          >
            {current.initials}
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900">{current.name}</p>
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
              i === active ? "w-6 bg-zinc-900" : "w-1.5 bg-zinc-300 hover:bg-zinc-400",
            )}
          />
        ))}
      </div>
    </section>
  );
}
