import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  FileAudio,
  Globe,
  Heart,
  ListOrdered,
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
};

export function getFeatureGateMeta(
  feature: FeatureKey,
): FeatureGateMeta | undefined {
  return PRO_FEATURE_GATE[feature];
}
