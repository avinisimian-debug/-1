"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { AuthPageSkeleton } from "@/shared/ui/skeleton";
import { LoginScreen } from "./LoginScreen";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const hasResolvedSession = useRef(false);
  const lastKnownStatus = useRef<"authenticated" | "unauthenticated" | "loading">(
    "loading",
  );

  useEffect(() => {
    if (status !== "loading") {
      hasResolvedSession.current = true;
      lastKnownStatus.current = status;
    }
  }, [status]);

  // Only block the app on the very first session check.
  if (status === "loading" && !hasResolvedSession.current) {
    return <AuthPageSkeleton />;
  }

  if (status === "authenticated") {
    return <>{children}</>;
  }

  if (status === "unauthenticated") {
    return <LoginScreen />;
  }

  // Session refresh in progress (e.g. during sign-in) — keep UI stable.
  if (lastKnownStatus.current === "authenticated") {
    return <>{children}</>;
  }

  return <LoginScreen />;
}
