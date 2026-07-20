"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
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

function readStoredPlan(): PlanTier {
  if (typeof window === "undefined") return "free";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "pro" || stored === "free") return stored;
  } catch {
    /* ignore */
  }
  return "free";
}

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [plan, setPlanState] = useState<PlanTier>("free");
  const skipNextDemoteRef = useRef(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    setPlanState(readStoredPlan());
  }, []);

  const setPlan = useCallback((next: PlanTier) => {
    setPlanState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const syncPlan = useCallback(async () => {
    try {
      const res = await fetch("/api/user/plan", { cache: "no-store" });
      if (!res.ok) {
        // Keep last known plan on API errors (don't flash Free).
        return;
      }
      const data = (await res.json()) as { plan: PlanTier };
      if (data.plan !== "free" && data.plan !== "pro") return;

      if (data.plan === "free" && skipNextDemoteRef.current) {
        skipNextDemoteRef.current = false;
        return;
      }

      skipNextDemoteRef.current = false;
      setPlan(data.plan);
    } catch {
      // Keep the last known plan; don't trust a failed network call.
    }
  }, [setPlan]);

  useEffect(() => {
    if (status === "authenticated") {
      void syncPlan();
    } else if (status === "unauthenticated") {
      setPlanState("free");
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
  }, [status, syncPlan]);

  const upgradeToPro = useCallback(() => {
    skipNextDemoteRef.current = true;
    setPlan("pro");
    // Delay sync so capture/webhook can persist before we re-read.
    window.setTimeout(() => {
      void syncPlan();
    }, 1500);
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
