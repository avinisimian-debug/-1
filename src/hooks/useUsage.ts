"use client";

import { useCallback, useEffect, useState } from "react";
import { usePlan } from "@/context/PlanContext";
import {
  canTranscribe,
  getUsageCount,
  getUsageLimit,
  getUsagePercent,
  incrementUsage,
} from "@/lib/usage-store";

export function useUsage() {
  const { plan } = usePlan();
  const [count, setCount] = useState(0);

  const refresh = useCallback(() => {
    setCount(getUsageCount());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const recordUsage = useCallback(() => {
    incrementUsage();
    refresh();
  }, [refresh]);

  return {
    count,
    limit: getUsageLimit(plan),
    percent: getUsagePercent(plan),
    canTranscribe: canTranscribe(plan),
    recordUsage,
    refresh,
  };
}
