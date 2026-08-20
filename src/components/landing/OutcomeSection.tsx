"use client";

import { LANDING } from "@/lib/landing-copy";

export function OutcomeSection() {
  const copy = LANDING.story;

  return (
    <section
      id="how"
      className="mx-auto mt-20 max-w-5xl scroll-mt-24 sm:mt-24"
      aria-labelledby="story-heading"
    >
      <h2
        id="story-heading"
        className="text-center font-brand text-2xl tracking-tight text-[var(--staz-text)] sm:text-3xl"
      >
        {copy.headline}
      </h2>
      <ol className="mt-10 space-y-0 divide-y divide-[var(--staz-border)] border-y border-[var(--staz-border)]">
        {copy.items.map((item, i) => (
          <li
            key={item.title}
            className="grid gap-2 py-6 sm:grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,1.2fr)] sm:items-start sm:gap-6"
          >
            <span className="font-mono-time text-xs text-[var(--staz-green-soft)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm text-[var(--staz-muted)]">{item.title}</p>
              <p className="mt-1 font-semibold text-[var(--staz-text)]">{item.label}</p>
            </div>
            <p className="text-sm leading-relaxed text-[var(--staz-muted)]">{item.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
