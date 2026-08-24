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

  return (
    <div id="demo" className="scroll-mt-24">
      <SectionHeader title={copy.label} subtitle={copy.hint} />
      <p className="mx-auto mt-3 max-w-xl text-center text-xs leading-relaxed text-[color-mix(in_srgb,var(--staz-muted)_75%,transparent)] sm:text-sm">
        {copy.honesty}
      </p>

      <div className="staz-product-surface mt-8 overflow-hidden">
        <PremiumWorkspace
          result={getDemoMeetingResult()}
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
