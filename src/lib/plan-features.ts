import type { PlanTier } from "./constants";

export type FeatureKey =
  | "transcriptSearch"
  | "copyToClipboard"
  | "pdfExport"
  | "txtExport"
  | "history"
  | "sentimentAnalysis"
  | "meetingChapters"
  | "actionPriorities"
  | "largeFiles"
  | "languageSelect";

export const PLAN_FEATURE_ACCESS: Record<FeatureKey, PlanTier | "both"> = {
  transcriptSearch: "both",
  copyToClipboard: "both",
  pdfExport: "both",
  txtExport: "both",
  history: "both",
  sentimentAnalysis: "pro",
  meetingChapters: "pro",
  actionPriorities: "pro",
  largeFiles: "pro",
  languageSelect: "pro",
};

export function hasFeature(plan: PlanTier, feature: FeatureKey): boolean {
  const access = PLAN_FEATURE_ACCESS[feature];
  if (access === "both") return true;
  return plan === "pro";
}

export const HISTORY_LIMITS: Record<PlanTier, number> = {
  free: 5,
  pro: 50,
};
