"use client";

import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { LoginScreen } from "./LoginScreen";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="cinema-bg flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-amber-400" />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <LoginScreen />;
  }

  return <>{children}</>;
}
