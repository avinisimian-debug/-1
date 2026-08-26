"use client";

import { useEffect, useState } from "react";
import {
  getDemoMeetingResult,
  DEMO_AHA_TIMESTAMP,
} from "@/features/staz-workspace/data/demo-meeting";
import { StazMark } from "@/components/brand/Logo";
import { LANDING } from "@/lib/landing-copy";
import { cn } from "@/lib/utils";

const CLOSEOUT_STATS = [
  { n: "4", label: "מה הוחלט" },
  { n: "7", label: "מי עושה מה" },
  { n: "3", label: "סיכונים" },
  { n: "2", label: "המשכים" },
] as const;

/**
 * Cinematic product stage — meeting → closeout → decision → evidence.
 */
export function LandingProductTheatre({ className }: { className?: string }) {
  const demo = getDemoMeetingResult();
  const copy = LANDING.demo;
  const [phase, setPhase] = useState<"meeting" | "closeout" | "product">(
    "meeting",
  );
  const [lineCount, setLineCount] = useState(0);
  const [showDecision, setShowDecision] = useState(false);
  const decisionLine = demo.transcript.find(
    (t) => t.timestamp === DEMO_AHA_TIMESTAMP,
  );
  const decision = demo.decisions?.[0] ?? "החלטה מהפגישה";

  useEffect(() => {
    setPhase("meeting");
    setLineCount(0);
    setShowDecision(false);
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setPhase("closeout"), 900));
    timers.push(window.setTimeout(() => setPhase("product"), 2200));
    demo.summary.executive.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => setLineCount(i + 1), 2600 + i * 650),
      );
    });
    timers.push(window.setTimeout(() => setShowDecision(true), 4600));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [demo.summary.executive]);

  return (
    <div className={cn("landing-theatre-hero relative", className)}>
      <div
        className="pointer-events-none absolute -inset-x-8 -bottom-10 -top-6 hidden rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.14),transparent_70%)] sm:block"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Meeting → closeout transform banner */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-3 sm:mb-5 sm:gap-4">
          <div
            className={cn(
              "rounded-full border px-4 py-2 font-mono-time text-sm transition-all duration-500",
              phase === "meeting"
                ? "border-white/25 bg-white/10 text-white"
                : "border-white/10 bg-white/[0.03] text-white/35",
            )}
          >
            {copy.meetingLabel}
          </div>
          <span
            className={cn(
              "text-sm transition-colors duration-500",
              phase !== "meeting" ? "text-[#5eead4]" : "text-white/25",
            )}
            aria-hidden
          >
            →
          </span>
          <div
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-500",
              phase !== "meeting"
                ? "border-teal-400/35 bg-teal-400/10 text-[#5eead4]"
                : "border-white/10 bg-white/[0.03] text-white/35",
            )}
          >
            {copy.closeoutLabel}
          </div>
        </div>

        {/* Always mounted — conditional mount here caused CLS / scroll jumps
            when stats appeared ~900ms after load and pushed the page down. */}
        <div
          className={cn(
            "mb-5 grid grid-cols-2 gap-2 sm:mb-6 sm:grid-cols-4 sm:gap-3",
            phase === "meeting" && "invisible",
          )}
          aria-hidden={phase === "meeting"}
        >
          {CLOSEOUT_STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "rounded-[var(--staz-radius-sm)] border border-white/10 bg-white/[0.04] px-3 py-3 text-center backdrop-blur-sm",
                phase !== "meeting" && "landing-reveal",
              )}
              style={
                phase !== "meeting" ? { animationDelay: `${i * 70}ms` } : undefined
              }
            >
              <p className="font-brand text-2xl text-white sm:text-3xl">
                {stat.n}
              </p>
              <p className="mt-1 text-[11px] text-white/50 sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div
          className="pointer-events-none absolute inset-x-6 top-8 hidden h-[88%] rounded-[var(--staz-radius)] border border-[var(--staz-border)] bg-[var(--staz-surface-muted)] opacity-50 blur-[0.5px] lg:block"
          style={{ transform: "translateY(18px) scale(0.97)" }}
          aria-hidden
        />

        <div
          className={cn(
            "staz-product-surface relative overflow-hidden transition-all duration-700",
            phase === "meeting" && "scale-[0.98] opacity-55",
            phase === "closeout" && "scale-[0.99] opacity-80",
            phase === "product" && "scale-100 opacity-100",
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-[var(--staz-border)] bg-[var(--staz-bg-cool)] px-4 py-3 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <StazMark size={22} />
              <span className="font-brand text-sm tracking-[0.16em] text-[var(--staz-primary)]">
                STAZ
              </span>
              <span className="hidden h-4 w-px bg-[var(--staz-border)] sm:block" />
              <p className="truncate text-xs text-[var(--staz-muted)] sm:text-sm">
                {demo.fileName}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-[var(--staz-radius-sm)] border px-2.5 py-1 font-mono-time text-[11px] transition-all duration-500",
                showDecision
                  ? "border-[var(--staz-evidence)]/40 bg-[color-mix(in_srgb,var(--staz-evidence)_12%,white)] text-[var(--staz-evidence)]"
                  : "border-sky-400/20 bg-sky-400/10 text-[#38bdf8]",
              )}
            >
              {showDecision ? DEMO_AHA_TIMESTAMP : demo.duration}
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
                    מה הוחלט
                  </p>
                  <ul className="mt-2.5 space-y-2">
                    {(demo.decisions ?? []).slice(0, 3).map((d, i) => (
                      <li
                        key={d}
                        className={cn(
                          "flex items-start gap-2 text-sm leading-snug text-[var(--staz-ink)] transition-all duration-500",
                          showDecision && i === 0
                            ? "rounded-lg border border-[var(--staz-decision)]/30 bg-[color-mix(in_srgb,var(--staz-decision)_8%,white)] px-2 py-1.5"
                            : "",
                        )}
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
                    מי עושה מה
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
                איפה זה נאמר
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
                {LANDING.hero.secondaryCta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
