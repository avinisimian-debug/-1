"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { cn } from "@/lib/utils";

interface LaunchTrialButtonProps {
  onSuccess?: () => void;
  className?: string;
}

export function LaunchTrialButton({ onSuccess, className }: LaunchTrialButtonProps) {
  const { t } = useLocale();
  const { syncPlan } = usePlan();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStart = async () => {
    setStatus("loading");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/user/start-launch-trial", { method: "POST" });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        const msg =
          data.error === "trial_used"
            ? t.launchTrialUsed
            : data.error === "launch_ended"
              ? t.launchTrialEnded
              : t.launchTrialError;
        setStatus("error");
        setErrorMsg(msg);
        return;
      }

      await syncPlan();
      setStatus("success");
      onSuccess?.();
    } catch {
      setStatus("error");
      setErrorMsg(t.launchTrialError);
    }
  };

  if (status === "success") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4",
          className,
        )}
      >
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        <p className="text-sm font-medium text-emerald-700">{t.launchTrialSuccess}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleStart}
        disabled={status === "loading"}
        className={cn(
          "btn-cinema flex w-full items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <Sparkles className="h-4 w-4" aria-hidden />
        )}
        {status === "loading" ? t.launchTrialLoading : t.launchTrialCta}
      </button>
      {errorMsg && (
        <p role="alert" className="mt-3 text-center text-sm text-red-600">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
