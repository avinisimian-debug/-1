"use client";

import { FileText, ListChecks, Sparkles } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

export function LoginProductPreview({ className }: { className?: string }) {
  const { t } = useLocale();

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-2xl shadow-indigo-900/10",
        className,
      )}
      aria-hidden
    >
      <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50/90 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ms-2 text-[11px] font-medium text-zinc-400">Staz AI</span>
      </div>

      <div className="grid gap-0 sm:grid-cols-5">
        <div className="border-b border-zinc-100 bg-zinc-50/50 p-4 sm:col-span-2 sm:border-b-0 sm:border-e">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
            {t.resExecutive}
          </p>
          <div className="space-y-2">
            <div className="h-2 w-full rounded bg-zinc-200" />
            <div className="h-2 w-[92%] rounded bg-zinc-200" />
            <div className="h-2 w-[78%] rounded bg-zinc-100" />
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-50 px-2.5 py-2">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-[11px] font-medium text-indigo-800">
              {t.resTakeaways}
            </span>
          </div>
        </div>

        <div className="p-4 sm:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              <FileText className="h-3 w-3" />
              {t.resTranscript}
            </p>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-medium text-emerald-700">
              {t.resComplete}
            </span>
          </div>
          <div className="space-y-2">
            {["w-full", "w-[95%]", "w-[88%]", "w-full", "w-[70%]"].map((w, i) => (
              <div
                key={i}
                className={cn("h-2 rounded bg-zinc-100", w)}
                style={{ opacity: 1 - i * 0.12 }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-100 bg-zinc-50/60 px-4 py-3">
        <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          <ListChecks className="h-3 w-3" />
          {t.resActions}
        </p>
        <div className="flex flex-wrap gap-2">
          {[t.resPriorityHigh, t.resPriorityMedium, t.resPriorityLow].map((label, i) => (
            <span
              key={label}
              className={cn(
                "rounded-md px-2 py-1 text-[10px] font-medium",
                i === 0 && "bg-red-50 text-red-700",
                i === 1 && "bg-amber-50 text-amber-700",
                i === 2 && "bg-zinc-100 text-zinc-600",
              )}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
