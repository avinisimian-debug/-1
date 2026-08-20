"use client";

import { Lock } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

interface ShareLinkPanelProps {
  meetingTitle: string;
}

export function ShareLinkPanel({ meetingTitle }: ShareLinkPanelProps) {
  const { t } = useLocale();

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <Lock className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">{t.shareTitle}</h3>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {t.shareDesc.replace("{title}", meetingTitle)}
      </p>
    </div>
  );
}
