"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { LiveHub } from "@/features/live";
import { useLocale } from "@/context/LocaleContext";

export default function LivePage() {
  const { t } = useLocale();

  return (
    <DashboardShell title={t.liveHubTitle} description={t.liveHubDesc}>
      <LiveHub />
    </DashboardShell>
  );
}
