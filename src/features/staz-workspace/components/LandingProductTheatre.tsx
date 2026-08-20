"use client";

import { useEffect, useState } from "react";
import { getDemoMeetingResult, DEMO_AHA_TIMESTAMP } from "../data/demo-meeting";

const BRIEF_LINES = getDemoMeetingResult().summary.executive;

/**
 * Marketing product theatre — auto-types brief + highlights decision moment.
 */
export function LandingProductTheatre({ className }: { className?: string }) {
  const [lineCount, setLineCount] = useState(0);
  const [showDecision, setShowDecision] = useState(false);

  useEffect(() => {
    setLineCount(0);
    setShowDecision(false);
    const timers: number[] = [];
    BRIEF_LINES.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => setLineCount(i + 1), 900 + i * 1100),
      );
    });
    timers.push(window.setTimeout(() => setShowDecision(true), 3800));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  const demo = getDemoMeetingResult();
  const decisionLine = demo.transcript.find(
    (t) => t.timestamp === DEMO_AHA_TIMESTAMP,
  );

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 bg-[#141816] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)] ${className ?? ""}`}
    >
      <div className="grid md:grid-cols-[1.1fr_0.9fr]">
        <div className="border-b border-white/10 p-4 md:border-b-0 md:border-e">
          <p className="text-[11px] font-medium uppercase tracking-wider text-[#6f7670]">
            הקלטה · דמו
          </p>
          <div className="mt-3 flex aspect-[16/10] flex-col justify-end rounded-xl bg-gradient-to-t from-black/50 to-[#1c211e] p-4">
            <p className="font-mono-time text-xs text-[#c4a35a]">
              {DEMO_AHA_TIMESTAMP}
            </p>
            <p
              className={`mt-1 text-sm leading-relaxed text-[#ededea] transition-opacity duration-500 ${showDecision ? "opacity-100" : "opacity-50"}`}
            >
              <span className="font-semibold text-[#3d9b86]">
                {decisionLine?.speaker}:{" "}
              </span>
              {decisionLine?.text}
            </p>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-l from-[#c4a35a] to-[#3d9b86] transition-all duration-1000"
              style={{ width: showDecision ? "55%" : "22%" }}
            />
          </div>
        </div>

        <div className="flex flex-col p-4">
          <p className="text-[11px] font-medium text-[#3d9b86]">Staz · עוזר מנהלים</p>
          <p className="mt-1 text-sm font-semibold text-[#ededea]">תמצית מנהלים</p>
          <ul className="mt-4 flex-1 space-y-3">
            {BRIEF_LINES.map((line, i) => (
              <li
                key={line}
                className={`text-sm leading-relaxed text-[#a8aea8] transition-all duration-500 ${
                  i < lineCount
                    ? "translate-y-0 opacity-100"
                    : "translate-y-1 opacity-0"
                }`}
              >
                {line}
              </li>
            ))}
          </ul>
          {showDecision && (
            <a
              href="#demo"
              className="lat-time-chip mt-4 w-fit border-[#3d9b86]/40 bg-[#3d9b86]/10 text-[#3d9b86]"
            >
              {DEMO_AHA_TIMESTAMP} ↗ לחצו לדמו המלא
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
