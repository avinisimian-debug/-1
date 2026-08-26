"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { AppHeader } from "./AppHeader";
import { CommandPalette } from "./CommandPalette";
import { MobileSidebar, Sidebar } from "./Sidebar";
import { LaunchAnnouncementBar } from "@/components/launch/LaunchAnnouncementBar";
import {
  LaunchMonthModal,
  useLaunchMonthAutoModal,
} from "@/components/launch/LaunchMonthModal";
import { StazAccountDrawer } from "@/components/ui/animated-drawer";
import { usePlan } from "@/context/PlanContext";
import { isLaunchCampaignActive } from "@/lib/launch-campaign";

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
  const [launchOpen, setLaunchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { data: session } = useSession();
  const { isPro } = usePlan();
  const autoLaunch = useLaunchMonthAutoModal(
    Boolean(session?.user) && !isPro && isLaunchCampaignActive(),
  );

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "SA";

  const showLaunchModal = launchOpen || autoLaunch.open;
  const closeLaunch = () => {
    setLaunchOpen(false);
    autoLaunch.close();
  };

  return (
    <div className="app-shell-bg flex h-screen overflow-hidden">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        {!isPro ? (
          <LaunchAnnouncementBar onOpenOffer={() => setLaunchOpen(true)} />
        ) : null}
        <AppHeader
          title={title}
          description={description}
          onMenuOpen={() => setMobileOpen(true)}
          userInitials={initials}
          onAccountOpen={() => setAccountOpen(true)}
        />

        <main
          className={cn(
            "workbench-main flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8",
            contentClassName,
          )}
        >
          {children}
        </main>
      </div>

      <CommandPalette />
      <StazAccountDrawer
        open={accountOpen}
        onOpenChange={setAccountOpen}
        userName={session?.user?.name}
      />
      <LaunchMonthModal
        open={showLaunchModal}
        onClose={closeLaunch}
        source={launchOpen ? "app_banner" : "app_auto"}
      />
    </div>
  );
}
