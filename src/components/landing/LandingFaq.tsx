"use client";

import { useState } from "react";
import { LANDING } from "@/lib/landing-copy";
import { LandingChapter } from "@/components/landing/ui/LandingChapter";
import { SectionHeader } from "@/components/landing/ui/SectionHeader";

export function LandingFaq() {
  const copy = LANDING.faq;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <LandingChapter tone="warm" id="faq" className="scroll-mt-24">
      <div className="mx-auto max-w-2xl">
        <SectionHeader id="faq-heading" title={copy.headline} />
        <div className="mt-8 divide-y divide-[var(--staz-border)] overflow-hidden rounded-[var(--staz-radius)] border border-[var(--staz-border)] bg-[var(--staz-surface)]">
          {copy.items.map((item, i) => {
            const open = openFaq === i;
            return (
              <div key={item.q} className="px-5">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-start text-sm font-medium text-[var(--staz-ink)] transition-colors hover:text-[var(--staz-primary)] sm:text-base"
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
      </div>
    </LandingChapter>
  );
}
