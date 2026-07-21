"use client";

import { use } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { LiveSessionViewer } from "@/features/live/components/LiveSessionViewer";
import { useLocale } from "@/context/LocaleContext";

export default function LiveSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t } = useLocale();

  return (
    <DashboardShell title={t.liveHubTitle} description={t.liveHubDesc}>
      <LiveSessionViewer meetingId={id} />
    </DashboardShell>
  );
}
