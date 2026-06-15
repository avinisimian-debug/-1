"use client";

import { SessionProvider } from "next-auth/react";
import { AuthGate } from "@/components/auth/AuthGate";
import { LocaleProvider } from "@/context/LocaleContext";
import { PlanProvider } from "@/context/PlanContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LocaleProvider>
        <PlanProvider>
          <AuthGate>{children}</AuthGate>
        </PlanProvider>
      </LocaleProvider>
    </SessionProvider>
  );
}
