"use client";

import { PremiumWorkspace } from "./PremiumWorkspace";
import { getDemoMeetingResult } from "../data/demo-meeting";
import { LANDING } from "@/lib/landing-copy";

type PublicDemoWorkspaceProps = {
  onSignup?: () => void;
};

/** Interactive public demo — transcript evidence jump, no fake audio. */
export function PublicDemoWorkspace({ onSignup }: PublicDemoWorkspaceProps) {
  const copy = LANDING.demo;

  return (
    <div id="demo" className="scroll-mt-28">
      <div className="mb-7 text-center">
        <h2
          id="demo-heading"
          className="font-brand text-2xl tracking-tight text-[var(--staz-text)] sm:text-3xl"
        >
          {copy.label}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-relaxed text-[var(--staz-muted)] sm:text-base">
          {copy.hint}
        </p>
        <p className="mx-auto mt-2 max-w-xl text-pretty text-xs leading-relaxed text-[color-mix(in_srgb,var(--staz-muted)_70%,transparent)] sm:text-sm">
          {copy.honesty}
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-[var(--staz-border)] shadow-[0_40px_100px_-36px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.03]">
        <PremiumWorkspace
          result={getDemoMeetingResult()}
          isDemo
          className="max-lg:min-h-[720px] lg:h-[min(88dvh,820px)]"
        />
      </div>
      {onSignup ? (
        <div className="mt-8 text-center">
          <p className="text-base text-[var(--staz-text)] sm:text-lg">
            {copy.afterCtaTitle}
          </p>
          <button
            type="button"
            onClick={onSignup}
            className="staz-btn-primary mt-4 w-full sm:w-auto"
          >
            {copy.afterCtaButton}
          </button>
        </div>
      ) : null}
    </div>
  );
}
