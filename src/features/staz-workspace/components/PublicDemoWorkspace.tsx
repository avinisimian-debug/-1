"use client";

import { PremiumWorkspace } from "./PremiumWorkspace";
import { getDemoMeetingResult } from "../data/demo-meeting";
import { LANDING } from "@/lib/landing-copy";
import { StazButton } from "@/components/landing/ui/StazButton";
import { SectionHeader } from "@/components/landing/ui/SectionHeader";

type PublicDemoWorkspaceProps = {
  onSignup?: () => void;
};

export function PublicDemoWorkspace({ onSignup }: PublicDemoWorkspaceProps) {
  const copy = LANDING.demo;
  const demo = getDemoMeetingResult();

  return (
    <div id="demo" className="scroll-mt-24">
      <SectionHeader title={copy.label} subtitle={copy.hint} />
      <p className="mx-auto mt-3 max-w-xl text-center text-xs leading-relaxed text-[color-mix(in_srgb,var(--staz-muted)_75%,transparent)] sm:text-sm">
        {copy.honesty}
      </p>

      <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-2 sm:gap-3">
        <span className="rounded-full border border-[var(--staz-border)] bg-[var(--staz-surface)] px-3.5 py-1.5 font-mono-time text-xs text-[var(--staz-muted)] sm:text-sm">
          {copy.meetingLabel}
        </span>
        <span className="text-[var(--staz-primary)]" aria-hidden>
          →
        </span>
        <span className="rounded-full border border-[color-mix(in_srgb,var(--staz-primary)_35%,transparent)] bg-[color-mix(in_srgb,var(--staz-primary)_10%,white)] px-3.5 py-1.5 text-xs font-medium text-[var(--staz-primary)] sm:text-sm">
          {copy.closeoutLabel}
        </span>
        <span className="w-full text-center text-[11px] text-[var(--staz-muted)] sm:w-auto sm:text-xs">
          {demo.decisions?.length ?? 0} החלטות · {demo.actionItems.length} משימות ·
          ראיות מהתמלול
        </span>
      </div>

      <div className="staz-product-surface mt-6 overflow-hidden">
        <PremiumWorkspace
          result={demo}
          isDemo
          className="max-lg:min-h-[480px] sm:max-lg:min-h-[600px] lg:h-[min(88dvh,820px)]"
        />
      </div>

      {onSignup ? (
        <div className="mt-8 text-center">
          <p className="text-base text-[var(--staz-ink)] sm:text-lg">
            {copy.afterCtaTitle}
          </p>
          <StazButton onClick={onSignup} className="mt-4 w-full sm:w-auto">
            {copy.afterCtaButton}
          </StazButton>
        </div>
      ) : null}
    </div>
  );
}
