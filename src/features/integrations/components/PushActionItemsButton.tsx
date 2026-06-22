"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { useFeatureGate } from "@/context/FeatureGateContext";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { hasFeature } from "@/lib/plan-features";
import { Button } from "@/shared/ui/button";
import type { TranscriptionResult } from "@/features/transcription/types";
import { pushActionItems } from "../api/integrations.client";

interface PushActionItemsButtonProps {
  result: TranscriptionResult;
  actionItems: TranscriptionResult["actionItems"];
}

export function PushActionItemsButton({
  result,
  actionItems,
}: PushActionItemsButtonProps) {
  const { t } = useLocale();
  const { plan } = usePlan();
  const { promptUpgrade } = useFeatureGate();
  const unlocked = hasFeature(plan, "integrationsPush");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const label =
    status === "success"
      ? t.integPushSuccess
      : status === "error"
        ? t.integPushFailed
        : t.integPushCta;

  const handlePush = async () => {
    if (!unlocked) {
      promptUpgrade("integrationsPush");
      return;
    }

    setLoading(true);
    setStatus("idle");
    try {
      const response = await pushActionItems(
        {
          source: "staz-ai",
          fileName: result.fileName,
          processedAt: result.processedAt,
          headline: result.headline,
          overview: result.summary.overview,
          actionItems,
        },
        ["webhook"],
      );

      setStatus(response.results.some((r) => r.ok) ? "success" : "error");
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={loading || actionItems.length === 0}
      onClick={handlePush}
      className="gap-2"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Send className="h-3.5 w-3.5" />
      )}
      {label}
    </Button>
  );
}
