"use client";

import { useRef, useState } from "react";
import { ChevronDown, Download, Loader2 } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { downloadDocxReport } from "@/lib/export-docx";
import { downloadPdfReport } from "@/lib/export-pdf";
import {
  downloadFullReport,
  downloadSrt,
  downloadTranscript,
  downloadVtt,
} from "@/lib/export";
import { isRtl } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import type { ActionItem, TranscriptionResult } from "../types";
import { PdfReportTemplate, type PdfReportLabels } from "./PdfReportTemplate";

export type DownloadFormat =
  | "pdf"
  | "docx"
  | "full-txt"
  | "transcript-txt"
  | "srt"
  | "vtt";

interface ReportDownloadPickerProps {
  result: TranscriptionResult;
  actionItems: ActionItem[];
  pdfLabels: PdfReportLabels;
  className?: string;
}

export function ReportDownloadPicker({
  result,
  actionItems,
  pdfLabels,
  className,
}: ReportDownloadPickerProps) {
  const { t, locale } = useLocale();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [format, setFormat] = useState<DownloadFormat>("pdf");
  const [isDownloading, setIsDownloading] = useState(false);

  const formatOptions: { value: DownloadFormat; label: string }[] = [
    { value: "pdf", label: t.downloadFormatPdf },
    { value: "docx", label: t.downloadFormatDocx },
    { value: "full-txt", label: t.downloadFormatFullTxt },
    { value: "transcript-txt", label: t.downloadFormatTranscriptTxt },
    { value: "srt", label: t.downloadFormatSrt },
    { value: "vtt", label: t.downloadFormatVtt },
  ];

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      switch (format) {
        case "pdf":
          if (pdfRef.current) {
            await downloadPdfReport(pdfRef.current, result.fileName);
          }
          break;
        case "docx":
          await downloadDocxReport(
            result,
            actionItems,
            pdfLabels,
            isRtl(locale),
          );
          break;
        case "full-txt":
          downloadFullReport(result, actionItems);
          break;
        case "transcript-txt":
          downloadTranscript(result);
          break;
        case "srt":
          downloadSrt(result);
          break;
        case "vtt":
          downloadVtt(result);
          break;
      }
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 -left-[9999px] z-[-1]"
      >
        <div ref={pdfRef}>
          <PdfReportTemplate
            result={result}
            actionItems={actionItems}
            labels={pdfLabels}
            rtl={isRtl(locale)}
          />
        </div>
      </div>

      <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-end", className)}>
        <label className="flex min-w-[200px] flex-1 flex-col gap-1.5 sm:max-w-xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            {t.resDownloadFormat}
          </span>
          <div className="relative">
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as DownloadFormat)}
              disabled={isDownloading}
              className="h-8 w-full min-w-0 appearance-none rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
            >
              {formatOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          </div>
        </label>

        <Button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="gap-2 px-5"
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isDownloading ? t.resGeneratingDownload : t.resDownload}
        </Button>
      </div>
    </>
  );
}
