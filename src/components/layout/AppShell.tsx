"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { AppHeader } from "./AppHeader";
import { MobileSidebar, Sidebar } from "./Sidebar";

interface AppShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  contentClassName?: string;
}

export function AppShell({
  title,
  description,
  children,
  contentClassName,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "SA";

  return (
    <div className="app-shell-bg flex h-screen overflow-hidden">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          title={title}
          description={description}
          onMenuOpen={() => setMobileOpen(true)}
          userInitials={initials}
        />

        <main
          className={cn(
            "flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8",
            contentClassName,
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
