"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import type { PlanTier } from "@/lib/constants";
import { PLAN_LIMITS } from "@/lib/constants";

const STORAGE_KEY = "meetscribe-plan";

interface PlanContextValue {
  plan: PlanTier;
  limits: (typeof PLAN_LIMITS)[PlanTier];
  isPro: boolean;
  setPlan: (plan: PlanTier) => void;
  upgradeToPro: () => void;
  downgradeToFree: () => void;
  syncPlan: () => Promise<void>;
}

const PlanContext = createContext<PlanContextValue | null>(null);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [plan, setPlanState] = useState<PlanTier>("free");

  const setPlan = useCallback((next: PlanTier) => {
    setPlanState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const syncPlan = useCallback(async () => {
    try {
      const res = await fetch("/api/user/plan");
      if (res.ok) {
        const data = (await res.json()) as { plan: PlanTier };
        if (data.plan === "free" || data.plan === "pro") {
          setPlan(data.plan);
        }
      }
    } catch {
      // Keep the last server-synced plan; don't trust stale localStorage.
    }
  }, [setPlan]);

  useEffect(() => {
    if (status === "authenticated") {
      syncPlan();
    } else if (status === "unauthenticated") {
      setPlanState("free");
    }
  }, [status, syncPlan]);

  const upgradeToPro = useCallback(() => {
    setPlan("pro");
    void syncPlan();
  }, [setPlan, syncPlan]);
  const downgradeToFree = useCallback(() => setPlan("free"), [setPlan]);

  return (
    <PlanContext.Provider
      value={{
        plan,
        limits: PLAN_LIMITS[plan],
        isPro: plan === "pro",
        setPlan,
        upgradeToPro,
        downgradeToFree,
        syncPlan,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan must be used within PlanProvider");
  }
  return context;
}
