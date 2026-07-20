"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { LocaleProvider } from "@/context/LocaleContext";
import { PlanProvider } from "@/context/PlanContext";
import { FeatureGateProvider } from "@/context/FeatureGateContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LiveActivityToast } from "@/components/trust/LiveActivityToast";
import { useLocale } from "@/context/LocaleContext";

function DeferredLiveActivityToast() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;
  return <LiveActivityToast />;
}

function LocalizedErrorBoundary({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();
  return (
    <ErrorBoundary
      fallbackTitle={t.errorBoundaryTitle}
      fallbackMessage={t.errorBoundaryMessage}
      retryLabel={t.errorBoundaryRetry}
    >
      {children}
    </ErrorBoundary>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <LocaleProvider>
          <ToastProvider>
            <PlanProvider>
              <FeatureGateProvider>
                <LocalizedErrorBoundary>
                  {children}
                </LocalizedErrorBoundary>
                <DeferredLiveActivityToast />
              </FeatureGateProvider>
            </PlanProvider>
          </ToastProvider>
        </LocaleProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
