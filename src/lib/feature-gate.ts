import type { LucideIcon } from "lucide-react";
import {
  Blocks,
  BookOpen,
  FileAudio,
  FileStack,
  Globe,
  Heart,
  Link2,
  ListOrdered,
  Mail,
  MessageSquareQuote,
  ShieldAlert,
  Webhook,
  Zap,
} from "lucide-react";
import type { FeatureKey } from "./plan-features";
import type { Translations } from "./i18n/translations";

export interface FeatureGateMeta {
  icon: LucideIcon;
  titleKey: keyof Translations;
  line1Key: keyof Translations;
  line2Key: keyof Translations;
}

export const PRO_FEATURE_GATE: Partial<Record<FeatureKey, FeatureGateMeta>> = {
  languageSelect: {
    icon: Globe,
    titleKey: "gateLanguageTitle",
    line1Key: "gateLanguageLine1",
    line2Key: "gateLanguageLine2",
  },
  largeFiles: {
    icon: FileAudio,
    titleKey: "gateLargeFilesTitle",
    line1Key: "gateLargeFilesLine1",
    line2Key: "gateLargeFilesLine2",
  },
  sentimentAnalysis: {
    icon: Heart,
    titleKey: "gateSentimentTitle",
    line1Key: "gateSentimentLine1",
    line2Key: "gateSentimentLine2",
  },
  meetingChapters: {
    icon: BookOpen,
    titleKey: "gateChaptersTitle",
    line1Key: "gateChaptersLine1",
    line2Key: "gateChaptersLine2",
  },
  actionPriorities: {
    icon: ListOrdered,
    titleKey: "gatePrioritiesTitle",
    line1Key: "gatePrioritiesLine1",
    line2Key: "gatePrioritiesLine2",
  },
  keyQuotes: {
    icon: MessageSquareQuote,
    titleKey: "gateQuotesTitle",
    line1Key: "gateQuotesLine1",
    line2Key: "gateQuotesLine2",
  },
  risksBlockers: {
    icon: ShieldAlert,
    titleKey: "gateRisksTitle",
    line1Key: "gateRisksLine1",
    line2Key: "gateRisksLine2",
  },
  followUpEmail: {
    icon: Mail,
    titleKey: "gateEmailTitle",
    line1Key: "gateEmailLine1",
    line2Key: "gateEmailLine2",
  },
  priorityProcessing: {
    icon: Zap,
    titleKey: "gatePriorityProcTitle",
    line1Key: "gatePriorityProcLine1",
    line2Key: "gatePriorityProcLine2",
  },
  integrationsPush: {
    icon: Blocks,
    titleKey: "gateIntegrationsTitle",
    line1Key: "gateIntegrationsLine1",
    line2Key: "gateIntegrationsLine2",
  },
  transcriptionWebhooks: {
    icon: Webhook,
    titleKey: "gateWebhooksTitle",
    line1Key: "gateWebhooksLine1",
    line2Key: "gateWebhooksLine2",
  },
  sharedLinks: {
    icon: Link2,
    titleKey: "gateShareTitle",
    line1Key: "gateShareLine1",
    line2Key: "gateShareLine2",
  },
  summaryTemplates: {
    icon: FileStack,
    titleKey: "gateSummaryTemplatesTitle",
    line1Key: "gateSummaryTemplatesLine1",
    line2Key: "gateSummaryTemplatesLine2",
  },
};

export function getFeatureGateMeta(
  feature: FeatureKey,
): FeatureGateMeta | undefined {
  return PRO_FEATURE_GATE[feature];
}
