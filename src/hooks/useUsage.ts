"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePlan } from "@/context/PlanContext";
import {
  canTranscribe as canTranscribeLocal,
  getUsageCount,
  getUsageLimit,
  incrementUsage,
} from "@/lib/usage-store";

interface UsageApiResponse {
  count: number;
  limit: number;
  remaining: number;
}

export function useUsage() {
  const { plan } = usePlan();
  const { status } = useSession();
  const [count, setCount] = useState(0);
  const limit = getUsageLimit(plan);

  const refresh = useCallback(async () => {
    if (status === "authenticated") {
      try {
        const res = await fetch("/api/user/usage", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as UsageApiResponse;
          setCount(data.count);
          return;
        }
      } catch {
        /* fall back to local */
      }
    }
    setCount(getUsageCount());
  }, [status]);

  useEffect(() => {
    void refresh();
  }, [refresh, plan]);

  useEffect(() => {
    const onPlanUpdated = () => {
      void refresh();
    };
    window.addEventListener("staz:plan-updated", onPlanUpdated);
    return () => window.removeEventListener("staz:plan-updated", onPlanUpdated);
  }, [refresh]);

  const recordUsage = useCallback(() => {
    incrementUsage();
    setCount((c) => c + 1);
    void refresh();
  }, [refresh]);

  const canUpload =
    status === "authenticated" ? count < limit : canTranscribeLocal(plan);

  return {
    count,
    limit,
    percent: limit === 0 ? 100 : Math.min(100, Math.round((count / limit) * 100)),
    canTranscribe: canUpload,
    recordUsage,
    refresh,
    remaining: Math.max(0, limit - count),
  };
}
