"use client";

import { useCallback, useRef, useState } from "react";
import { Copy, Download, Loader2, X } from "lucide-react";
import type { TranscriptionResult } from "@/features/transcription/types";
import { buildSummaryText, copyToClipboard } from "@/lib/export";
import { downloadPdfReport } from "@/lib/export-pdf";
import { ExecutiveBriefPdfDocument } from "./ExecutiveBriefPdfDocument";
import { usePlan } from "@/context/PlanContext";
import { useFeatureGate } from "@/context/FeatureGateContext";
import { hasFeature } from "@/lib/plan-features";

interface ShareSheetProps {
  result: TranscriptionResult;
  onClose: () => void;
}

export function ShareSheet({ result, onClose }: ShareSheetProps) {
  const { plan } = usePlan();
  const { promptUpgrade } = useFeatureGate();
  const canPdf = hasFeature(plan, "pdfExport");
  const [copied, setCopied] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  const copy = useCallback(async () => {
    await copyToClipboard(buildSummaryText(result));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const downloadPdf = useCallback(async () => {
    if (pdfBusy || !pdfRef.current) return;
    setPdfBusy(true);
    setPdfError(null);
    try {
      await downloadPdfReport(pdfRef.current, result.fileName);
    } catch (err) {
      console.error(err);
      setPdfError("ייצוא PDF נכשל. נסו שוב או העתיקו את הסיכום.");
    } finally {
      setPdfBusy(false);
    }
  }, [pdfBusy, result.fileName]);

  const lines = result.summary.executive.slice(0, 4);

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-[rgba(12,14,13,0.48)] p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Off-screen print target — Hebrew-safe via html2canvas */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 -start-[9999px] z-[-1] opacity-0"
      >
        <div ref={pdfRef}>
          <ExecutiveBriefPdfDocument result={result} />
        </div>
      </div>

      <div
        className="lat-fade-rise w-full max-w-md rounded-2xl bg-[var(--bg-elevated)] p-5 shadow-[var(--shadow-premium)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold">שתף סיכום</h2>
            <p className="text-xs text-[var(--ink-tertiary)]">
              ארטיפקט מנהלים מוכן ללוח / לצוות
            </p>
          </div>
          <button type="button" onClick={onClose} className="lat-btn-ghost !min-h-9 !px-2">
            <X className="size-4" />
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-[var(--line-subtle)]">
          <div className="bg-[var(--accent-soft)] px-4 py-2">
            <span className="font-brand text-sm text-[var(--accent)]">STAZ</span>
            <span className="ms-2 text-[11px] text-[var(--ink-secondary)]">
              תמצית מנהלים
            </span>
          </div>
          <div className="space-y-2 px-4 py-3">
            <p className="text-sm font-semibold">{result.fileName}</p>
            <p className="text-xs text-[var(--ink-tertiary)]">{result.duration}</p>
            <ul className="space-y-1.5">
              {lines.map((l) => (
                <li key={l} className="text-sm leading-relaxed text-[var(--ink-secondary)]">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {pdfError ? (
          <p className="mt-3 text-xs text-[var(--danger)]">{pdfError}</p>
        ) : null}

        <div className="mt-4 flex flex-col gap-2">
          <button type="button" onClick={() => void copy()} className="lat-btn-primary w-full">
            <Copy className="size-4" />
            {copied ? "הועתק" : "העתק סיכום לצוות"}
          </button>
          {canPdf ? (
            <button
              type="button"
              onClick={() => void downloadPdf()}
              disabled={pdfBusy}
              className="lat-btn-ghost w-full border border-[var(--line-strong)] text-sm disabled:opacity-50"
            >
              {pdfBusy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              {pdfBusy ? "מכין PDF…" : "הורד תמצית מנהלים (PDF)"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => promptUpgrade("pdfExport")}
              className="lat-btn-ghost w-full border border-[var(--line-strong)] text-sm"
            >
              PDF מקצועי — כלול ב-Pro
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
