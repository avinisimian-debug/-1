"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { LiveHub } from "@/features/live";
import { useLocale } from "@/context/LocaleContext";

export default function LivePage() {
  const { t } = useLocale();

  return (
    <DashboardShell title={t.navLive} description={t.liveHubShellDesc}>
      <LiveHub />
    </DashboardShell>
  );
}
