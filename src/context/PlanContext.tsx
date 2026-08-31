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
import { notifyPlanUpdated } from "@/lib/plan-events";

interface PlanContextValue {
  plan: PlanTier;
  limits: (typeof PLAN_LIMITS)[PlanTier];
  isPro: boolean;
  upgradeToPro: () => void;
  syncPlan: () => Promise<void>;
}

const PlanContext = createContext<PlanContextValue | null>(null);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [plan, setPlanState] = useState<PlanTier>("free");

  const syncPlan = useCallback(async () => {
    try {
      const res = await fetch("/api/user/plan", { cache: "no-store" });
      if (!res.ok) {
        if (res.status === 401) setPlanState("free");
        return;
      }
      const data = (await res.json()) as { plan: PlanTier };
      if (data.plan === "free" || data.plan === "pro") {
        setPlanState(data.plan);
      }
    } catch {
      /* keep last server-known plan */
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      void syncPlan();
    } else if (status === "unauthenticated") {
      setPlanState("free");
    }
  }, [status, syncPlan]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const onFocus = () => {
      void syncPlan();
    };
    const onPlanUpdated = () => {
      void syncPlan();
    };

    window.addEventListener("focus", onFocus);
    window.addEventListener("staz:plan-updated", onPlanUpdated);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("staz:plan-updated", onPlanUpdated);
    };
  }, [status, syncPlan]);

  const upgradeToPro = useCallback(() => {
    notifyPlanUpdated();
    window.setTimeout(() => {
      void syncPlan();
    }, 800);
  }, [syncPlan]);

  return (
    <PlanContext.Provider
      value={{
        plan,
        limits: PLAN_LIMITS[plan],
        isPro: plan === "pro",
        upgradeToPro,
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
