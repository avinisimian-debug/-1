"use client";

import { Lock } from "lucide-react";
import { useFeatureGate } from "@/context/FeatureGateContext";
import { usePlan } from "@/context/PlanContext";
import { hasFeature, type FeatureKey } from "@/lib/plan-features";
import { cn } from "@/lib/utils";

interface LockedFeatureTriggerProps {
  feature: FeatureKey;
  children: React.ReactNode;
  className?: string;
  /** When true, runs children onClick only if feature is unlocked */
  asGate?: boolean;
  onUnlock?: () => void;
}

export function LockedFeatureTrigger({
  feature,
  children,
  className,
  asGate = true,
  onUnlock,
}: LockedFeatureTriggerProps) {
  const { plan } = usePlan();
  const { requireFeature, promptUpgrade } = useFeatureGate();
  const unlocked = hasFeature(plan, feature);

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (asGate) {
          requireFeature(feature, () => onUnlock?.());
        } else {
          promptUpgrade(feature);
        }
      }}
      className={cn(
        "group inline-flex items-center gap-1.5 text-inherit",
        className,
      )}
    >
      {children}
      <Lock className="h-3 w-3 shrink-0 text-zinc-400 transition-colors group-hover:text-indigo-600" />
    </button>
  );
}

interface LockedTabProps {
  feature: FeatureKey;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onSelect: () => void;
}

export function LockedTab({ feature, label, icon, active, onSelect }: LockedTabProps) {
  const { plan } = usePlan();
  const { requireFeature } = useFeatureGate();
  const unlocked = hasFeature(plan, feature);

  return (
    <button
      type="button"
      onClick={() => {
        if (unlocked) {
          onSelect();
        } else {
          requireFeature(feature, onSelect);
        }
      }}
      className={cn(
        "flex shrink-0 items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-all",
        active
          ? "border-b-2 border-zinc-900 text-zinc-900"
          : "text-zinc-500 hover:text-zinc-700",
        !unlocked && "opacity-80",
      )}
    >
      {icon}
      <span>{label}</span>
      {!unlocked && <Lock className="h-3 w-3 text-zinc-400" />}
    </button>
  );
}
