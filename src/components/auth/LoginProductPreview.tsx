"use client";

import { FileText, ListChecks, Sparkles } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div className={cn("skeleton-shimmer h-2 rounded", className)} />
  );
}

export function LoginProductPreview({ className }: { className?: string }) {
  const { t } = useLocale();

  return (
    <div
      className={cn(
        "premium-card relative overflow-hidden rounded-2xl shadow-lg",
        className,
      )}
      aria-hidden
    >
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ms-2 text-[11px] font-medium text-muted-foreground">
          Staz AI
        </span>
      </div>

      <div className="grid gap-0 sm:grid-cols-5">
        <div className="border-b border-border bg-muted/20 p-4 sm:col-span-2 sm:border-b-0 sm:border-e">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-accent">
            {t.resExecutive}
          </p>
          <div className="space-y-2">
            <SkeletonLine className="w-full" />
            <SkeletonLine className="w-[92%]" />
            <SkeletonLine className="w-[78%] opacity-70" />
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-accent-muted px-2.5 py-2">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-[11px] font-medium text-accent">
              {t.resTakeaways}
            </span>
          </div>
        </div>

        <div className="p-4 sm:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <FileText className="h-3 w-3" />
              {t.resTranscript}
            </p>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-medium text-emerald-700">
              {t.resComplete}
            </span>
          </div>
          <div className="space-y-2">
            {["w-full", "w-[95%]", "w-[88%]", "w-full", "w-[70%]"].map((w) => (
              <SkeletonLine key={w} className={w} />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-muted/30 px-4 py-3">
        <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <ListChecks className="h-3 w-3" />
          {t.resActions}
        </p>
        <div className="flex flex-wrap gap-2">
          {[t.resPriorityHigh, t.resPriorityMedium, t.resPriorityLow].map(
            (label, i) => (
              <span
                key={label}
                className={cn(
                  "rounded-md px-2 py-1 text-[10px] font-medium",
                  i === 0 && "bg-red-50 text-red-700",
                  i === 1 && "bg-amber-50 text-amber-700",
                  i === 2 && "bg-muted text-muted-foreground",
                )}
              >
                {label}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
