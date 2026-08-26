"use client";

import { useMemo, useRef, useState } from "react";
import {
  DEMO_AHA_TIMESTAMP,
  getDemoMeetingResult,
} from "@/features/staz-workspace/data/demo-meeting";
import { LANDING } from "@/lib/landing-copy";
import { LandingChapter } from "@/components/landing/ui/LandingChapter";
import { SectionHeader } from "@/components/landing/ui/SectionHeader";
import { StazButton } from "@/components/landing/ui/StazButton";
import { scrollIntoContainer } from "@/lib/scroll-into-container";
import { cn } from "@/lib/utils";

/** Signature interaction: decision → timestamp → transcript highlight. */
export function AhaEvidenceSection() {
  const demo = useMemo(() => getDemoMeetingResult(), []);
  const decision = demo.decisions?.[0] ?? "החלטה מהפגישה";
  const lines = useMemo(() => {
    const all = demo.transcript;
    const target = all.find((t) => t.timestamp === DEMO_AHA_TIMESTAMP);
    const head = all.filter((t) => t.timestamp !== DEMO_AHA_TIMESTAMP).slice(0, 4);
    return target ? [...head.slice(0, 3), target, ...head.slice(3, 4)] : all.slice(0, 5);
  }, [demo.transcript]);
  const [activeTs, setActiveTs] = useState<string | null>(null);
  const [scrub, setScrub] = useState(8);
  const listRef = useRef<HTMLUListElement>(null);
  const copy = LANDING.aha;
  const revealed = activeTs === DEMO_AHA_TIMESTAMP;

  const jump = () => {
    setScrub(52);
    setActiveTs(DEMO_AHA_TIMESTAMP);
    window.setTimeout(() => {
      const line = document.getElementById(`aha-line-${DEMO_AHA_TIMESTAMP}`);
      const list = listRef.current;
      if (line && list) {
        scrollIntoContainer(line, list, { behavior: "smooth", block: "center" });
      }
    }, 120);
  };

  return (
    <LandingChapter tone="forest">
      <SectionHeader
        tone="dark"
        title={
          <>
            <span className="block">{copy.headline}</span>
            <span className="mt-1 block text-[color-mix(in_srgb,var(--staz-sage)_90%,white)]">
              {copy.headlineAccent}
            </span>
          </>
        }
        subtitle={copy.body}
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative rounded-[var(--staz-radius)] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
          <p className="text-[11px] font-medium tracking-[0.12em] text-[color-mix(in_srgb,var(--staz-sage)_85%,white)]">
            מה הוחלט
          </p>
          <p className="mt-3 text-base font-medium leading-relaxed text-[var(--staz-on-dark)]">
            {decision}
          </p>

          <div
            className={cn(
              "mt-6 hidden h-px w-full bg-gradient-to-l from-transparent via-[var(--staz-evidence)] to-transparent lg:block",
              revealed && "landing-aha-pulse",
            )}
            aria-hidden
          />

          <StazButton variant="onDark" className="mt-6 w-full sm:w-auto" onClick={jump}>
            {DEMO_AHA_TIMESTAMP} ↗ {copy.cta}
          </StazButton>

          <div className="mt-5">
            <div className="mb-2 flex justify-between text-[10px] text-[var(--staz-on-dark-muted)]">
              <span>00:00</span>
              <span>{demo.duration}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="landing-timeline-fill h-full rounded-full bg-[var(--staz-evidence)]"
                style={{ width: `${scrub}%` }}
              />
            </div>
          </div>

          {revealed ? (
            <p className="mt-4 text-sm text-[color-mix(in_srgb,var(--staz-sage)_90%,white)]">
              {copy.reveal}
            </p>
          ) : (
            <p className="mt-4 text-xs text-[var(--staz-on-dark-muted)]">
              אין נגן שמע בדמו — הקפיצה מדגישה את המשפט בתמלול.
            </p>
          )}
        </div>

        <div className="rounded-[var(--staz-radius)] border border-white/10 bg-[color-mix(in_srgb,var(--staz-forest)_70%,black)] p-4 sm:p-5">
          <p className="mb-3 text-[11px] font-medium tracking-[0.12em] text-[var(--staz-on-dark-muted)]">
            תמלול
          </p>
          <ul
            ref={listRef}
            className="max-h-[280px] space-y-2 overflow-y-auto pe-1 sm:max-h-[300px]"
          >
            {lines.map((line) => {
              const active = activeTs === line.timestamp;
              return (
                <li
                  key={`${line.timestamp}-${line.speaker}`}
                  id={`aha-line-${line.timestamp}`}
                  className={cn(
                    "rounded-[var(--staz-radius-sm)] border px-3 py-2.5 transition-all duration-300",
                    active
                      ? "landing-aha-pulse border-[var(--staz-evidence)] bg-[color-mix(in_srgb,var(--staz-evidence)_22%,transparent)]"
                      : "border-transparent bg-white/[0.03]",
                  )}
                >
                  <p className="font-mono-time text-[11px] text-[var(--staz-warn)]">
                    {line.timestamp}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--staz-on-dark)]">
                    <span className="font-semibold text-[color-mix(in_srgb,var(--staz-sage)_90%,white)]">
                      {line.speaker}:{" "}
                    </span>
                    {line.text}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </LandingChapter>
  );
}
