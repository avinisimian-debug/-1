"use client";

import { SessionProvider } from "next-auth/react";
import { AuthGate } from "@/components/auth/AuthGate";
import { LocaleProvider } from "@/context/LocaleContext";
import { PlanProvider } from "@/context/PlanContext";
import { FeatureGateProvider } from "@/context/FeatureGateContext";
import { LiveActivityToast } from "@/components/trust/LiveActivityToast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LocaleProvider>
        <PlanProvider>
          <FeatureGateProvider>
            <AuthGate>{children}</AuthGate>
            <LiveActivityToast />
          </FeatureGateProvider>
        </PlanProvider>
      </LocaleProvider>
    </SessionProvider>
  );
}
