"use client";

import { useState } from "react";
import { CheckCircle2, Crown, Loader2 } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { cn } from "@/lib/utils";

interface StartProTrialButtonProps {
  onSuccess?: () => void;
  className?: string;
}

export function StartProTrialButton({
  onSuccess,
  className,
}: StartProTrialButtonProps) {
  const { t } = useLocale();
  const { upgradeToPro } = usePlan();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStart = async () => {
    setStatus("loading");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/user/start-pro-trial", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? t.trialError);
        return;
      }

      upgradeToPro();
      setStatus("success");
      onSuccess?.();
    } catch {
      setStatus("error");
      setErrorMsg(t.trialError);
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4">
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        <p className="text-sm font-medium text-emerald-700">{t.trialSuccess}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {errorMsg && (
        <p className="mb-3 text-sm text-red-500">{errorMsg}</p>
      )}
      <button
        type="button"
        onClick={handleStart}
        disabled={status === "loading"}
        className={cn(
          "btn-cinema inline-flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-medium",
          status === "loading" && "opacity-70",
        )}
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Crown className="h-4 w-4" />
        )}
        {status === "loading" ? t.trialProcessing : t.trialStartCta}
      </button>
      <p className="mt-2 text-center text-[11px] text-zinc-500">{t.trialNote}</p>
    </div>
  );
}
