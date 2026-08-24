"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TranscriptionResult } from "@/features/transcription/types";
import {
  findActiveLineIndex,
  timestampToSeconds,
} from "@/features/workspace/lib/timestamp";
import { useMediaPlayback } from "@/features/workspace/hooks/useMediaPlayback";
import {
  Copy,
  Download,
  Loader2,
  Pause,
  Play,
  Share2,
  Upload,
} from "lucide-react";
import { AiAssistantRail } from "./AiAssistantRail";
import { TranscriptTimeline } from "./TranscriptTimeline";
import { AhaOnboarding } from "./AhaOnboarding";
import { ShareSheet } from "./ShareSheet";
import { ExecutiveBriefPdfDocument } from "./ExecutiveBriefPdfDocument";
import {
  DEMO_AHA_TIMESTAMP,
  DEMO_MEETING_ID,
} from "../data/demo-meeting";
import { buildSummaryText, copyToClipboard } from "@/lib/export";
import { downloadPdfReport } from "@/lib/export-pdf";
import { usePlan } from "@/context/PlanContext";
import { useFeatureGate } from "@/context/FeatureGateContext";
import { hasFeature } from "@/lib/plan-features";
import { cn } from "@/lib/utils";

type MobileTab = "summary" | "transcript" | "ask";

const AHA_STORAGE_KEY = "staz-aha-onboarding-v1";

interface PremiumWorkspaceProps {
  result: TranscriptionResult;
  mediaSrc?: string;
  mediaKind?: "audio" | "video";
  isDemo?: boolean;
  onReset?: () => void;
  className?: string;
}

