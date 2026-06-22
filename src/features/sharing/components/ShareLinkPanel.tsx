"use client";

import { useState } from "react";
import { Copy, Globe, Link2, Lock } from "lucide-react";
import { useFeatureGate } from "@/context/FeatureGateContext";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { hasFeature } from "@/lib/plan-features";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

interface ShareLinkPanelProps {
  meetingTitle: string;
}

export function ShareLinkPanel({ meetingTitle }: ShareLinkPanelProps) {
  const { t } = useLocale();
  const { plan } = usePlan();
  const { promptUpgrade } = useFeatureGate();
  const unlocked = hasFeature(plan, "sharedLinks");
  const [mode, setMode] = useState<"private" | "link">("private");
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/share/demo-token`
      : "";

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <Link2 className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">{t.shareTitle}</h3>
      </div>
      <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
        {t.shareDesc.replace("{title}", meetingTitle)}
      </p>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("private")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium ${
            mode === "private"
              ? "border-foreground bg-card text-foreground"
              : "border-border text-muted-foreground"
          }`}
        >
          <Lock className="h-3.5 w-3.5" />
          {t.sharePrivate}
        </button>
        <button
          type="button"
          onClick={() => {
            if (!unlocked) {
              promptUpgrade("sharedLinks");
              return;
            }
            setMode("link");
          }}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium ${
            mode === "link"
              ? "border-foreground bg-card text-foreground"
              : "border-border text-muted-foreground"
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          {t.sharePublicLink}
        </button>
      </div>

      {mode === "link" && unlocked && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input readOnly value={shareUrl} className="text-xs" />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2 shrink-0"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? t.resCopied : t.shareCopyLink}
          </Button>
        </div>
      )}
    </div>
  );
}
