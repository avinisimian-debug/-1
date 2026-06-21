"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { LocaleProvider } from "@/context/LocaleContext";
import { PlanProvider } from "@/context/PlanContext";
import { FeatureGateProvider } from "@/context/FeatureGateContext";
import { LiveActivityToast } from "@/components/trust/LiveActivityToast";

function DeferredLiveActivityToast() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;
  return <LiveActivityToast />;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LocaleProvider>
        <PlanProvider>
          <FeatureGateProvider>
            {children}
            <DeferredLiveActivityToast />
          </FeatureGateProvider>
        </PlanProvider>
      </LocaleProvider>
    </SessionProvider>
  );
}
