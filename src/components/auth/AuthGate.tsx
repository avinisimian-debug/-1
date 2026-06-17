"use client";

import { useSession } from "next-auth/react";
import { AuthPageSkeleton } from "@/shared/ui/skeleton";
import { LoginScreen } from "./LoginScreen";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  if (status === "loading") {
    return <AuthPageSkeleton />;
  }

  if (status === "unauthenticated") {
    return <LoginScreen />;
  }

  return <>{children}</>;
}
