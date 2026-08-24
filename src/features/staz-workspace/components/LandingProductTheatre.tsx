"use client";

import { useEffect, useState } from "react";
import {
  getDemoMeetingResult,
  DEMO_AHA_TIMESTAMP,
} from "@/features/staz-workspace/data/demo-meeting";
import { cn } from "@/lib/utils";

/**
 * Cinematic product stage — real demo meeting data, layered depth.
 */
export function LandingProductTheatre({ className }: { className?: string }) {
  const demo = getDemoMeetingResult();
  const [lineCount, setLineCount] = useState(0);
  const [showDecision, setShowDecision] = useState(false);
  const decisionLine = demo.transcript.find(
    (t) => t.timestamp === DEMO_AHA_TIMESTAMP,
  );
  const decision = demo.decisions?.[0] ?? "החלטה מהפגישה";

  useEffect(() => {
    setLineCount(0);
    setShowDecision(false);
    const timers: number[] = [];
    demo.summary.executive.forEach((_, i) => {
      timers.push(window.setTimeout(() => setLineCount(i + 1), 500 + i * 700));
    });
    timers.push(window.setTimeout(() => setShowDecision(true), 2600));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [demo.summary.executive]);

  return (
    <div className={cn("landing-theatre-hero relative", className)}>
      <div
        className="pointer-events-none absolute -inset-x-8 -bottom-10 -top-6 hidden rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.18),transparent_70%)] sm:block"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Back layer — muted product ghost */}
        <div
          className="pointer-events-none absolute inset-x-6 top-8 hidden h-[88%] rounded-[var(--staz-radius)] border border-[var(--staz-border)] bg-[var(--staz-surface-muted)] opacity-50 blur-[0.5px] lg:block"
          style={{ transform: "translateY(18px) scale(0.97)" }}
          aria-hidden
        />

        <div className="staz-product-surface relative overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--staz-border)] bg-[var(--staz-bg-cool)] px-4 py-3 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="font-brand text-sm tracking-[0.16em] text-[var(--staz-primary)]">
                STAZ
              </span>
              <span className="hidden h-4 w-px bg-[var(--staz-border)] sm:block" />
              <p className="truncate text-xs text-[var(--staz-muted)] sm:text-sm">
                {demo.fileName}
              </p>
            </div>
            <span className="shrink-0 rounded-[var(--staz-radius-sm)] border border-sky-400/20 bg-sky-400/10 px-2.5 py-1 font-mono-time text-[11px] text-[#38bdf8]">
              {DEMO_AHA_TIMESTAMP}
            </span>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="border-b border-[var(--staz-border)] p-5 sm:p-6 lg:border-b-0 lg:border-e">
              <p className="text-[11px] font-medium tracking-[0.12em] text-[var(--staz-primary)]">
                תמצית מנהלים
              </p>
              <ul className="mt-4 space-y-3">
                {demo.summary.executive.map((line, i) => (
                  <li
                    key={line}
                    className={cn(
                      "border-s-2 ps-3 text-sm leading-relaxed text-[var(--staz-muted)] transition-all duration-500",
                      i < lineCount
                        ? "translate-y-0 border-[var(--staz-accent)] opacity-100"
                        : "translate-y-2 border-transparent opacity-0",
                    )}
                  >
                    {line}
                  </li>
                ))}
              </ul>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-medium tracking-[0.12em] staz-decision-chip">
                    החלטות
                  </p>
                  <ul className="mt-2.5 space-y-2">
                    {(demo.decisions ?? []).slice(0, 3).map((d) => (
                      <li
                        key={d}
                        className="flex items-start gap-2 text-sm leading-snug text-[var(--staz-ink)]"
                      >
                        <span
                          className="mt-0.5 text-[var(--staz-decision)]"
                          aria-hidden
                        >
                          ✓
                        </span>
                        <span className="line-clamp-2">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[11px] font-medium tracking-[0.12em] staz-action-chip">
                    משימות
                  </p>
                  <ul className="mt-2.5 space-y-2">
                    {demo.actionItems.slice(0, 3).map((a) => (
                      <li
                        key={`${a.owner}-${a.task}`}
                        className="text-sm leading-snug"
                      >
                        <span className="font-medium text-[var(--staz-action)]">
                          {a.owner}
                        </span>
                        <span className="text-[var(--staz-muted)]">
                          {" — "}
                          {a.task}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 bg-[color-mix(in_srgb,var(--staz-primary-soft)_70%,white)] p-5 sm:p-6">
              <p className="text-[11px] font-medium tracking-[0.12em] staz-evidence-chip">
                תמלול · רגע מדויק
              </p>
              <div
                className={cn(
                  "rounded-[var(--staz-radius-sm)] border border-[var(--staz-border)] bg-[var(--staz-surface)] p-4 transition-all duration-700",
                  showDecision
                    ? "opacity-100 shadow-[var(--staz-shadow-soft)]"
                    : "opacity-40",
                )}
              >
                <p className="text-sm font-medium leading-relaxed text-[var(--staz-ink)]">
                  {decision}
                </p>
                <p className="mt-3 font-mono-time text-xs text-[var(--staz-evidence)]">
                  {DEMO_AHA_TIMESTAMP} ↗
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--staz-muted)]">
                  <span className="font-semibold text-[var(--staz-primary)]">
                    {decisionLine?.speaker}:{" "}
                  </span>
                  {decisionLine?.text}
                </p>
              </div>

              <div className="mt-auto">
                <div className="mb-2 flex items-center justify-between text-[10px] text-[var(--staz-muted)]">
                  <span>00:00</span>
                  <span>{demo.duration}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--staz-sand)]">
                  <div
                    className="landing-timeline-fill h-full rounded-full bg-[var(--staz-evidence)]"
                    style={{ width: showDecision ? "52%" : "8%" }}
                  />
                </div>
              </div>

              <a
                href="#demo"
                className={cn(
                  "staz-btn-primary mt-1 w-full text-sm transition-opacity duration-500",
                  showDecision ? "opacity-100" : "pointer-events-none opacity-0",
                )}
              >
                חוו את הדמו החי
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
