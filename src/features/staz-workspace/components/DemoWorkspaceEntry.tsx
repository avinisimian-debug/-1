"use client";

import { useEffect, useState } from "react";
import { PremiumWorkspace, getDemoMeetingResult } from "@/features/staz-workspace";
import { hasProcessedFirstFile } from "@/lib/user-milestones";

/**
 * Demo only until user completes first real file (`staz_has_processed_first_file`).
 */
export function DemoWorkspaceEntry({
  onDismiss,
}: {
  onDismiss?: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!hasProcessedFirstFile());
  }, []);

  if (!visible) return null;

  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-[var(--ink-primary)]">
            דמו מנהלים · ראו את Staz בפעולה
          </p>
          <p className="text-xs text-[var(--ink-tertiary)]">
            פגישת פיילוט בעברית — קפצו לרגע ההחלטה תוך דקה
          </p>
        </div>
        <button
          type="button"
          className="lat-btn-ghost !min-h-9 text-xs"
          onClick={() => {
            setVisible(false);
            onDismiss?.();
          }}
        >
          סגרו
        </button>
      </div>
      <PremiumWorkspace result={getDemoMeetingResult()} isDemo />
    </div>
  );
}
