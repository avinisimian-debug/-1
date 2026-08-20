"use client";

import { DEMO_AHA_TIMESTAMP } from "../data/demo-meeting";

interface AhaOnboardingProps {
  targetTimestamp?: string;
  onJump: () => void;
}

export function AhaOnboarding({
  targetTimestamp = DEMO_AHA_TIMESTAMP,
  onJump,
}: AhaOnboardingProps) {
  return (
    <div
      className="absolute inset-0 z-40 flex items-end justify-center bg-[rgba(12,14,13,0.48)] p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="aha-title"
    >
      <div className="lat-fade-rise w-full max-w-sm rounded-2xl bg-[var(--bg-elevated)] p-5 shadow-[var(--shadow-premium)]">
        <p className="text-xs font-semibold tracking-wide text-[var(--accent)]">
          רגע הוואו · 1/1
        </p>
        <h2
          id="aha-title"
          className="mt-1 text-lg font-semibold text-[var(--ink-primary)]"
        >
          קפצו לרגע ההחלטה
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-secondary)]">
          בדמו הזה ההחלטה נאמרה ב־
          <span className="font-mono-time font-semibold text-[var(--ink-primary)]">
            {targetTimestamp}
          </span>
          . לחצו פעם אחת — תועברו למשפט בתמלול. כך Staz מוודא אמון, לא ניחושים.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button type="button" onClick={onJump} className="lat-btn-primary w-full">
            {targetTimestamp} ↗ לרגע ההחלטה
          </button>
        </div>
      </div>
    </div>
  );
}
