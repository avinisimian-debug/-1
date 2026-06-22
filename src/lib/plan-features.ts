import type { PlanTier } from "./constants";

export type FeatureKey =
  | "executiveSummary"
  | "smartDecisions"
  | "topicTags"
  | "transcriptSearch"
  | "copyToClipboard"
  | "pdfExport"
  | "txtExport"
  | "history"
  | "actionItems"
  | "sentimentAnalysis"
  | "meetingChapters"
  | "actionPriorities"
  | "keyQuotes"
  | "risksBlockers"
  | "followUpEmail"
  | "largeFiles"
  | "languageSelect"
  | "priorityProcessing";

export const PLAN_FEATURE_ACCESS: Record<FeatureKey, PlanTier | "both"> = {
  executiveSummary: "both",
  smartDecisions: "both",
  topicTags: "both",
  actionItems: "both",
  transcriptSearch: "both",
  copyToClipboard: "both",
  pdfExport: "both",
  txtExport: "both",
  history: "both",
  sentimentAnalysis: "pro",
  meetingChapters: "pro",
  actionPriorities: "pro",
  keyQuotes: "pro",
  risksBlockers: "pro",
  followUpEmail: "pro",
  largeFiles: "pro",
  languageSelect: "pro",
  priorityProcessing: "pro",
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
