"use client";

import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { LoginScreen } from "./LoginScreen";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <LoginScreen />;
  }

  return <>{children}</>;
}
