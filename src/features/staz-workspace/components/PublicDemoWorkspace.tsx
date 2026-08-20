"use client";

import { PremiumWorkspace } from "./PremiumWorkspace";
import { getDemoMeetingResult } from "../data/demo-meeting";

/** Interactive public demo — transcript evidence jump, no fake audio. */
export function PublicDemoWorkspace() {
  return (
    <div id="demo" className="scroll-mt-24">
      <div className="mb-5 text-center">
        <p className="text-[13px] font-medium tracking-wide text-[#7eb8ab]">
          דמו אינטראקטיבי
        </p>
        <p className="mx-auto mt-2 max-w-xl text-pretty text-sm leading-relaxed text-[#b4bab4]">
          לחצו על החלטה כדי לקפוץ לרגע בתמלול. אין הקלטה בדמו — ולכן אין נגן שמע.
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.7)]">
        <PremiumWorkspace
          result={getDemoMeetingResult()}
          isDemo
          className="max-lg:min-h-[720px] lg:h-[min(88dvh,820px)]"
        />
      </div>
    </div>
  );
}
