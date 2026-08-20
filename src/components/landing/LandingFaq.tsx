"use client";

import { useState } from "react";
import { LANDING } from "@/lib/landing-copy";

export function LandingFaq() {
  const copy = LANDING.faq;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="mx-auto mt-20 max-w-2xl scroll-mt-24 sm:mt-24"
      aria-labelledby="faq-heading"
    >
      <h2
        id="faq-heading"
        className="text-center font-brand text-2xl tracking-tight text-[var(--staz-text)] sm:text-3xl"
      >
        {copy.headline}
      </h2>
      <div className="mt-8 divide-y divide-[var(--staz-border)] border-y border-[var(--staz-border)]">
        {copy.items.map((item, i) => {
          const open = openFaq === i;
          return (
            <div key={item.q}>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenFaq(open ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-4 text-start text-sm font-medium text-[var(--staz-text)] transition-colors hover:text-[var(--staz-green-soft)] sm:text-base"
              >
                <span>{item.q}</span>
                <span className="shrink-0 text-[var(--staz-muted)]" aria-hidden>
                  {open ? "−" : "+"}
                </span>
              </button>
              {open ? (
                <p className="pb-4 text-sm leading-relaxed text-[var(--staz-muted)]">
                  {item.a}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
