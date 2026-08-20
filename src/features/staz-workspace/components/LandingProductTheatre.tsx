"use client";

import { useEffect, useState } from "react";
import { getDemoMeetingResult, DEMO_AHA_TIMESTAMP } from "@/features/staz-workspace/data/demo-meeting";
import { cn } from "@/lib/utils";

const BRIEF_LINES = getDemoMeetingResult().summary.executive;

/**
 * Cinematic product preview for the hero — single composition, no empty panels.
 */
export function LandingProductTheatre({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "hero";
}) {
  const [lineCount, setLineCount] = useState(0);
  const [showDecision, setShowDecision] = useState(false);
  const isHero = variant === "hero";

  useEffect(() => {
    setLineCount(0);
    setShowDecision(false);
    const timers: number[] = [];
    BRIEF_LINES.forEach((_, i) => {
      timers.push(window.setTimeout(() => setLineCount(i + 1), 700 + i * 900));
    });
    timers.push(window.setTimeout(() => setShowDecision(true), 3200));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  const demo = getDemoMeetingResult();
  const decisionLine = demo.transcript.find(
    (t) => t.timestamp === DEMO_AHA_TIMESTAMP,
  );
  const decision = demo.decisions?.[0] ?? "החלטה מהפגישה";

  return (
    <div
      className={cn(
        "landing-theatre-hero relative overflow-hidden rounded-2xl border border-[var(--staz-border)] bg-[var(--staz-surface-elevated)] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.85)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-[var(--staz-border)] px-4 py-3 sm:px-5">
        <span className="h-2 w-2 rounded-full bg-white/15" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-white/15" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-white/15" aria-hidden />
        <p className="ms-2 truncate text-xs text-[var(--staz-muted)]">
          {demo.fileName} · תצוגת מוצר
        </p>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="border-b border-[var(--staz-border)] p-5 sm:p-6 lg:border-b-0 lg:border-e">
          <p className="text-[11px] font-medium tracking-[0.12em] text-[var(--staz-green-soft)]">
            תמצית מנהלים
          </p>
          <ul className="mt-4 space-y-3">
            {BRIEF_LINES.map((line, i) => (
              <li
                key={line}
                className={cn(
                  "border-s-2 ps-3 text-sm leading-relaxed text-[var(--staz-muted)] transition-all duration-500",
                  i < lineCount
                    ? "translate-y-0 border-[var(--staz-green-bright)] opacity-100"
                    : "translate-y-2 border-transparent opacity-0",
                )}
              >
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4 p-5 sm:p-6">
          <div>
            <p className="text-[11px] font-medium tracking-[0.12em] text-[var(--staz-muted)]">
              החלטה · רגע מדויק
            </p>
            <div
              className={cn(
                "mt-3 rounded-xl border border-[var(--staz-border)] bg-black/25 p-4 transition-all duration-700",
                showDecision ? "opacity-100" : "opacity-40",
              )}
            >
              <p className="text-sm font-medium leading-relaxed text-[var(--staz-text)]">
                {decision}
              </p>
              <p className="mt-3 font-mono-time text-xs text-[#c4a35a]">
                {DEMO_AHA_TIMESTAMP}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--staz-muted)]">
                <span className="font-semibold text-[var(--staz-green-soft)]">
                  {decisionLine?.speaker}:{" "}
                </span>
                {decisionLine?.text}
              </p>
            </div>
          </div>

          <a
            href="#demo"
            className={cn(
              "staz-btn-primary mt-auto w-full text-sm transition-opacity duration-500",
              showDecision ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            {DEMO_AHA_TIMESTAMP} → לרגע ההחלטה
          </a>
        </div>
      </div>

      {isHero ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--staz-bg)]/40 to-transparent lg:hidden"
          aria-hidden
        />
      ) : null}
    </div>
  );
}