export function PremiumWorkspace({
  result,
  mediaSrc,
  mediaKind = "audio",
  isDemo,
  onReset,
  className,
}: PremiumWorkspaceProps) {
  const { plan } = usePlan();
  const { promptUpgrade } = useFeatureGate();
  const canPdf = hasFeature(plan, "pdfExport");
  const demo =
    isDemo ??
    (result.fileName.includes("Demo") || result.fileName.includes("Staz Demo"));
  const playback = useMediaPlayback(mediaSrc, mediaKind);
  const [seekSeconds, setSeekSeconds] = useState(0);
  const [highlightTs, setHighlightTs] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("summary");
  const [shareOpen, setShareOpen] = useState(false);
  const [ahaOpen, setAhaOpen] = useState(false);
  const [ahaPulse, setAhaPulse] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const currentSeconds = mediaSrc ? playback.currentTime : seekSeconds;

  useEffect(() => {
    if (!demo) return;
    try {
      if (localStorage.getItem(AHA_STORAGE_KEY) === "1") return;
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => setAhaOpen(true), 400);
    return () => window.clearTimeout(t);
  }, [demo]);

  const seekTo = useCallback(
    (seconds: number) => {
      setSeekSeconds(seconds);
      setHighlightTs(null);
      if (mediaSrc) {
        playback.seekTo(seconds);
        if (!playback.isPlaying) void playback.togglePlay();
      }
    },
    [mediaSrc, playback],
  );

  const seekTimestamp = useCallback(
    (ts: string) => {
      setHighlightTs(ts);
      seekTo(timestampToSeconds(ts));
      setMobileTab("transcript");
    },
    [seekTo],
  );

  const completeAhaJump = useCallback(() => {
    setAhaPulse(true);
    seekTimestamp(DEMO_AHA_TIMESTAMP);
    setAhaOpen(false);
    try {
      localStorage.setItem(AHA_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    window.setTimeout(() => setAhaPulse(false), 4000);
  }, [seekTimestamp]);

  const copyBrief = useCallback(async () => {
    await copyToClipboard(buildSummaryText(result));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const downloadPdf = useCallback(async () => {
    if (!canPdf) {
      promptUpgrade("pdfExport");
      return;
    }
    if (pdfBusy || !pdfRef.current) return;
    setPdfBusy(true);
    try {
      await downloadPdfReport(pdfRef.current, result.fileName);
    } catch (err) {
      console.error(err);
    } finally {
      setPdfBusy(false);
    }
  }, [canPdf, pdfBusy, promptUpgrade, result.fileName]);

  const activeLabel = result.transcript[
    Math.max(
      0,
      findActiveLineIndex(
        result.transcript.map((e) => e.timestamp),
        currentSeconds,
      ),
    )
  ];

  return (
    <div
      className={cn(
        "relative flex h-[min(100dvh,920px)] min-h-[640px] flex-col overflow-hidden rounded-2xl border border-[var(--line-subtle)] bg-[var(--bg-canvas)] shadow-[var(--shadow-premium)]",
        className,
      )}
      data-demo={demo ? DEMO_MEETING_ID : undefined}
    >
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 -start-[9999px] z-[-1] opacity-0"
      >
        <div ref={pdfRef}>
          <ExecutiveBriefPdfDocument result={result} />
        </div>
      </div>

      {/* Header — clear export actions, sticky tools */}
      <header className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-[var(--line-subtle)] bg-[color-mix(in_srgb,var(--bg-elevated)_92%,transparent)] px-3 py-2.5 backdrop-blur-md sm:gap-2.5 sm:px-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            STAZ
          </p>
          <h1 className="mt-0.5 truncate text-sm font-semibold leading-snug text-[var(--ink-primary)] sm:text-[0.9375rem]">
            {result.fileName}
          </h1>
        </div>
        <span className="hidden rounded-full bg-[var(--ok-soft,rgba(47,111,78,0.1))] px-2.5 py-1 text-[11px] font-semibold text-[var(--ok,#2F6F4E)] sm:inline-flex">
          מוכן
        </span>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => void copyBrief()}
            className="lat-btn-ghost !min-h-10 !rounded-full !px-3 !text-sm"
          >
            <Copy className="size-3.5" />
            <span className="hidden sm:inline">{copied ? "הועתק" : "העתק"}</span>
          </button>
          <button
            type="button"
            onClick={() => void downloadPdf()}
            disabled={pdfBusy}
            className="lat-btn-ghost !min-h-10 !rounded-full !px-3 !text-sm disabled:opacity-50"
            title={canPdf ? "הורדת PDF" : "PDF כלול ב-Pro"}
          >
            {pdfBusy ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Download className="size-3.5" />
            )}
            <span className="hidden sm:inline">PDF</span>
          </button>
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="lat-btn-primary !min-h-10 !rounded-full !px-3.5 !text-sm"
          >
            <Share2 className="size-3.5" />
            שתף
          </button>
          {onReset ? (
            <button
              type="button"
              onClick={onReset}
              className="lat-btn-ghost !min-h-10 !rounded-full !px-3 !text-sm"
            >
              <Upload className="size-3.5" />
              <span className="hidden sm:inline">חדש</span>
            </button>
          ) : null}
        </div>
      </header>

      {/* Mobile tabs — default סיכום */}
      <div className="sticky top-[3.25rem] z-[9] flex border-b border-[var(--line-subtle)] bg-[color-mix(in_srgb,var(--bg-elevated)_94%,transparent)] backdrop-blur-md lg:hidden">
        {(
          [
            ["summary", "סיכום"],
            ["transcript", "תמלול"],
            ["ask", "שאלו"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMobileTab(id)}
            className={cn(
              "min-h-11 flex-1 py-2.5 text-sm font-semibold transition-colors duration-150",
              mobileTab === id
                ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                : "border-b-2 border-transparent text-[var(--ink-tertiary)] hover:text-[var(--ink-secondary)]",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Desktop 3-pane + mobile panes */}
      <div className="lat-workspace-grid min-h-0 flex-1">
        {/* Media */}
        <section
          className={cn(
            "flex flex-col border-[var(--line-subtle)] bg-[var(--bg-elevated)] p-3 lg:border-e",
            "max-lg:border-b",
            mobileTab !== "transcript" && mobileTab !== "summary"
              ? "max-lg:hidden"
              : "",
            mobileTab === "ask" && "max-lg:hidden",
          )}
        >
          <div className="flex aspect-video items-center justify-center rounded-xl bg-[var(--bg-subtle)]">
            {mediaSrc ? (
              mediaKind === "video" ? (
                <video
                  ref={playback.mediaRef as React.RefObject<HTMLVideoElement>}
                  src={mediaSrc}
                  className="h-full w-full rounded-xl object-contain"
                  playsInline
                />
              ) : (
                <div className="flex flex-col items-center gap-3 px-4 text-center">
                  <audio
                    ref={playback.mediaRef as React.RefObject<HTMLAudioElement>}
                    src={mediaSrc}
                    className="hidden"
                  />
                  <p className="text-xs text-[var(--ink-tertiary)]">הקלטה</p>
                  <p className="line-clamp-3 text-sm text-[var(--ink-secondary)]">
                    {activeLabel?.text}
                  </p>
                </div>
              )
            ) : (
              <div className="px-4 text-center">
                <p className="font-brand text-2xl text-[var(--ink-tertiary)]">
                  STAZ
                </p>
                <p className="mt-2 text-xs text-[var(--ink-tertiary)]">
                  {demo ? "דמו ללא מדיה — לחצו ↗ לניווט בתמלול" : "אין מדיה מצורפת"}
                </p>
                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-[var(--ink-secondary)]">
                  {activeLabel?.text}
                </p>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            {mediaSrc && (
              <button
                type="button"
                onClick={() => void playback.togglePlay()}
                className="lat-btn-primary !min-h-10 !w-10 !px-0"
                aria-label={playback.isPlaying ? "השהה" : "נגן"}
              >
                {playback.isPlaying ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="size-4" />
                )}
              </button>
            )}
            {mediaSrc ? (
              <input
                type="range"
                min={0}
                max={Math.max(playback.duration || 1, 1)}
                step={0.1}
                value={currentSeconds}
                onChange={(e) => seekTo(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer accent-[var(--accent)]"
              />
            ) : (
              <p className="text-[11px] text-[var(--ink-tertiary)]">
                {demo
                  ? "קפיצה בדמו היא לתמלול בלבד — לא להקלטה."
                  : "אין הקלטה מצורפת לפגישה זו."}
              </p>
            )}
          </div>
        </section>

        {/* Transcript */}
        <section
          className={cn(
            "flex min-h-0 flex-col border-[var(--line-subtle)] bg-[var(--bg-canvas)] lg:border-e",
            mobileTab !== "transcript" && "max-lg:hidden",
          )}
        >
          <TranscriptTimeline
            entries={result.transcript}
            currentSeconds={currentSeconds}
            onSeek={seekTo}
            highlightTimestamp={highlightTs}
            ahaTargetTimestamp={DEMO_AHA_TIMESTAMP}
            ahaHighlight={ahaPulse}
          />
        </section>

        {/* AI rail — always mounted desktop; mobile for summary+ask */}
        <section
          className={cn(
            "flex min-h-0 flex-col bg-[var(--bg-elevated)]",
            mobileTab === "transcript" && "max-lg:hidden",
          )}
        >
          <AiAssistantRail
            result={result}
            onSeek={seekTimestamp}
            defaultSection={mobileTab === "ask" ? "chat" : "brief"}
            className="h-full rounded-none border-0 shadow-none"
          />
        </section>
      </div>

      {shareOpen && (
        <ShareSheet result={result} onClose={() => setShareOpen(false)} />
      )}

      {ahaOpen && (
        <AhaOnboarding
          targetTimestamp={DEMO_AHA_TIMESTAMP}
          onJump={completeAhaJump}
        />
      )}
    </div>
  );
}
