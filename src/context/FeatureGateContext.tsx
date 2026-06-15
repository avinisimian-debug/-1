"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { UpgradeModal } from "@/components/billing/UpgradeModal";
import { usePlan } from "@/context/PlanContext";
import { hasFeature, type FeatureKey } from "@/lib/plan-features";

interface FeatureGateContextValue {
  /** Returns true if allowed; otherwise opens upgrade modal and returns false. */
  gateFeature: (feature: FeatureKey) => boolean;
  /** Runs callback only when the user has access; otherwise opens upgrade modal. */
  requireFeature: (feature: FeatureKey, onAllowed: () => void) => void;
  promptUpgrade: (feature: FeatureKey) => void;
  closeUpgrade: () => void;
}

const FeatureGateContext = createContext<FeatureGateContextValue | null>(null);

export function FeatureGateProvider({ children }: { children: React.ReactNode }) {
  const { plan } = usePlan();
  const [activeFeature, setActiveFeature] = useState<FeatureKey | null>(null);

  const closeUpgrade = useCallback(() => setActiveFeature(null), []);

  const gateFeature = useCallback(
    (feature: FeatureKey) => {
      if (hasFeature(plan, feature)) return true;
      setActiveFeature(feature);
      return false;
    },
    [plan],
  );

  const requireFeature = useCallback(
    (feature: FeatureKey, onAllowed: () => void) => {
      if (gateFeature(feature)) onAllowed();
    },
    [gateFeature],
  );

  const promptUpgrade = useCallback((feature: FeatureKey) => {
    setActiveFeature(feature);
  }, []);

  const value = useMemo(
    () => ({ gateFeature, requireFeature, promptUpgrade, closeUpgrade }),
    [gateFeature, requireFeature, promptUpgrade, closeUpgrade],
  );

  return (
    <FeatureGateContext.Provider value={value}>
      {children}
      <UpgradeModal
        feature={activeFeature}
        open={activeFeature !== null}
        onClose={closeUpgrade}
      />
    </FeatureGateContext.Provider>
  );
}

export function useFeatureGate() {
  const ctx = useContext(FeatureGateContext);
  if (!ctx) {
    throw new Error("useFeatureGate must be used within FeatureGateProvider");
  }
  return ctx;
}
