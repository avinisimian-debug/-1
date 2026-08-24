"use client";

import { useState } from "react";
import { LANDING } from "@/lib/landing-copy";
import { LandingChapter } from "@/components/landing/ui/LandingChapter";
import { SectionHeader } from "@/components/landing/ui/SectionHeader";
import {
  DEMO_AHA_TIMESTAMP,
  getDemoMeetingResult,
} from "@/features/staz-workspace/data/demo-meeting";
import { cn } from "@/lib/utils";

export function WalkthroughSection() {
  const copy = LANDING.walkthrough;
  const demo = getDemoMeetingResult();
  const [active, setActive] = useState(0);

  return (
    <LandingChapter id="how" tone="warm" className="scroll-mt-24">
      <SectionHeader title={copy.headline} />

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1">
          {copy.steps.map((step, i) => (
            <li key={step.t}>
              <button
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "w-full rounded-[var(--staz-radius)] border px-3 py-3 text-start transition-colors sm:px-4 sm:py-4",
                  active === i
                    ? "border-[var(--staz-primary)] bg-[var(--staz-primary-soft)]"
                    : "border-[var(--staz-border)] bg-[var(--staz-surface)] hover:bg-[var(--staz-surface-muted)]",
                )}
              >
                <p className="font-mono-time text-xs text-[var(--staz-primary)]">
                  {step.n}
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--staz-ink)] sm:text-base">
                  {step.t}
                </p>
                <p className="mt-1 hidden text-sm text-[var(--staz-muted)] lg:block">
                  {step.d}
                </p>
              </button>
            </li>
          ))}
        </ol>

        <div className="staz-product-surface overflow-hidden p-0">
          <div className="border-b border-[var(--staz-border)] bg-[var(--staz-bg-cool)] px-5 py-3">
            <p className="text-xs text-[var(--staz-muted)]">
              שלב {copy.steps[active].n} · {copy.steps[active].t}
            </p>
          </div>
          <div className="min-h-[220px] p-5 sm:p-6">
            {active === 0 && (
              <div className="flex h-full min-h-[180px] flex-col items-center justify-center rounded-[var(--staz-radius-sm)] border border-dashed border-[var(--staz-border)] bg-[var(--staz-surface-muted)] px-6 py-10 text-center">
                <p className="text-sm font-medium text-[var(--staz-ink)]">
                  גררו הקלטה או בחרו קובץ
                </p>
                <p className="mt-2 text-sm text-[var(--staz-muted)]">
                  מהטלפון או מהמחשב — בלי התקנות.
                </p>
              </div>
            )}
            {active === 1 && (
              <div>
                <p className="text-[11px] font-medium tracking-[0.1em] text-[var(--staz-primary)]">
                  תמצית מנהלים
                </p>
                <ul className="mt-4 space-y-3">
                  {demo.summary.executive.slice(0, 3).map((line) => (
                    <li
                      key={line}
                      className="border-s-2 border-[var(--staz-accent)] ps-3 text-sm leading-relaxed text-[var(--staz-ink)]"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {active === 2 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-medium tracking-[0.1em] staz-decision-chip">
                    החלטות
                  </p>
                  <ul className="mt-3 space-y-2">
                    {(demo.decisions ?? []).slice(0, 3).map((d) => (
                      <li
                        key={d}
                        className="rounded-[var(--staz-radius-sm)] border border-[var(--staz-border)] bg-[var(--staz-surface-muted)] px-3 py-2.5 text-sm text-[var(--staz-ink)]"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[11px] font-medium tracking-[0.1em] staz-action-chip">
                    משימות
                  </p>
                  <ul className="mt-3 space-y-2">
                    {demo.actionItems.slice(0, 3).map((a) => (
                      <li
                        key={`${a.owner}-${a.task}`}
                        className="rounded-[var(--staz-radius-sm)] border border-[var(--staz-border)] bg-white px-3 py-2.5 text-sm"
                      >
                        <span className="font-medium text-[var(--staz-action)]">
                          {a.owner}
                        </span>
                        <p className="mt-0.5 text-[var(--staz-muted)]">{a.task}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {active === 3 && (
              <div className="space-y-4">
                <div className="rounded-[var(--staz-radius-sm)] border border-[var(--staz-evidence)] bg-[color-mix(in_srgb,var(--staz-evidence)_10%,white)] p-4">
                  <p className="font-mono-time text-xs text-[var(--staz-evidence)]">
                    {DEMO_AHA_TIMESTAMP} ↗
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--staz-ink)]">
                    {
                      demo.transcript.find((t) => t.timestamp === DEMO_AHA_TIMESTAMP)
                        ?.text
                    }
                  </p>
                </div>
                <p className="text-sm text-[var(--staz-muted)]">
                  בודקים את המקור — ואז משתפים תמצית לצוות או ללקוח.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </LandingChapter>
  );
}
