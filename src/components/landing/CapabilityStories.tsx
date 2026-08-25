"use client";

import { LANDING } from "@/lib/landing-copy";
import { LandingChapter } from "@/components/landing/ui/LandingChapter";
import { SectionHeader } from "@/components/landing/ui/SectionHeader";
import {
  DEMO_AHA_TIMESTAMP,
  getDemoMeetingResult,
} from "@/features/staz-workspace/data/demo-meeting";
import { cn } from "@/lib/utils";

export function CapabilityStories() {
  const copy = LANDING.capabilities;
  const demo = getDemoMeetingResult();

  const panels = [
    <ul key="summary" className="space-y-3">
      {demo.summary.executive.map((line) => (
        <li
          key={line}
          className="border-s-2 border-[var(--staz-accent)] ps-3 text-sm leading-relaxed text-[var(--staz-ink)]"
        >
          {line}
        </li>
      ))}
    </ul>,
    <ul key="decisions" className="space-y-2">
      {(demo.decisions ?? []).map((d) => (
        <li
          key={d}
          className="flex items-start gap-2 rounded-[var(--staz-radius-sm)] border border-[var(--staz-border)] bg-[var(--staz-surface-muted)] px-3 py-2.5 text-sm text-[var(--staz-ink)]"
        >
          <span className="text-[var(--staz-decision)]" aria-hidden>
            ✓
          </span>
          {d}
        </li>
      ))}
    </ul>,
    <ul key="actions" className="space-y-2">
      {demo.actionItems.map((a) => (
        <li
          key={`${a.owner}-${a.task}`}
          className="rounded-[var(--staz-radius-sm)] border border-[var(--staz-border)] px-3 py-2.5"
        >
          <p className="text-sm font-medium text-[var(--staz-action)]">{a.owner}</p>
          <p className="mt-0.5 text-sm text-[var(--staz-muted)]">{a.task}</p>
        </li>
      ))}
    </ul>,
    <div
      key="evidence"
      className="rounded-[var(--staz-radius-sm)] border border-[var(--staz-evidence)] bg-[color-mix(in_srgb,var(--staz-evidence)_10%,white)] p-4"
    >
      <p className="text-[11px] font-medium tracking-[0.1em] text-[var(--staz-evidence)]">
        איפה זה נאמר
      </p>
      <p className="mt-2 font-mono-time text-sm text-[var(--staz-evidence)]">
        {DEMO_AHA_TIMESTAMP}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--staz-ink)]">
        {demo.transcript.find((t) => t.timestamp === DEMO_AHA_TIMESTAMP)?.text}
      </p>
    </div>,
    <ul key="library" className="space-y-2">
      {[demo.fileName, "פגישת לקוח — מעקב", "סיכום שבועי צוות"].map((name, i) => (
        <li
          key={name}
          className="flex items-center justify-between rounded-[var(--staz-radius-sm)] border border-[var(--staz-border)] px-3 py-2.5 text-sm"
        >
          <span className="text-[var(--staz-ink)]">{name}</span>
          <span className="text-xs text-[var(--staz-muted)]">
            {i === 0 ? "היום" : "השבוע"}
          </span>
        </li>
      ))}
    </ul>,
  ];

  return (
    <LandingChapter tone="product" id="outcomes" className="scroll-mt-24">
      <SectionHeader title={copy.headline} />
      <div className="mt-12 space-y-16 sm:space-y-20">
        {copy.items.map((item, i) => {
          const reverse = i % 2 === 1;
          return (
            <article
              key={item.title}
              className={cn(
                "landing-reveal grid items-center gap-8 lg:grid-cols-2 lg:gap-12",
                reverse && "lg:[&>*:first-child]:order-2",
              )}
              style={{ animationDelay: `${Math.min(i, 4) * 60}ms` }}
            >
              <div>
                <p className="font-mono-time text-xs text-[var(--staz-primary)]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-brand text-2xl text-[var(--staz-ink)] sm:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-2 text-base font-medium text-[var(--staz-primary)]">
                  {item.question}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--staz-muted)] sm:text-base">
                  {item.body}
                </p>
              </div>
              <div className="staz-product-surface overflow-hidden p-0">
                <div className="border-b border-[var(--staz-border)] bg-[var(--staz-bg-cool)] px-5 py-3 text-xs text-[var(--staz-muted)]">
                  {demo.fileName}
                </div>
                <div className="p-5 sm:p-6">{panels[i]}</div>
              </div>
            </article>
          );
        })}
      </div>
    </LandingChapter>
  );
}
