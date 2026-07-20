"use client";

import { SessionProvider } from "next-auth/react";
import { LocaleProvider, useLocale } from "@/context/LocaleContext";
import { PlanProvider } from "@/context/PlanContext";
import { FeatureGateProvider } from "@/context/FeatureGateContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
                <LocalizedErrorBoundary>{children}</LocalizedErrorBoundary>
              </FeatureGateProvider>
            </PlanProvider>
          </ToastProvider>
        </LocaleProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
