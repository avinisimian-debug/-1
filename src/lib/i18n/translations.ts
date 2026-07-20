export type Locale = "en" | "he" | "ar" | "es" | "fr" | "ru";

export const LOCALES: Locale[] = ["en", "he", "ar", "es", "fr", "ru"];

export const RTL_LOCALES: Locale[] = ["he", "ar"];

export interface Translations {
  // Auth
  authTagline: string;
  authTitle: string;
  authTitleAccent: string;
  authSubtitle: string;
  authName: string;
  authEmail: string;
  authSubmit: string;
  authGoogle: string;
  authGoogleHint: string;
  authEmailOr: string;
  authEmailSubmit: string;
  authCardTitle: string;
  authCardSubtitle: string;
  authFreeBadge: string;
  authBenefit1: string;
  authBenefit2: string;
  authBenefit3: string;
  authHowTitle: string;
  authHowStep1Title: string;
  authHowStep1Desc: string;
  authHowStep2Title: string;
  authHowStep2Desc: string;
  authHowStep3Title: string;
  authHowStep3Desc: string;
  authLiveLabel: string;
  authLiveToday: string;
  authLiveTodayLabel: string;
  authLiveUsers: string;
  authLiveUsersLabel: string;
  authDemoEyebrow: string;
  authDemoTitle: string;
  authDemoSubtitle: string;
  authDemoPlay: string;
  authDemoDuration: string;
  authDemoProcessing: string;
  authDemoReady: string;
  authUpdates: string;
  authSocialProof: string;
  authFeature1: string;
  authFeature2: string;
  authFeature3: string;
  authStat1: string;
  authStat2: string;
  authStat3: string;
  landingHeroUpload: string;
  landingHeroUploadHint: string;
  landingWhyTitle: string;
  landingBenefit1Title: string;
  landingBenefit1Desc: string;
  landingBenefit2Title: string;
  landingBenefit2Desc: string;
  landingBenefit3Title: string;
  landingBenefit3Desc: string;
  landingPricingTitle: string;
  landingPricingFreeTitle: string;
  landingPricingProTitle: string;
  landingPricingFree1: string;
  landingPricingFree2: string;
  landingPricingPro1: string;
  landingPricingPro2: string;
  landingPricingPro3: string;
  landingPricingEnterprise: string;
  authErrorName: string;
  authErrorEmail: string;
  authErrorSignIn: string;
  authGoogleUnavailable: string;
  authLoading: string;
  // Nav
  navDashboard: string;
  navHistory: string;
  navSettings: string;
  navSignOut: string;
  navUsers: string;
  // Dashboard
  dashTitle: string;
  dashDesc: string;
  dashHero: string;
  dashHeroDesc: string;
  dashNewTranscription: string;
  dashProTip: string;
  dashProTipDesc: string;
  dashSessions: string;
  dashHoursSaved: string;
  dashInsights: string;
  testimonialsTag: string;
  testimonialsTitle: string;
  dashUsageLimit: string;
  dashUsageRemaining: string;
  langAuto: string;
  langHe: string;
  langEn: string;
  langAr: string;
  langEs: string;
  langFr: string;
  langRu: string;
  // Upload
  uploadDrop: string;
  uploadBrowse: string;
  uploadRecordMic: string;
  uploadStopRec: string;
  uploadPasteLink: string;
  uploadLinkPlaceholder: string;
  uploadLinkSubmit: string;
  uploadLinkSoonTitle: string;
  uploadLinkSoonDesc: string;
  uploadMicDenied: string;
  commandPaletteTitle: string;
  commandPalettePlaceholder: string;
  commandPaletteEmpty: string;
  commandPaletteHint: string;
  inspectorQuota: string;
  inspectorPlan: string;
  inspectorRecent: string;
  inspectorEmpty: string;
  uploadMax: string;
  uploadFileSizeNote: string;
  uploadDurationNote: string;
  uploadUpgrade: string;
  uploadUpgradeLink: string;
  uploadErrorType: string;
  uploadErrorSize: string;
  uploadErrorSizePro: string;
  // Processing
  procWait: string;
  procUploading: string;
  procTranscribing: string;
  procAnalyzing: string;
  // Results
  resComplete: string;
  resProcessed: string;
  resDownloadTranscript: string;
  resFullReport: string;
  resDownload: string;
  resDownloadFormat: string;
  downloadFormatPdf: string;
  downloadFormatDocx: string;
  downloadFormatFullTxt: string;
  downloadFormatTranscriptTxt: string;
  downloadFormatSrt: string;
  downloadFormatVtt: string;
  resGeneratingDownload: string;
  resNewUpload: string;
  resSummary: string;
  resActions: string;
  resTranscript: string;
  resExecutive: string;
  resTakeaways: string;
  resCompleted: string;
  resDownloadTxt: string;
  resDownloadPdf: string;
  resGeneratingPdf: string;
  resOverview: string;
  resChapters: string;
  resInsights: string;
  resAiInsights: string;
  resHeadline: string;
  resTopics: string;
  resDecisions: string;
  resKeyQuotes: string;
  resRisks: string;
  resFollowUpEmail: string;
  resCopyEmail: string;
  resSentiment: string;
  resCopySummary: string;
  resCopied: string;
  resMarkdownBrief: string;
  resSearchTranscript: string;
  resNoResults: string;
  resPriorityHigh: string;
  resPriorityMedium: string;
  resPriorityLow: string;
  pdfBrand: string;
  pdfTagline: string;
  pdfDurationLabel: string;
  pdfProcessedLabel: string;
  pdfOwner: string;
  pdfDeadline: string;
  pdfPending: string;
  pdfGeneratedBy: string;
  planFree: string;
  planPro: string;
  planUpgrade: string;
  planProActive: string;
  planUsed: string;
  featColumnFeature: string;
  featExecutiveSummary: string;
  featSmartDecisions: string;
  featTopicTags: string;
  featActionItems: string;
  featTranscriptSearch: string;
  featCopyClipboard: string;
  featPdfExport: string;
  featTxtExport: string;
  featHistory: string;
  featLargeFiles: string;
  featLanguageSelect: string;
  featSentiment: string;
  featChapters: string;
  featPriorities: string;
  featKeyQuotes: string;
  featRisksBlockers: string;
  featFollowUpEmail: string;
  featPriorityProcessing: string;
  featIntegrationsPush: string;
  featTranscriptionWebhooks: string;
  featSharedLinks: string;
  featSmartSearch: string;
  featSummaryTemplates: string;
  featSpeakerDiarization: string;
  // Settings
  settingsTitle: string;
  settingsDesc: string;
  settingsPlan: string;
  settingsProfile: string;
  settingsNotifications: string;
  settingsBilling: string;
  settingsSecurity: string;
  settingsProActive: string;
  settingsNameLabel: string;
  settingsEmailLabel: string;
  settingsNotificationsBody: string;
  settingsBasicPlan: string;
  settingsProPlanLine: string;
  settingsManagePayPal: string;
  settingsProBillingScheduled: string;
  settingsProLifetime: string;
  billingSetupRequiredTitle: string;
  billingSetupRequiredDesc: string;
  paypalCancelled: string;
  pricingProLaunchNote: string;
  // History
  historyTitle: string;
  historyDesc: string;
  historySearch: string;
  historyRecordings: string;
  historyEmpty: string;
  historyView: string;
  historyDelete: string;
  historyLimitNote: string;
  // Misc
  searchPlaceholder: string;
  studioGrade: string;
  tryAgain: string;
  transcriptionFailed: string;
  transcriptionFailedSubtitle: string;
  transcriptionErrorGeneric: string;
  transcriptionErrorNetwork: string;
  transcriptionErrorTimeout: string;
  transcriptionErrorEmpty: string;
  transcriptionErrorVideo: string;
  transcriptionErrorSize: string;
  transcriptionErrorSizeFree: string;
  transcriptionErrorSizePro: string;
  transcriptionErrorLimit: string;
  transcriptionErrorAuth: string;
  transcriptionErrorConfigOpenai: string;
  transcriptionErrorConfigBlob: string;
  transcriptionErrorProTitle: string;
  transcriptionErrorProDesc: string;
  transcriptionErrorProCta: string;
  transcriptionErrorTipsTitle: string;
  transcriptionErrorTip1: string;
  transcriptionErrorTip2: string;
  langLabel: string;
  themeLabel: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  errorBoundaryTitle: string;
  errorBoundaryMessage: string;
  errorBoundaryRetry: string;
  // Admin
  adminTitle: string;
  adminDesc: string;
  adminTotal: string;
  adminName: string;
  adminEmail: string;
  adminProvider: string;
  adminRegistered: string;
  adminLastLogin: string;
  adminPlan: string;
  adminProCount: string;
  adminCopyEmails: string;
  adminExportCsv: string;
  adminMailAll: string;
  adminRefresh: string;
  adminFilterAll: string;
  adminFilterPro: string;
  adminFilterFree: string;
  adminNoAccess: string;
  adminEmpty: string;
  adminEmailsCopied: string;
  // PayPal
  paypalTitle: string;
  paypalDesc: string;
  paypalPay: string;
  paypalSuccess: string;
  paypalProcessing: string;
  paypalError: string;
  paypalNotConfigured: string;
  paypalSandboxNote: string;
  paypalSubscribeTitle: string;
  paypalSubscribeDesc: string;
  paypalAutoBillingNote: string;
  paypalPreapprovalError: string;
  paypalOnlyNote: string;
  paypalBuyerTip: string;
  paypalRedirectCta: string;
  paypalLifetimeNote: string;
  proLifetimeOnce: string;
  proLifetimeBadge: string;
  proLifetimePricingNote: string;
  // Integrations bridge
  integTitle: string;
  integSubtitle: string;
  integLoading: string;
  integConnected: string;
  integComingSoon: string;
  integComingSoonDetail: string;
  integSave: string;
  integSaveSuccess: string;
  integSaveFailed: string;
  integLoadFailed: string;
  integPayloadNote: string;
  integEmptyTitle: string;
  integEmptyDesc: string;
  integEmptyStat: string;
  integEmptyCta: string;
  integWebhookName: string;
  integWebhookDesc: string;
  integSlackName: string;
  integSlackDesc: string;
  integNotionName: string;
  integNotionDesc: string;
  integZapierName: string;
  integZapierDesc: string;
  integWebhookUrlLabel: string;
  integWebhookUrlHint: string;
  integWebhookUrlRequired: string;
  integWebhookSecretLabel: string;
  integWebhookSecretHint: string;
  integWebhookSecretPlaceholder: string;
  integWebhookEnabled: string;
  integPushCta: string;
  integPushSuccess: string;
  integPushFailed: string;
  settingsIntegrations: string;
  // Smart search
  searchSmartPlaceholder: string;
  searchNoHits: string;
  searchFieldFileName: string;
  searchFieldHeadline: string;
  searchFieldSummary: string;
  searchFieldTranscript: string;
  searchFieldActions: string;
  searchFieldTopics: string;
  // Sharing
  shareTitle: string;
  shareDesc: string;
  sharePrivate: string;
  sharePublicLink: string;
  shareCopyLink: string;
  gateIntegrationsTitle: string;
  gateIntegrationsLine1: string;
  gateIntegrationsLine2: string;
  gateWebhooksTitle: string;
  gateWebhooksLine1: string;
  gateWebhooksLine2: string;
  webhooksPageTitle: string;
  webhooksPageDesc: string;
  webhooksBackToSettings: string;
  webhooksSectionTitle: string;
  webhooksSectionDesc: string;
  webhooksSettingsCardTitle: string;
  webhooksSettingsCardDesc: string;
  webhooksSettingsCardCta: string;
  webhooksUrlLabel: string;
  webhooksUrlHint: string;
  webhooksUrlRequired: string;
  webhooksUrlInvalid: string;
  webhooksSecretLabel: string;
  webhooksSecretHint: string;
  webhooksSecretPlaceholder: string;
  webhooksEnabled: string;
  webhooksActiveLabel: string;
  webhooksSave: string;
  webhooksSaved: string;
  webhooksTest: string;
  webhooksTestSent: string;
  webhooksSaveSuccess: string;
  webhooksSaveFailed: string;
  webhooksLoadFailed: string;
  webhooksLoading: string;
  webhooksTestSuccess: string;
  webhooksTestFailed: string;
  webhooksPayloadNote: string;
  webhooksLockedTitle: string;
  webhooksLockedDesc: string;
  webhooksLockedCta: string;
  webhooksLockedBadge: string;
  webhooksLockedFeature1: string;
  webhooksLockedFeature2: string;
  webhooksLockedFeature3: string;
  gateShareTitle: string;
  gateShareLine1: string;
  gateShareLine2: string;
  // Meeting workspace
  workspaceValueEyebrow: string;
  workspaceValueTitle: string;
  workspaceMeetingDuration: string;
  workspaceChapters: string;
  workspaceTranscript: string;
  workspaceRenameSpeakers: string;
  workspaceSpeakerRenamePlaceholder: string;
  workspaceRenameSpeakerAction: string;
  workspaceDiarizationBadge: string;
  workspacePlay: string;
  workspacePause: string;
  workspaceNoAudio: string;
  workspaceCopyTranscript: string;
  workspaceInteractivePlayer: string;
  workspaceEditableHint: string;
  workspaceSaveTranscript: string;
  workspaceTranscriptSaved: string;
  workspaceTranscriptSaving: string;
  workspaceTranscriptUnsaved: string;
  workspaceAudioMode: string;
  workspaceSeek: string;
  aiInsightsLoading: string;
  aiInsightsLoadingHint: string;
  aiInsightsError: string;
  aiInsightsRegenerate: string;
  aiInsightsCopyAll: string;
  aiInsightsExecutive: string;
  aiInsightsActions: string;
  aiInsightsTopics: string;
  aiInsightsPoweredBy: string;
  aiInsightsNoActions: string;
  aiInsightsNoTopics: string;
  gateSummaryTemplatesTitle: string;
  gateSummaryTemplatesLine1: string;
  gateSummaryTemplatesLine2: string;
  summaryModeTitle: string;
  summaryModeHint: string;
  summaryPreviewTitle: string;
  summaryPreviewLoading: string;
  summaryPreviewEmpty: string;
  summaryFromCache: string;
  trialTitle: string;
  trialDesc: string;
  // Sale / launch week
  saleBadge: string;
  saleTitle: string;
  saleFirstMonth: string;
  saleFreeWeek: string;
  salePricingNote: string;
  saleEndsIn: string;
  saleDays: string;
  saleHours: string;
  saleMinutes: string;
  saleSeconds: string;
  // Pricing table
  pricingTitle: string;
  pricingSubtitle: string;
  pricingMonthly: string;
  pricingYearly: string;
  pricingYearlySave: string;
  pricingMostPopular: string;
  pricingCurrentPlan: string;
  pricingPerMonthEquiv: string;
  pricingSavePercent: string;
  pricingBasicName: string;
  pricingBasicDesc: string;
  pricingBasicOutcome1: string;
  pricingBasicOutcome2: string;
  pricingBasicOutcome3: string;
  pricingBasicCta: string;
  pricingProName: string;
  pricingProDesc: string;
  pricingProOutcome1: string;
  pricingProOutcome2: string;
  pricingProOutcome3: string;
  pricingProCta: string;
  pricingEnterpriseName: string;
  pricingEnterpriseDesc: string;
  pricingEnterpriseOutcome1: string;
  pricingEnterpriseOutcome2: string;
  pricingEnterpriseOutcome3: string;
  pricingEnterpriseCta: string;
  // Onboarding
  onboardTag: string;
  onboardTitle: string;
  onboardSubtitle: string;
  onboardProgress: string;
  onboardDismiss: string;
  onboardExpand: string;
  onboardHide: string;
  onboardComplete: string;
  onboardCompleteDesc: string;
  onboardStep1Title: string;
  onboardStep1Desc: string;
  onboardStep1Outcome: string;
  onboardStep1Cta: string;
  onboardStep2Title: string;
  onboardStep2Desc: string;
  onboardStep2Outcome: string;
  onboardStep2Cta: string;
  onboardStep3Title: string;
  onboardStep3Desc: string;
  onboardStep3Outcome: string;
  onboardStep3Cta: string;
  onboardStep3Waiting: string;
  // Feature gate
  gateEyebrow: string;
  gateStartTrial: string;
  gateNotNow: string;
  gatePriceHint: string;
  gateLanguageTitle: string;
  gateLanguageLine1: string;
  gateLanguageLine2: string;
  gateLargeFilesTitle: string;
  gateLargeFilesLine1: string;
  gateLargeFilesLine2: string;
  gateSentimentTitle: string;
  gateSentimentLine1: string;
  gateSentimentLine2: string;
  gateChaptersTitle: string;
  gateChaptersLine1: string;
  gateChaptersLine2: string;
  gatePrioritiesTitle: string;
  gatePrioritiesLine1: string;
  gatePrioritiesLine2: string;
  gatePrioritiesTeaser: string;
  gateInsightsTeaser: string;
  gateQuotesTitle: string;
  gateQuotesLine1: string;
  gateQuotesLine2: string;
  gateRisksTitle: string;
  gateRisksLine1: string;
  gateRisksLine2: string;
  gateEmailTitle: string;
  gateEmailLine1: string;
  gateEmailLine2: string;
  gatePriorityProcTitle: string;
  gatePriorityProcLine1: string;
  gatePriorityProcLine2: string;
  gateSentimentTeaser: string;
  // Trust & live activity
  trustUsedBy: string;
  trustTeamsCount: string;
  liveActivityLabel: string;
  liveActivityDismiss: string;
  liveActivityJustNow: string;
  liveActivityMinutesAgo: string;
  liveActivitySignup: string;
  liveActivityTranscription: string;
  liveActivityUpgrade: string;
  liveActivityExport: string;
}

const en: Translations = {
  authTagline: "Studio-Grade AI",
  authTitle: "Turn meetings into assets.",
  authTitleAccent: "Accurate AI transcription & summary in 5 minutes.",
  authSubtitle:
    "Stop manual note-taking and endless follow-ups. Let AI extract action items, decisions, and key insights from every conversation — automatically.",
  authName: "Your name",
  authEmail: "Email address",
  authSubmit: "Get started free",
  authGoogle: "Continue with Google",
  authGoogleHint: "Quick sign-in with your Google account",
  authEmailOr: "or",
  authEmailSubmit: "Continue with email",
  authCardTitle: "Get started free",
  authCardSubtitle: "Create your free account in 30 seconds — name and email only.",
  authFreeBadge: "No credit card required",
  authBenefit1: "10 free transcriptions every month",
  authBenefit2: "PDF reports & action items included",
  authBenefit3: "Hebrew, English & 5+ languages",
  authHowTitle: "How it works",
  authHowStep1Title: "Upload",
  authHowStep1Desc: "Drop a meeting recording or interview",
  authHowStep2Title: "AI analyzes",
  authHowStep2Desc: "Transcript, summary & tasks in minutes",
  authHowStep3Title: "Share & act",
  authHowStep3Desc: "Export PDF or copy the executive summary",
  authLiveLabel: "Live",
  authLiveToday: "{n} transcriptions today",
  authLiveTodayLabel: "transcriptions today",
  authLiveUsers: "{n}+ users joined",
  authLiveUsersLabel: "users joined",
  authDemoEyebrow: "Product demo",
  authDemoTitle: "See Staz AI in action",
  authDemoSubtitle:
    "Watch how a meeting recording becomes a transcript, executive summary, and action items in under a minute.",
  authDemoPlay: "Play interactive demo",
  authDemoDuration: "~30 seconds",
  authDemoProcessing: "AI is processing your meeting...",
  authDemoReady: "Your report is ready",
  authUpdates: "We'll send product updates & tips only. Unsubscribe anytime.",
  authSocialProof: "Trusted by creators, teams & studios worldwide",
  authFeature1: "AI transcription in seconds",
  authFeature2: "Executive summaries & action items",
  authFeature3: "Long files up to 3+ hours",
  authStat1: "50K+ sessions",
  authStat2: "98% accuracy",
  authStat3: "4.9★ rating",
  landingHeroUpload: "Drag a meeting recording here (or click to choose)",
  landingHeroUploadHint: "Works with Zoom, Teams, Google Meet, and more.",
  landingWhyTitle: "Why teams switch to us",
  landingBenefit1Title: "Smart decisions, instantly",
  landingBenefit1Desc:
    "AI extracts key decisions, topics, and executive summaries from every recording — automatically.",
  landingBenefit2Title: "Pro-grade intelligence",
  landingBenefit2Desc:
    "Unlock sentiment, chapters, quotes, risks, and ready-to-send follow-up emails with Pro.",
  landingBenefit3Title: "From meeting to action",
  landingBenefit3Desc:
    "Action items with owners, priorities, and PDF exports — ready to share in minutes.",
  landingPricingTitle: "Simple plans, no surprises",
  landingPricingFreeTitle: "Free (to try)",
  landingPricingProTitle: "Pro (for teams)",
  landingPricingFree1: "10 transcriptions per month",
  landingPricingFree2: "Studio-quality transcription & summary",
  landingPricingPro1: "Files up to 500 MB · 3+ hours",
  landingPricingPro2: "PDF reports & advanced AI insights",
  landingPricingPro3: "Priority processing & language control",
  landingPricingEnterprise:
    "Need very large files or a custom rollout? Talk to us about Enterprise.",
  authErrorName: "Please enter your name",
  authErrorEmail: "Please enter a valid email",
  authErrorSignIn: "Sign-in failed. Please try again.",
  authGoogleUnavailable:
    "Google sign-in is not configured. Use email or contact support.",
  authLoading: "Signing in...",
  navDashboard: "Dashboard",
  navHistory: "History",
  navSettings: "Settings",
  navSignOut: "Sign out",
  navUsers: "Registered Users",
  dashTitle: "Dashboard",
  dashDesc: "Professional transcription for your daily workflow",
  dashHero: "Your production desk",
  dashHeroDesc:
    "Upload meetings, interviews, or long-form video. Get studio-quality transcripts, executive summaries, and action items.",
  dashNewTranscription: "New Transcription",
  dashProTip: "Pro tip",
  dashProTipDesc:
    "Clear audio yields the best results. Pro users can upload videos up to 500 MB — we automatically optimize them for AI.",
  dashSessions: "Sessions",
  dashHoursSaved: "Hours Saved",
  dashInsights: "Insights",
  testimonialsTag: "Trusted by professionals",
  testimonialsTitle: "What our users say",
  dashUsageLimit: "Monthly limit reached.",
  dashUsageRemaining: "Transcriptions remaining",
  langAuto: "Auto-detect",
  langHe: "Hebrew",
  langEn: "English",
  langAr: "Arabic",
  langEs: "Spanish",
  langFr: "French",
  langRu: "Russian",
  uploadDrop: "Drop your recording here",
  uploadBrowse: "Studio-quality transcription · drag & drop or browse",
  uploadRecordMic: "Record microphone",
  uploadStopRec: "Stop recording",
  uploadPasteLink: "Paste web link",
  uploadLinkPlaceholder: "YouTube, Drive, Dropbox, or Zoom URL…",
  uploadLinkSubmit: "Import",
  uploadLinkSoonTitle: "Link import coming soon",
  uploadLinkSoonDesc:
    "YouTube, Drive, and Zoom cloud imports are on the roadmap. Upload a file for now.",
  uploadMicDenied: "Microphone access was denied. Check browser permissions.",
  commandPaletteTitle: "Search workspace",
  commandPalettePlaceholder: "Search transcripts, speakers, action items…",
  commandPaletteEmpty: "No matches in your history.",
  commandPaletteHint: "⌘K",
  inspectorQuota: "Usage this month",
  inspectorPlan: "Current plan",
  inspectorRecent: "Recent",
  inspectorEmpty: "No transcripts yet. Upload your first recording.",
  uploadMax: "Max",
  uploadFileSizeNote: "Up to {size} per file",
  uploadDurationNote: "Up to {duration} per recording · {plan}",
  uploadUpgrade: "for 500 MB & 3+ hour videos",
  uploadUpgradeLink: "Upgrade to Pro",
  uploadErrorType: "Please upload an MP3, WAV, MP4, or M4A file.",
  uploadErrorSize: "File exceeds the free tier limit. Upgrade to Pro for files up to 500 MB.",
  uploadErrorSizePro: "File exceeds the limit.",
  procWait: "Processing your recording — longer files may take a few minutes.",
  procUploading: "Uploading...",
  procTranscribing: "Transcribing audio using AI...",
  procAnalyzing: "Analyzing key insights...",
  resComplete: "Transcription Complete",
  resProcessed: "Processed",
  resDownloadTranscript: "Download Transcript",
  resFullReport: "PDF Report",
  resDownload: "Download",
  resDownloadFormat: "File format",
  downloadFormatPdf: "PDF Report — styled & complete",
  downloadFormatDocx: "Word document (.docx)",
  downloadFormatFullTxt: "Full report (.txt)",
  downloadFormatTranscriptTxt: "Transcript only (.txt)",
  downloadFormatSrt: "Subtitles (.srt)",
  downloadFormatVtt: "WebVTT subtitles (.vtt)",
  resGeneratingDownload: "Preparing download...",
  resNewUpload: "New Upload",
  resSummary: "Summary",
  resActions: "Action Items",
  resTranscript: "Full Transcript",
  resExecutive: "Executive Summary",
  resTakeaways: "Key Takeaways",
  resCompleted: "completed",
  resDownloadTxt: "Download .txt",
  resDownloadPdf: "Download PDF Report",
  resGeneratingPdf: "Generating PDF...",
  resOverview: "Executive Overview",
  resChapters: "Chapters",
  resInsights: "Advanced Insights",
  resAiInsights: "AI Insights",
  resHeadline: "Meeting headline",
  resTopics: "Topics",
  resDecisions: "Key decisions",
  resKeyQuotes: "Key quotes",
  resRisks: "Risks & blockers",
  resFollowUpEmail: "Follow-up email",
  resCopyEmail: "Copy email",
  resSentiment: "Meeting Tone",
  resCopySummary: "Copy summary",
  resCopied: "Copied!",
  resMarkdownBrief: "Professional brief (Markdown)",
  resSearchTranscript: "Search transcript...",
  resNoResults: "No matching lines found.",
  resPriorityHigh: "High",
  resPriorityMedium: "Medium",
  resPriorityLow: "Low",
  pdfBrand: "Meeting Intelligence Report",
  pdfTagline: "Studio-grade AI transcription & analysis",
  pdfDurationLabel: "Duration",
  pdfProcessedLabel: "Processed",
  pdfOwner: "Owner",
  pdfDeadline: "Deadline",
  pdfPending: "Pending",
  pdfGeneratedBy: "Generated by Staz AI",
  planFree: "Free Plan",
  planPro: "Pro Plan",
  planUpgrade: "Upgrade to Pro",
  planProActive: "Pro active — upload videos up to 500 MB",
  planUsed: "used this month",
  featColumnFeature: "Feature",
  featExecutiveSummary: "AI executive summary",
  featSmartDecisions: "Key decisions extraction",
  featTopicTags: "Auto topic tagging",
  featActionItems: "Action items & owners",
  featTranscriptSearch: "Transcript search",
  featCopyClipboard: "Copy to clipboard",
  featPdfExport: "PDF report export",
  featTxtExport: "Text export",
  featHistory: "Saved history (5 / 50)",
  featLargeFiles: "Large files (500 MB)",
  featLanguageSelect: "Language selection",
  featSentiment: "Sentiment analysis",
  featChapters: "Meeting chapters",
  featPriorities: "Action item priorities",
  featKeyQuotes: "Key quotes highlights",
  featRisksBlockers: "Risks & blockers",
  featFollowUpEmail: "Follow-up email draft",
  featPriorityProcessing: "Priority processing",
  featIntegrationsPush: "Integration bridge (webhook)",
  featTranscriptionWebhooks: "Completion webhooks (automation)",
  featSharedLinks: "Shareable read-only links",
  featSmartSearch: "Smart history search",
  featSummaryTemplates: "Summary templates (Manager / Student / Technical)",
  featSpeakerDiarization: "Speaker diarization (Speaker 1, 2, …)",
  settingsTitle: "Settings",
  settingsDesc: "Manage your account, plan, and preferences",
  settingsPlan: "Your Plan",
  settingsProfile: "Profile",
  settingsNotifications: "Notifications",
  settingsBilling: "Billing",
  settingsSecurity: "Security",
  settingsProActive: "Pro active — upload videos up to 500 MB",
  settingsNameLabel: "Name",
  settingsEmailLabel: "Email",
  settingsNotificationsBody: "Product updates enabled for {email}",
  settingsBasicPlan: "Basic Plan — $0",
  settingsProPlanLine: "Pro Plan — {price} lifetime",
  settingsManagePayPal: "Your lifetime Pro purchase was processed via PayPal.",
  settingsProBillingScheduled:
    "Lifetime Pro active — you paid once and keep Pro forever.",
  settingsProLifetime: "Lifetime Pro — no recurring charges.",
  billingSetupRequiredTitle: "Unlock lifetime Pro",
  billingSetupRequiredDesc:
    "Pay once with PayPal below — {price} during launch week, then Pro is yours forever.",
  paypalCancelled: "PayPal subscription was cancelled.",
  pricingProLaunchNote: "Launch week — lifetime Pro for {intro} (one payment, Pro forever).",
  historyTitle: "History",
  historyDesc: "Browse your past transcriptions and summaries",
  historySearch: "Search history...",
  historyRecordings: "recordings",
  historyEmpty: "No transcriptions saved yet. Complete a transcription to see it here.",
  historyView: "View",
  historyDelete: "Delete",
  historyLimitNote: "Free saves last 5 · Pro saves last 50",
  searchPlaceholder: "Search transcripts...",
  studioGrade: "Studio Grade",
  tryAgain: "Try Again",
  transcriptionFailed: "Transcription failed",
  transcriptionFailedSubtitle: "Your file looks valid — this is usually temporary.",
  transcriptionErrorGeneric:
    "We couldn't finish processing this recording. Please try again in a moment.",
  transcriptionErrorNetwork:
    "Connection was interrupted during upload. Check your network and try again.",
  transcriptionErrorTimeout:
    "Processing took too long. Shorter clips work best on the free plan.",
  transcriptionErrorEmpty:
    "No speech was detected in this file. Try a recording with clearer audio.",
  transcriptionErrorVideo:
    "We had trouble reading the audio track in this video. Try MP3/WAV or upgrade to Pro for advanced video processing.",
  transcriptionErrorSize:
    "This file exceeds your plan limit. Pro supports uploads up to 500 MB and longer recordings.",
  transcriptionErrorSizeFree:
    "This file exceeds the free tier limit (25 MB). Upgrade to Pro for files up to 500 MB.",
  transcriptionErrorSizePro:
    "This file exceeds the 500 MB Pro limit, or the recording is too long to process. Try a shorter clip or MP3/WAV.",
  transcriptionErrorLimit:
    "You've reached your monthly transcription limit. Upgrade to Pro for more.",
  transcriptionErrorAuth: "Your session expired. Refresh the page and sign in again.",
  transcriptionErrorConfigOpenai:
    "Transcription is not configured on the server. Set a valid OPENAI_API_KEY in Vercel → Environment Variables, then redeploy.",
  transcriptionErrorConfigBlob:
    "Large uploads are not configured. In Vercel: Storage → Blob → Connect to project, then redeploy.",
  transcriptionErrorProTitle: "Pro processes longer videos reliably",
  transcriptionErrorProDesc:
    "Priority processing, 500 MB uploads, 3+ hour recordings, and advanced AI insights.",
  transcriptionErrorProCta: "Upgrade to Pro",
  transcriptionErrorTipsTitle: "Quick tips",
  transcriptionErrorTip1: "MP3 and WAV files transcribe fastest",
  transcriptionErrorTip2: "Clear speech near the microphone improves accuracy",
  langLabel: "Language",
  themeLabel: "Theme",
  themeLight: "Light",
  themeDark: "Dark",
  themeSystem: "System",
  errorBoundaryTitle: "Something went wrong",
  errorBoundaryMessage: "An unexpected error occurred. Please try again.",
  errorBoundaryRetry: "Try again",
  adminTitle: "Registered Users",
  adminDesc: "Everyone who signed up to Staz AI",
  adminTotal: "total registered",
  adminName: "Name",
  adminEmail: "Email",
  adminProvider: "Sign-in method",
  adminRegistered: "Registered",
  adminLastLogin: "Last login",
  adminPlan: "Plan",
  adminProCount: "Pro subscribers",
  adminCopyEmails: "Copy all emails",
  adminExportCsv: "Export CSV",
  adminMailAll: "Email all users",
  adminRefresh: "Refresh",
  adminFilterAll: "All",
  adminFilterPro: "Pro",
  adminFilterFree: "Free",
  adminNoAccess: "You don't have permission to view this page.",
  adminEmpty: "No users registered yet.",
  adminEmailsCopied: "Emails copied to clipboard",
  paypalTitle: "Upgrade with PayPal",
  paypalDesc:
    "PayPal only — one secure payment. Pro is yours forever — no monthly subscription.",
  paypalPay: "Pay with PayPal",
  paypalSuccess: "Pro activated for life! Enjoy unlimited access.",
  paypalProcessing: "Processing payment...",
  paypalError: "Payment failed. Please try again.",
  paypalNotConfigured: "PayPal is not configured yet. Add keys to .env.local",
  paypalSandboxNote: "PayPal only — secure one-time payment",
  paypalSubscribeTitle: "Launch week — lifetime Pro for {intro}",
  paypalSubscribeDesc:
    "One payment via PayPal. {intro} during launch week — Pro forever, no recurring charges.",
  paypalAutoBillingNote:
    "By paying you authorize a single charge of {intro}. No subscription.",
  paypalPreapprovalError:
    "PayPal could not complete the payment. Try again or contact PayPal support.",
  paypalOnlyNote:
    "No card gateway on our side — payments run entirely through PayPal.",
  paypalBuyerTip:
    "Log in with your PayPal account to approve the one-time payment.",
  paypalRedirectCta: "Continue on PayPal.com",
  paypalLifetimeNote:
    "Launch price {price} — one payment, Pro forever. Regular price {regular}.",
  proLifetimeOnce: "once",
  proLifetimeBadge: "Pay once · Pro forever",
  proLifetimePricingNote: "Single payment — no monthly subscription.",
  integTitle: "Integration Bridge",
  integSubtitle:
    "Push action items to your stack automatically — no copy-paste after every meeting.",
  integLoading: "Loading integrations…",
  integConnected: "Connected",
  integComingSoon: "Soon",
  integComingSoonDetail: "OAuth setup for this connector is coming in the next release.",
  integSave: "Save integration",
  integSaveSuccess: "Integration saved.",
  integSaveFailed: "Could not save integration.",
  integLoadFailed: "Could not load integrations.",
  integPayloadNote:
    "Webhook payloads include meeting metadata and action items as JSON (HTTPS only).",
  integEmptyTitle: "Ship action items where your team already works",
  integEmptyDesc:
    "Connect Zapier, Slack, or a custom webhook so tasks land in your tools the moment a meeting ends.",
  integEmptyStat: "Teams save ~2 hours/week on follow-up admin",
  integEmptyCta: "Unlock integrations with Pro",
  integWebhookName: "Custom webhook",
  integWebhookDesc: "POST action items to Zapier, Make, or any HTTPS endpoint.",
  integSlackName: "Slack",
  integSlackDesc: "Drop action items into a channel after each meeting.",
  integNotionName: "Notion",
  integNotionDesc: "Create a database row per meeting with tasks attached.",
  integZapierName: "Zapier",
  integZapierDesc: "Trigger 6,000+ apps from your meeting outcomes.",
  integWebhookUrlLabel: "Webhook URL",
  integWebhookUrlHint: "Must be HTTPS. Zapier and Make both provide webhook URLs.",
  integWebhookUrlRequired: "Enter a webhook URL or disable the integration.",
  integWebhookSecretLabel: "Signing secret (optional)",
  integWebhookSecretHint: "We send X-Staz-Signature: sha256=… for verification.",
  integWebhookSecretPlaceholder: "Optional HMAC secret",
  integWebhookEnabled: "Enable webhook push",
  integPushCta: "Push action items",
  integPushSuccess: "Sent!",
  integPushFailed: "Push failed",
  settingsIntegrations: "Integrations",
  searchSmartPlaceholder: "Search meetings, transcripts, and action items…",
  searchNoHits: "No matches in your history.",
  searchFieldFileName: "File",
  searchFieldHeadline: "Headline",
  searchFieldSummary: "Summary",
  searchFieldTranscript: "Transcript",
  searchFieldActions: "Actions",
  searchFieldTopics: "Topics",
  shareTitle: "Share summary",
  shareDesc: "Create a read-only link for “{title}” — no login required.",
  sharePrivate: "Private",
  sharePublicLink: "Share link",
  shareCopyLink: "Copy link",
  gateIntegrationsTitle: "Integration Bridge",
  gateIntegrationsLine1: "Auto-send action items to Slack, Notion, or Zapier.",
  gateIntegrationsLine2: "Stop re-typing tasks — keep momentum after every call.",
  gateWebhooksTitle: "Transcription webhooks",
  gateWebhooksLine1: "POST full transcripts and AI summaries to your automation stack when a job completes.",
  gateWebhooksLine2: "Available on Pro — power users only.",
  webhooksPageTitle: "Webhooks",
  webhooksPageDesc: "Automate your workflow when transcriptions complete.",
  webhooksBackToSettings: "Back to settings",
  webhooksSectionTitle: "Completion webhook",
  webhooksSectionDesc:
    "We POST to your URL when a transcription finishes. Payload includes metadata, full text, and AI summary.",
  webhooksSettingsCardTitle: "Webhooks",
  webhooksSettingsCardDesc:
    "Send transcription results to Zapier, Make, n8n, or your own API.",
  webhooksSettingsCardCta: "Configure",
  webhooksUrlLabel: "Webhook URL",
  webhooksUrlHint: "Must be HTTPS. Use Zapier, Make, or your own endpoint.",
  webhooksUrlRequired: "Enter a webhook URL or disable the webhook.",
  webhooksUrlInvalid: "URL must be a valid HTTPS address (max 2048 characters).",
  webhooksSecretLabel: "Signing secret (optional)",
  webhooksSecretHint: "We send X-Staz-Signature: sha256=… for verification.",
  webhooksSecretPlaceholder: "Optional HMAC secret",
  webhooksEnabled: "Automatically POST when a transcription completes",
  webhooksActiveLabel: "Webhook active",
  webhooksSave: "Save changes",
  webhooksSaved: "Saved!",
  webhooksTest: "Send test event",
  webhooksTestSent: "Sent!",
  webhooksSaveSuccess: "Webhook settings saved.",
  webhooksSaveFailed: "Could not save webhook settings.",
  webhooksLoadFailed: "Could not load webhook settings.",
  webhooksLoading: "Loading webhook settings…",
  webhooksTestSuccess: "Test event delivered (HTTP {status}).",
  webhooksTestFailed: "Test webhook failed.",
  webhooksPayloadNote:
    "Event: transcription.completed · Includes metadata, fullText, transcript[], summary, and actionItems[].",
  webhooksLockedTitle: "Automation webhooks",
  webhooksLockedDesc:
    "Upgrade to Pro to POST completed transcriptions to your custom HTTPS endpoint.",
  webhooksLockedCta: "Upgrade to Pro",
  webhooksLockedBadge: "Pro feature",
  webhooksLockedFeature1: "Instant POST when transcription completes",
  webhooksLockedFeature2: "Full text, AI summary, and metadata in one payload",
  webhooksLockedFeature3: "Optional HMAC signing for secure verification",
  gateShareTitle: "Shareable meeting links",
  gateShareLine1: "Send stakeholders a read-only summary link.",
  gateShareLine2: "No account required — perfect for clients and execs.",
  workspaceValueEyebrow: "Productivity ROI",
  workspaceValueTitle: "Estimated time saved in this meeting: {minutes} mins",
  workspaceMeetingDuration: "Meeting length: {duration}",
  workspaceChapters: "Chapters",
  workspaceTranscript: "Interactive transcript",
  workspaceRenameSpeakers: "Speakers",
  workspaceSpeakerRenamePlaceholder: "Name…",
  workspaceRenameSpeakerAction: "Rename {name}",
  workspaceDiarizationBadge: "Diarized",
  workspacePlay: "Play",
  workspacePause: "Pause",
  workspaceNoAudio: "Audio playback is available for new uploads in this session. History items open without the original file.",
  workspaceCopyTranscript: "Copy transcript",
  workspaceInteractivePlayer: "Sync player",
  workspaceEditableHint: "Click any line to edit — changes auto-save and apply to exports.",
  workspaceSaveTranscript: "Save changes",
  workspaceTranscriptSaved: "All changes saved",
  workspaceTranscriptSaving: "Saving…",
  workspaceTranscriptUnsaved: "Unsaved changes",
  workspaceAudioMode: "Audio recording — use the controls below to play",
  workspaceSeek: "Seek",
  aiInsightsLoading: "Generating AI insights…",
  aiInsightsLoadingHint: "GPT-4o mini is analyzing your transcript",
  aiInsightsError: "Could not generate insights",
  aiInsightsRegenerate: "Regenerate",
  aiInsightsCopyAll: "Copy all",
  aiInsightsExecutive: "Executive summary",
  aiInsightsActions: "Action items",
  aiInsightsTopics: "Main topics",
  aiInsightsPoweredBy: "Powered by GPT-4o mini",
  aiInsightsNoActions: "No action items identified.",
  aiInsightsNoTopics: "No topics identified.",
  gateSummaryTemplatesTitle: "Summary templates",
  gateSummaryTemplatesLine1: "Reframe the same meeting for managers, students, or engineers.",
  gateSummaryTemplatesLine2: "Switch modes instantly — no re-processing wait.",
  summaryModeTitle: "Summary mode",
  summaryModeHint: "Instant switch",
  summaryPreviewTitle: "Template preview",
  summaryPreviewLoading: "Preparing templates…",
  summaryPreviewEmpty: "Select a mode to preview the formatted summary.",
  summaryFromCache: "Instant",
  trialTitle: "Launch week — Pro for {intro}/month",
  trialDesc:
    "Subscribe with PayPal below. {intro}/month during launch week, then {regular}/month automatically every month.",
  saleBadge: "Launch Week",
  saleTitle: "Launch week: Pro for {intro}/mo — then {regular}/mo",
  saleFirstMonth: "Launch price {intro}/mo — then {regular}/mo",
  saleFreeWeek: "{intro} launch week",
  salePricingNote: "Subscribe now at {intro}/mo during launch week, then {regular}/mo every month.",
  saleEndsIn: "Launch offer ends in",
  saleDays: "Days",
  saleHours: "Hours",
  saleMinutes: "Min",
  saleSeconds: "Sec",
  pricingTitle: "Plans that pay for themselves",
  pricingSubtitle: "Choose the path to faster decisions — not just more features.",
  pricingMonthly: "Monthly",
  pricingYearly: "Yearly",
  pricingYearlySave: "Save {percent}% on yearly billing",
  pricingMostPopular: "Most Popular",
  pricingCurrentPlan: "Current plan",
  pricingPerMonthEquiv: "/mo billed yearly",
  pricingSavePercent: "Save {percent}%",
  pricingBasicName: "Basic",
  pricingBasicDesc: "For individuals getting started with AI transcription.",
  pricingBasicOutcome1: "AI summary, decisions & topic tags",
  pricingBasicOutcome2: "Action items with owners & deadlines",
  pricingBasicOutcome3: "10 transcriptions/month · 25 MB files",
  pricingBasicCta: "Get started free",
  pricingProName: "Pro",
  pricingProDesc: "For professionals who run on meetings and need outcomes fast.",
  pricingProOutcome1: "Sentiment, chapters & priority-ranked tasks",
  pricingProOutcome2: "Key quotes, risks & follow-up email drafts",
  pricingProOutcome3: "500 MB files · 100 transcriptions/month",
  pricingProCta: "Upgrade to Pro",
  pricingEnterpriseName: "Enterprise",
  pricingEnterpriseDesc: "For teams that need scale, control, and dedicated support.",
  pricingEnterpriseOutcome1: "Standardize insights across your entire organization",
  pricingEnterpriseOutcome2: "Onboard teams in days, not weeks",
  pricingEnterpriseOutcome3: "Dedicated support with SLA guarantees",
  pricingEnterpriseCta: "Contact sales",
  onboardTag: "Quick start",
  onboardTitle: "Let's start: your first transcript in 5 minutes",
  onboardSubtitle: "Complete these 3 steps to unlock the full power of Staz AI.",
  onboardProgress: "Setup progress",
  onboardDismiss: "I'll finish this later",
  onboardExpand: "Expand",
  onboardHide: "Hide",
  onboardComplete: "You're all set!",
  onboardCompleteDesc: "Your workspace is ready. Start turning meetings into action.",
  onboardStep1Title: "Connect your profile",
  onboardStep1Desc: "Confirm your name and email so reports are personalized.",
  onboardStep1Outcome: "Outcome: Branded summaries ready to share",
  onboardStep1Cta: "Go to profile",
  onboardStep2Title: "Create your first project",
  onboardStep2Desc: "Upload a recording to start your first AI transcription.",
  onboardStep2Outcome: "Outcome: First transcript in under 2 minutes",
  onboardStep2Cta: "Upload recording",
  onboardStep3Title: "Review your AI summary",
  onboardStep3Desc: "Open your executive summary and action items.",
  onboardStep3Outcome: "Outcome: Actionable insights without manual notes",
  onboardStep3Cta: "View summary",
  onboardStep3Waiting: "Complete your upload — your summary appears here automatically.",
  gateEyebrow: "Upgrade to unlock",
  gateStartTrial: "Start Pro free",
  gateNotNow: "Not now",
  gatePriceHint: "Pro from {price}/mo · cancel anytime",
  gateLanguageTitle: "Transcribe in any language",
  gateLanguageLine1: "Choose Hebrew, English, Arabic, and more before you upload.",
  gateLanguageLine2: "Get accurate transcripts for global teams without re-recording.",
  gateLargeFilesTitle: "Upload longer recordings",
  gateLargeFilesLine1: "Process files up to 500 MB and meetings over 3 hours.",
  gateLargeFilesLine2: "Stop splitting recordings — one upload, one complete report.",
  gateSentimentTitle: "Meeting sentiment analysis",
  gateSentimentLine1: "See whether the conversation was positive, mixed, or tense at a glance.",
  gateSentimentLine2: "Coach teams and follow up with the right tone, faster.",
  gateChaptersTitle: "Auto-generated meeting chapters",
  gateChaptersLine1: "Jump to key moments with timestamped chapter markers.",
  gateChaptersLine2: "Share highlights without making colleagues watch the full recording.",
  gatePrioritiesTitle: "Action item priorities",
  gatePrioritiesLine1: "High, medium, and low labels so your team knows what to do first.",
  gatePrioritiesLine2: "Turn meetings into a ranked to-do list — not a wall of notes.",
  gatePrioritiesTeaser: "Priorities",
  gateInsightsTeaser: "AI Insights",
  gateQuotesTitle: "Key quote highlights",
  gateQuotesLine1: "Surface the most important quotes from every meeting.",
  gateQuotesLine2: "Share proof points without re-listening to the recording.",
  gateRisksTitle: "Risks & blockers detection",
  gateRisksLine1: "AI flags risks, blockers, and severity before they escalate.",
  gateRisksLine2: "Stay ahead of delivery issues across your team.",
  gateEmailTitle: "Follow-up email draft",
  gateEmailLine1: "Get a ready-to-send recap email in seconds.",
  gateEmailLine2: "Copy, edit, and send — no manual writing.",
  gatePriorityProcTitle: "Priority processing",
  gatePriorityProcLine1: "Your files jump the queue during peak hours.",
  gatePriorityProcLine2: "Faster turnaround for time-sensitive meetings.",
  gateSentimentTeaser: "Sentiment",
  trustUsedBy: "Trusted by leading teams at",
  trustTeamsCount: "From 2,400+ teams worldwide",
  liveActivityLabel: "Live activity",
  liveActivityDismiss: "Dismiss",
  liveActivityJustNow: "Just now",
  liveActivityMinutesAgo: "{n} min ago",
  liveActivitySignup: "{name} from {location} just signed up",
  liveActivityTranscription: "{name} from {location} completed a transcription",
  liveActivityUpgrade: "{name} from {location} upgraded to Pro",
  liveActivityExport: "{name} from {location} exported a PDF report",
};

const he: Translations = {
  authTagline: "בינה מלאכותית ברמת אולפן",
  authTitle: "הופכים פגישות לנכס.",
  authTitleAccent: "תמלול וסיכום AI מדויק ב-5 דקות.",
  authSubtitle:
    "די לסיכומים ידניים ולפגישות אינסופיות. תנו ל-AI להפיק עבורכם רשימות משימות, החלטות עסקיות ותובנות מפתח מכל שיחה — אוטומטית.",
  authName: "השם שלך",
  authEmail: "כתובת אימייל",
  authSubmit: "התחילו בחינם",
  authGoogle: "המשיכו עם Google",
  authGoogleHint: "התחברות מהירה עם חשבון Google שלך",
  authEmailOr: "או",
  authEmailSubmit: "המשיכו עם אימייל",
  authCardTitle: "התחילו בחינם",
  authCardSubtitle: "צרו חשבון חינמי תוך שניות — רק שם ואימייל.",
  authFreeBadge: "ללא צורך בכרטיס אשראי",
  authBenefit1: "10 תמלולים חינם בכל חודש",
  authBenefit2: "דוחות PDF ומשימות כלולים",
  authBenefit3: "עברית, אנגלית ועוד שפות",
  authHowTitle: "איך זה עובד",
  authHowStep1Title: "העלאה",
  authHowStep1Desc: "גררו הקלטת פגישה או ראיון",
  authHowStep2Title: "עיבוד AI",
  authHowStep2Desc: "תמלול, סיכום ומשימות תוך דקות",
  authHowStep3Title: "שיתוף ופעולה",
  authHowStep3Desc: "ייצוא PDF או העתקת סיכום מנהלים",
  authLiveLabel: "פעילות חיה",
  authLiveToday: "{n} תמלולים היום",
  authLiveTodayLabel: "תמלולים היום",
  authLiveUsers: "{n}+ משתמשים הצטרפו",
  authLiveUsersLabel: "משתמשים הצטרפו",
  authDemoEyebrow: "הדגמה",
  authDemoTitle: "ראו את Staz AI בפעולה",
  authDemoSubtitle:
    "צפו איך הקלטת פגישה הופכת לתמלול, סיכום מנהלים ומשימות — תוך פחות מדקה.",
  authDemoPlay: "הפעלת הדגמה אינטראקטיבית",
  authDemoDuration: "~30 שניות",
  authDemoProcessing: "ה-AI מעבד את הפגישה שלכם...",
  authDemoReady: "הדוח שלכם מוכן",
  authUpdates: "נשלח עדכונים וטיפים בלבד. אפשר לבטל בכל עת.",
  authSocialProof: "נבחר על ידי יוצרים, צוותים ואולפנים ברחבי העולם",
  authFeature1: "תמלול AI תוך שניות",
  authFeature2: "סיכומי מנהלים ומשימות",
  authFeature3: "קבצים ארוכים עד 3+ שעות",
  authStat1: "50K+ סשנים",
  authStat2: "98% דיוק",
  authStat3: "דירוג 4.9★",
  landingHeroUpload: "גררו לכאן הקלטת פגישה (או לחצו לבחירה)",
  landingHeroUploadHint: "נתמך ב-Zoom, Teams, Google Meet ועוד.",
  landingWhyTitle: "למה צוותים עוברים אלינו?",
  landingBenefit1Title: "החלטות חכמות, מיידית",
  landingBenefit1Desc:
    "ה-AI מחלץ החלטות, נושאים וסיכום מנהלים מכל פגישה — בלי רשימות ידניות.",
  landingBenefit2Title: "אינטליגנציה ברמת Pro",
  landingBenefit2Desc:
    "סנטימנט, פרקים, ציטוטים מרכזיים, סיכונים וטיוטת מייל המשך — הכל אוטומטי.",
  landingBenefit3Title: "מפגישה לפעולה",
  landingBenefit3Desc:
    "משימות עם אחראים, עדיפויות ודדליינים — מוכנות לשיתוף באותו יום.",
  landingPricingTitle: "תוכניות פשוטות, ללא הפתעות",
  landingPricingFreeTitle: "חינמי (לניסיון)",
  landingPricingProTitle: "Pro (לצוותים)",
  landingPricingFree1: "10 תמלולים בחודש",
  landingPricingFree2: "תמלול וסיכום באיכות אולפן",
  landingPricingPro1: "קבצים עד 500 MB · 3+ שעות",
  landingPricingPro2: "דוחות PDF ותובנות AI מתקדמות",
  landingPricingPro3: "עיבוד בעדיפות ובחירת שפה",
  landingPricingEnterprise:
    "צריכים קבצים גדולים במיוחד? דברו איתנו על תוכנית Enterprise.",
  authErrorName: "נא להזין שם",
  authErrorEmail: "נא להזין אימייל תקין",
  authErrorSignIn: "ההתחברות נכשלה. נסו שוב.",
  authGoogleUnavailable:
    "התחברות עם Google לא מוגדרת. השתמש באימייל או פנה לתמיכה.",
  authLoading: "מתחבר...",
  navDashboard: "לוח בקרה",
  navHistory: "היסטוריה",
  navSettings: "הגדרות",
  navSignOut: "התנתק",
  navUsers: "משתמשים רשומים",
  dashTitle: "לוח בקרה",
  dashDesc: "תמלול מקצועי לעבודה היומיומית",
  dashHero: "שולחן העבודה שלך",
  dashHeroDesc:
    "העלו פגישות, ראיונות או וידאו ארוך. קבלו תמלול ברמת אולפן, סיכומים ומשימות.",
  dashNewTranscription: "תמלול חדש",
  dashProTip: "טיפ",
  dashProTipDesc:
    "אודיו ברור נותן את התוצאות הטובות ביותר. משתמשי Pro יכולים להעלות עד 500 MB — אנחנו מייעלים אוטומטית.",
  dashSessions: "סשנים",
  dashHoursSaved: "שעות שנחסכו",
  dashInsights: "תובנות",
  testimonialsTag: "בשימוש אנשי מקצוע",
  testimonialsTitle: "מה המשתמשים שלנו אומרים",
  dashUsageLimit: "הגעת למגבלה החודשית.",
  dashUsageRemaining: "תמלולים שנותרו",
  langAuto: "זיהוי אוטומטי",
  langHe: "עברית",
  langEn: "אנגלית",
  langAr: "ערבית",
  langEs: "ספרדית",
  langFr: "צרפתית",
  langRu: "רוסית",
  uploadDrop: "גרור את ההקלטה לכאן",
  uploadBrowse: "תמלול באיכות אולפן · גרירה או בחירת קובץ",
  uploadRecordMic: "הקלט ממיקרופון",
  uploadStopRec: "עצור הקלטה",
  uploadPasteLink: "הדבק קישור",
  uploadLinkPlaceholder: "קישור ל-YouTube, Drive, Dropbox או Zoom…",
  uploadLinkSubmit: "ייבוא",
  uploadLinkSoonTitle: "ייבוא מקישור בקרוב",
  uploadLinkSoonDesc:
    "ייבוא מ-YouTube, Drive ו-Zoom בענן בדרך. בינתיים העלו קובץ.",
  uploadMicDenied: "הגישה למיקרופון נדחתה. בדקו את הרשאות הדפדפן.",
  commandPaletteTitle: "חיפוש בסביבת העבודה",
  commandPalettePlaceholder: "חיפוש בתמלולים, דוברים ופריטי משימה…",
  commandPaletteEmpty: "אין תוצאות בהיסטוריה.",
  commandPaletteHint: "⌘K",
  inspectorQuota: "שימוש החודש",
  inspectorPlan: "החבילה הנוכחית",
  inspectorRecent: "אחרונים",
  inspectorEmpty: "עדיין אין תמלולים. העלו את ההקלטה הראשונה.",
  uploadMax: "מקסימום",
  uploadFileSizeNote: "עד {size} לקובץ",
  uploadDurationNote: "עד {duration} להקלטה · {plan}",
  uploadUpgrade: "ל-500 MB וסרטונים של 3+ שעות",
  uploadUpgradeLink: "שדרג ל-Pro",
  uploadErrorType: "נא להעלות MP3, WAV, MP4 או M4A.",
  uploadErrorSize: "הקובץ חורג ממגבלת החינם. שדרג ל-Pro עד 500 MB.",
  uploadErrorSizePro: "הקובץ חורג מהמגבלה.",
  procWait: "מעבד את ההקלטה — קבצים ארוכים עשויים לקחת כמה דקות.",
  procUploading: "מעלה...",
  procTranscribing: "מתמלל באמצעות AI...",
  procAnalyzing: "מנתח תובנות מרכזיות...",
  resComplete: "התמלול הושלם",
  resProcessed: "עובד",
  resDownloadTranscript: "הורד תמלול",
  resFullReport: "דוח PDF",
  resDownload: "הורד",
  resDownloadFormat: "סוג קובץ",
  downloadFormatPdf: "דוח PDF — מעוצב ומלא",
  downloadFormatDocx: "מסמך Word (.docx)",
  downloadFormatFullTxt: "דוח מלא (.txt)",
  downloadFormatTranscriptTxt: "תמלול בלבד (.txt)",
  downloadFormatSrt: "כתוביות (.srt)",
  downloadFormatVtt: "כתוביות WebVTT (.vtt)",
  resGeneratingDownload: "מכין הורדה...",
  resNewUpload: "העלאה חדשה",
  resSummary: "סיכום",
  resActions: "משימות",
  resTranscript: "תמלול מלא",
  resExecutive: "סיכום מנהלים",
  resTakeaways: "תובנות מרכזיות",
  resCompleted: "הושלמו",
  resDownloadTxt: "הורד .txt",
  resDownloadPdf: "הורד דוח PDF",
  resGeneratingPdf: "מייצר PDF...",
  resOverview: "סקירה מנהלית",
  resChapters: "פרקים",
  resInsights: "תובנות מתקדמות",
  resAiInsights: "תובנות AI",
  resHeadline: "כותרת הפגישה",
  resTopics: "נושאים",
  resDecisions: "החלטות מרכזיות",
  resKeyQuotes: "ציטוטים מרכזיים",
  resRisks: "סיכונים וחסמים",
  resFollowUpEmail: "מייל המשך",
  resCopyEmail: "העתק מייל",
  resSentiment: "אווירת הפגישה",
  resCopySummary: "העתק סיכום",
  resCopied: "הועתק!",
  resMarkdownBrief: "תקציר מקצועי (Markdown)",
  resSearchTranscript: "חיפוש בתמלול...",
  resNoResults: "לא נמצאו תוצאות.",
  resPriorityHigh: "גבוהה",
  resPriorityMedium: "בינונית",
  resPriorityLow: "נמוכה",
  pdfBrand: "דוח תובנות פגישה",
  pdfTagline: "תמלול וניתוח AI ברמת אולפן",
  pdfDurationLabel: "משך",
  pdfProcessedLabel: "עובד",
  pdfOwner: "אחראי",
  pdfDeadline: "דדליין",
  pdfPending: "ממתין",
  pdfGeneratedBy: "נוצר על ידי Staz AI",
  planFree: "חבילה חינמית",
  planPro: "חבילת Pro",
  planUpgrade: "שדרג ל-Pro",
  planProActive: "Pro פעיל — העלאה עד 500 MB",
  planUsed: "בשימוש החודש",
  featColumnFeature: "פיצ'ר",
  featExecutiveSummary: "סיכום מנהלים AI",
  featSmartDecisions: "חילוץ החלטות מרכזיות",
  featTopicTags: "תיוג נושאים אוטומטי",
  featActionItems: "משימות ואחראים",
  featTranscriptSearch: "חיפוש בתמלול",
  featCopyClipboard: "העתקה ללוח",
  featPdfExport: "ייצוא PDF",
  featTxtExport: "ייצוא טקסט",
  featHistory: "היסטוריה שמורה (5 / 50)",
  featLargeFiles: "קבצים גדולים (500 MB)",
  featLanguageSelect: "בחירת שפה",
  featSentiment: "ניתוח סנטימנט",
  featChapters: "פרקי פגישה",
  featPriorities: "עדיפויות משימות",
  featKeyQuotes: "ציטוטים מרכזיים",
  featRisksBlockers: "סיכונים וחסמים",
  featFollowUpEmail: "טיוטת מייל המשך",
  featPriorityProcessing: "עיבוד בעדיפות",
  featIntegrationsPush: "גשר אינטגרציות (Webhook)",
  featTranscriptionWebhooks: "Webhooks בסיום תמלול",
  featSharedLinks: "קישורי שיתוף לקריאה בלבד",
  featSmartSearch: "חיפוש חכם בהיסטוריה",
  featSummaryTemplates: "תבניות סיכום (מנהל / סטודנט / טכני)",
  featSpeakerDiarization: "זיהוי דוברים (דובר 1, 2, …)",
  settingsTitle: "הגדרות",
  settingsDesc: "ניהול חשבון, חבילה והעדפות",
  settingsPlan: "החבילה שלך",
  settingsProfile: "פרופיל",
  settingsNotifications: "התראות",
  settingsBilling: "חיוב",
  settingsSecurity: "אבטחה",
  settingsProActive: "Pro פעיל — העלאה עד 500 MB",
  settingsNameLabel: "שם",
  settingsEmailLabel: "אימייל",
  settingsNotificationsBody: "עדכוני מוצר פעילים עבור {email}",
  settingsBasicPlan: "חבילת Basic — $0",
  settingsProPlanLine: "חבילת Pro — {price} לכל החיים",
  settingsManagePayPal: "רכישת Pro לכל החיים בוצעה דרך PayPal.",
  settingsProBillingScheduled: "Pro לכל החיים פעיל — שילמתם פעם אחת ושומרים על Pro לנצח.",
  settingsProLifetime: "Pro לכל החיים — ללא חיובים חוזרים.",
  billingSetupRequiredTitle: "פתחו Pro לכל החיים",
  billingSetupRequiredDesc:
    "שלמו פעם אחת עם PayPal למטה — {price} בשבוע ההשקה, ואז Pro שלכם לנצח.",
  paypalCancelled: "התשלום ב-PayPal בוטל.",
  pricingProLaunchNote: "שבוע השקה — Pro לכל החיים ב-{intro} (תשלום אחד, Pro לנצח).",
  historyTitle: "היסטוריה",
  historyDesc: "עיין בתמלולים וסיכומים קודמים",
  historySearch: "חיפוש בהיסטוריה...",
  historyRecordings: "הקלטות",
  historyEmpty: "עדיין אין תמלולים שמורים. השלם תמלול כדי לראות אותו כאן.",
  historyView: "צפייה",
  historyDelete: "מחק",
  historyLimitNote: "חינם שומר 5 אחרונים · Pro שומר 50",
  searchPlaceholder: "חיפוש תמלולים...",
  studioGrade: "רמת אולפן",
  tryAgain: "נסו שוב",
  transcriptionFailed: "התמלול נכשל",
  transcriptionFailedSubtitle: "הקובץ נראה תקין — לרוב זו תקלה זמנית.",
  transcriptionErrorGeneric:
    "לא הצלחנו לסיים את העיבוד. נסו שוב בעוד רגע.",
  transcriptionErrorNetwork:
    "החיבור נותק במהלך ההעלאה. בדקו את הרשת ונסו שוב.",
  transcriptionErrorTimeout:
    "העיבוד ארך יותר מדי. בחבילה החינמית קטעים קצרים עובדים הכי טוב.",
  transcriptionErrorEmpty:
    "לא זוהתה דיבור בקובץ. נסו הקלטה עם שמע ברור יותר.",
  transcriptionErrorVideo:
    "לא הצלחנו לקרוא את ערוץ השמע בסרטון. נסו MP3/WAV, או שדרגו ל-Pro לעיבוד וידאו מתקדם.",
  transcriptionErrorSize:
    "הקובץ חורג ממגבלת החבילה. ב-Pro אפשר להעלות עד 500 MB והקלטות ארוכות יותר.",
  transcriptionErrorSizeFree:
    "הקובץ חורג ממגבלת החינם (25 MB). שדרגו ל-Pro להעלאות עד 500 MB.",
  transcriptionErrorSizePro:
    "הקובץ חורג ממגבלת ה-Pro (500 MB), או שההקלטה ארוכה מדי לעיבוד. נסו קטע קצר יותר או MP3/WAV.",
  transcriptionErrorLimit:
    "הגעתם למכסת התמלולים החודשית. שדרגו ל-Pro לעוד תמלולים.",
  transcriptionErrorAuth: "פג תוקף ההתחברות. רעננו את הדף והתחברו מחדש.",
  transcriptionErrorConfigOpenai:
    "שירות התמלול לא מוגדר בשרת. הגדירו OPENAI_API_KEY אמיתי ב-Vercel → Environment Variables ועשו Redeploy.",
  transcriptionErrorConfigBlob:
    "העלאות גדולות לא מוגדרות. ב-Vercel: Storage → Blob → Connect לפרויקט, ואז Redeploy.",
  transcriptionErrorProTitle: "ב-Pro וידאו ארוך עובד בצורה אמינה",
  transcriptionErrorProDesc:
    "עיבוד בעדיפות, העלאה עד 500 MB, הקלטות של 3+ שעות ותובנות AI מתקדמות.",
  transcriptionErrorProCta: "שדרגו ל-Pro",
  transcriptionErrorTipsTitle: "טיפים מהירים",
  transcriptionErrorTip1: "קבצי MP3 ו-WAV מתמללים הכי מהר",
  transcriptionErrorTip2: "דיבור ברור ליד המיקרופון משפר את הדיוק",
  langLabel: "שפה",
  themeLabel: "ערכת נושא",
  themeLight: "בהיר",
  themeDark: "כהה",
  themeSystem: "מערכת",
  errorBoundaryTitle: "משהו השתבש",
  errorBoundaryMessage: "אירעה שגיאה בלתי צפויה. נסו שוב.",
  errorBoundaryRetry: "נסו שוב",
  adminTitle: "משתמשים רשומים",
  adminDesc: "כל מי שנרשם ל-Staz AI",
  adminTotal: "נרשמו בסך הכל",
  adminName: "שם",
  adminEmail: "אימייל",
  adminProvider: "שיטת התחברות",
  adminRegistered: "תאריך הרשמה",
  adminLastLogin: "כניסה אחרונה",
  adminPlan: "חבילה",
  adminProCount: "מנויי Pro",
  adminCopyEmails: "העתק כל המיילים",
  adminExportCsv: "ייצוא CSV",
  adminMailAll: "שלח מייל לכולם",
  adminRefresh: "רענון",
  adminFilterAll: "הכל",
  adminFilterPro: "Pro",
  adminFilterFree: "חינם",
  adminNoAccess: "אין לך הרשאה לצפות בדף זה.",
  adminEmpty: "עדיין אין משתמשים רשומים.",
  adminEmailsCopied: "המיילים הועתקו ללוח",
  paypalTitle: "שדרוג עם PayPal",
  paypalDesc:
    "רק PayPal — תשלום מאובטח אחד. Pro שלכם לנצח — בלי מנוי חודשי.",
  paypalPay: "שלמו עם PayPal",
  paypalSuccess: "Pro הופעל לכל החיים! תהנו מגישה מלאה.",
  paypalProcessing: "מעבד תשלום...",
  paypalError: "התשלום נכשל. נסו שוב.",
  paypalNotConfigured: "PayPal לא מוגדר. הוסף מפתחות ל-.env.local",
  paypalSandboxNote: "רק PayPal — תשלום חד-פעמי מאובטח",
  paypalSubscribeTitle: "שבוע השקה — Pro לכל החיים ב-{intro}",
  paypalSubscribeDesc:
    "תשלום אחד דרך PayPal. {intro} בשבוע ההשקה — Pro לנצח, בלי חיובים חוזרים.",
  paypalAutoBillingNote: "באישור התשלום יחויב סכום חד-פעמי של {intro}. ללא מנוי.",
  paypalPreapprovalError: "PayPal לא הצליח להשלים את התשלום. נסו שוב או פנו לתמיכה.",
  paypalOnlyNote: "אין אצלנו מערכת סליקה — התשלומים עוברים רק דרך PayPal.",
  paypalBuyerTip: "התחברו עם חשבון PayPal לאישור תשלום חד-פעמי.",
  paypalRedirectCta: "המשך ב-PayPal.com",
  paypalLifetimeNote: "מחיר השקה {price} — תשלום אחד, Pro לנצח. מחיר רגיל {regular}.",
  proLifetimeOnce: "פעם אחת",
  proLifetimeBadge: "שלמו פעם אחת · Pro לנצח",
  proLifetimePricingNote: "תשלום יחיד — ללא מנוי חודשי.",
  integTitle: "גשר אינטגרציות",
  integSubtitle:
    "דחיפת משימות לאוטומציה שלך — בלי העתקה אחרי כל פגישה.",
  integLoading: "טוען אינטגרציות…",
  integConnected: "מחובר",
  integComingSoon: "בקרוב",
  integComingSoonDetail: "חיבור OAuth לקונקטור הזה יגיע בגרסה הבאה.",
  integSave: "שמור אינטגרציה",
  integSaveSuccess: "האינטגרציה נשמרה.",
  integSaveFailed: "לא ניתן לשמור את האינטגרציה.",
  integLoadFailed: "לא ניתן לטעון אינטגרציות.",
  integPayloadNote:
    "Webhook שולח JSON עם מטא-דאטה של הפגישה ומשימות (HTTPS בלבד).",
  integEmptyTitle: "שלחו משימות למקום שבו הצוות כבר עובד",
  integEmptyDesc:
    "חברו Zapier, Slack או Webhook מותאם — המשימות מגיעות מיד בסיום הפגישה.",
  integEmptyStat: "צוותים חוסכים ~2 שעות בשבוע על מעקב אחרי פגישות",
  integEmptyCta: "פתחו אינטגרציות עם Pro",
  integWebhookName: "Webhook מותאם",
  integWebhookDesc: "שליחת משימות ל-Zapier, Make או כל HTTPS endpoint.",
  integSlackName: "Slack",
  integSlackDesc: "פרסום משימות בערוץ אחרי כל פגישה.",
  integNotionName: "Notion",
  integNotionDesc: "יצירת שורה במסד נתונים עם משימות מצורפות.",
  integZapierName: "Zapier",
  integZapierDesc: "הפעלת 6,000+ אפליקציות מתוצאות הפגישה.",
  integWebhookUrlLabel: "כתובת Webhook",
  integWebhookUrlHint: "חייב להיות HTTPS. Zapier ו-Make מספקים כתובת מוכנה.",
  integWebhookUrlRequired: "הזינו כתובת Webhook או בטלו את האינטגרציה.",
  integWebhookSecretLabel: "מפתח חתימה (אופציונלי)",
  integWebhookSecretHint: "נשלח X-Staz-Signature: sha256=… לאימות.",
  integWebhookSecretPlaceholder: "סוד HMAC אופציונלי",
  integWebhookEnabled: "הפעל דחיפת Webhook",
  integPushCta: "דחוף משימות",
  integPushSuccess: "נשלח!",
  integPushFailed: "השליחה נכשלה",
  settingsIntegrations: "אינטגרציות",
  searchSmartPlaceholder: "חיפוש בפגישות, תמלולים ומשימות…",
  searchNoHits: "לא נמצאו התאמות בהיסטוריה.",
  searchFieldFileName: "קובץ",
  searchFieldHeadline: "כותרת",
  searchFieldSummary: "סיכום",
  searchFieldTranscript: "תמלול",
  searchFieldActions: "משימות",
  searchFieldTopics: "נושאים",
  shareTitle: "שיתוף סיכום",
  shareDesc: "צרו קישור לקריאה בלבד ל\"{title}\" — בלי התחברות.",
  sharePrivate: "פרטי",
  sharePublicLink: "קישור שיתוף",
  shareCopyLink: "העתק קישור",
  gateIntegrationsTitle: "גשר אינטגרציות",
  gateIntegrationsLine1: "שליחה אוטומטית של משימות ל-Slack, Notion או Zapier.",
  gateIntegrationsLine2: "בלי להקליד שוב — שמרו מומנטום אחרי כל שיחה.",
  gateWebhooksTitle: "Webhooks לתמלול",
  gateWebhooksLine1: "שליחת תמלול מלא וסיכום AI לאוטומציה שלכם כשהתמלול מסתיים.",
  gateWebhooksLine2: "זמין ב-Pro — למשתמשים מתקדמים.",
  webhooksPageTitle: "Webhooks",
  webhooksPageDesc: "אוטומציה לסיום תמלול.",
  webhooksBackToSettings: "חזרה להגדרות",
  webhooksSectionTitle: "Webhook בסיום תמלול",
  webhooksSectionDesc:
    "נשלח POST לכתובת שלכם כשתמלול מסתיים — כולל מטא-דאטה, טקסט מלא וסיכום AI.",
  webhooksSettingsCardTitle: "Webhooks",
  webhooksSettingsCardDesc:
    "שליחת תוצאות תמלול ל-Zapier, Make, n8n או API משלכם.",
  webhooksSettingsCardCta: "הגדרה",
  webhooksUrlLabel: "כתובת Webhook",
  webhooksUrlHint: "חייב HTTPS. Zapier, Make או שרת משלכם.",
  webhooksUrlRequired: "הזינו כתובת Webhook או בטלו את השליחה.",
  webhooksUrlInvalid: "הכתובת חייבת להיות HTTPS תקינה (עד 2048 תווים).",
  webhooksSecretLabel: "מפתח חתימה (אופציונלי)",
  webhooksSecretHint: "נשלח X-Staz-Signature: sha256=… לאימות.",
  webhooksSecretPlaceholder: "סוד HMAC אופציונלי",
  webhooksEnabled: "שליחה אוטומטית כשתמלול מסתיים",
  webhooksActiveLabel: "Webhook פעיל",
  webhooksSave: "שמור",
  webhooksSaved: "נשמר!",
  webhooksTest: "שליחת אירוע בדיקה",
  webhooksTestSent: "נשלח!",
  webhooksSaveSuccess: "הגדרות Webhook נשמרו.",
  webhooksSaveFailed: "לא ניתן לשמור את הגדרות ה-Webhook.",
  webhooksLoadFailed: "לא ניתן לטעון את הגדרות ה-Webhook.",
  webhooksLoading: "טוען הגדרות Webhook…",
  webhooksTestSuccess: "אירוע בדיקה נשלח (HTTP {status}).",
  webhooksTestFailed: "בדיקת Webhook נכשלה.",
  webhooksPayloadNote:
    "אירוע: transcription.completed · כולל metadata, fullText, transcript[], summary ו-actionItems[].",
  webhooksLockedTitle: "Webhooks לאוטומציה",
  webhooksLockedDesc:
    "שדרגו ל-Pro כדי לשלוח תמלולים מושלמים ל-HTTPS endpoint מותאם.",
  webhooksLockedCta: "שדרוג ל-Pro",
  webhooksLockedBadge: "תכונת Pro",
  webhooksLockedFeature1: "POST מיידי כשתמלול מסתיים",
  webhooksLockedFeature2: "טקסט מלא, סיכום AI ומטא-דאטה ב-payload אחד",
  webhooksLockedFeature3: "חתימת HMAC אופציונלית לאימות מאובטח",
  gateShareTitle: "קישורי שיתוף לפגישות",
  gateShareLine1: "שלחו לבעלי עניין סיכום לקריאה בלבד.",
  gateShareLine2: "בלי חשבון — מושלם ללקוחות והנהלה.",
  workspaceValueEyebrow: "תשואה על הזמן",
  workspaceValueTitle: "זמן מוערך שנחסך בפגישה זו: {minutes} דק׳",
  workspaceMeetingDuration: "אורך הפגישה: {duration}",
  workspaceChapters: "פרקים",
  workspaceTranscript: "תמלול אינטראקטיבי",
  workspaceRenameSpeakers: "דוברים",
  workspaceSpeakerRenamePlaceholder: "שם…",
  workspaceRenameSpeakerAction: "שנה שם ל{name}",
  workspaceDiarizationBadge: "זיהוי דוברים",
  workspacePlay: "נגן",
  workspacePause: "השהה",
  workspaceNoAudio: "ניגון אודיו זמין להעלאות חדשות בסשן הנוכחי. פריטים מההיסטוריה נפתחים בלי קובץ המקור.",
  workspaceCopyTranscript: "העתק תמלול",
  workspaceInteractivePlayer: "נגן מסונכרן",
  workspaceEditableHint: "לחצו על שורה לעריכה — השינויים נשמרים אוטומטית ומשפיעים על הייצוא.",
  workspaceSaveTranscript: "שמור שינויים",
  workspaceTranscriptSaved: "כל השינויים נשמרו",
  workspaceTranscriptSaving: "שומר…",
  workspaceTranscriptUnsaved: "שינויים שלא נשמרו",
  workspaceAudioMode: "הקלטת אודיו — השתמשו בפקדים למטה לניגון",
  workspaceSeek: "גלילה",
  aiInsightsLoading: "מייצר תובנות AI…",
  aiInsightsLoadingHint: "GPT-4o mini מנתח את התמלול",
  aiInsightsError: "לא ניתן לייצר תובנות",
  aiInsightsRegenerate: "יצירה מחדש",
  aiInsightsCopyAll: "העתק הכל",
  aiInsightsExecutive: "סיכום מנהלים",
  aiInsightsActions: "משימות לביצוע",
  aiInsightsTopics: "נושאים עיקריים",
  aiInsightsPoweredBy: "מופעל על ידי GPT-4o mini",
  aiInsightsNoActions: "לא זוהו משימות.",
  aiInsightsNoTopics: "לא זוהו נושאים.",
  gateSummaryTemplatesTitle: "תבניות סיכום",
  gateSummaryTemplatesLine1: "אותה פגישה בניסוח למנהלים, סטודנטים או מהנדסים.",
  gateSummaryTemplatesLine2: "מעבר מיידי בין מצבים — בלי להמתין לעיבוד מחדש.",
  summaryModeTitle: "מצב סיכום",
  summaryModeHint: "מעבר מיידי",
  summaryPreviewTitle: "תצוגה מקדימה",
  summaryPreviewLoading: "מכין תבניות…",
  summaryPreviewEmpty: "בחרו מצב כדי לראות את הסיכום המעוצב.",
  summaryFromCache: "מיידי",
  trialTitle: "שבוע השקה — Pro ב-{intro}/חודש",
  trialDesc:
    "הירשמו עם PayPal למטה. {intro}/חודש בשבוע ההשקה, ואז {regular}/חודש אוטומטית כל חודש.",
  saleBadge: "שבוע השקה",
  saleTitle: "שבוע השקה: Pro ב-{intro}/חודש — ואז {regular}/חודש",
  saleFirstMonth: "מחיר השקה {intro}/חודש — ואז {regular}/חודש",
  saleFreeWeek: "{intro} בשבוע ההשקה",
  salePricingNote: "הירשמו עכשיו ב-{intro}/חודש בשבוע ההשקה, ואז {regular}/חודש כל חודש.",
  saleEndsIn: "המבצע מסתיים בעוד",
  saleDays: "ימים",
  saleHours: "שעות",
  saleMinutes: "דקות",
  saleSeconds: "שניות",
  pricingTitle: "חבילות שמשתלמות מיידית",
  pricingSubtitle: "בחרו את הדרך להחלטות מהירות יותר — לא רק עוד פיצ'רים.",
  pricingMonthly: "חודשי",
  pricingYearly: "שנתי",
  pricingYearlySave: "חסכו {percent}% בתשלום שנתי",
  pricingMostPopular: "הכי פופולרי",
  pricingCurrentPlan: "החבילה הנוכחית",
  pricingPerMonthEquiv: "/חודש בתשלום שנתי",
  pricingSavePercent: "חיסכון {percent}%",
  pricingBasicName: "Basic",
  pricingBasicDesc: "לאנשים שרוצים להתחיל עם תמלול AI.",
  pricingBasicOutcome1: "סיכום AI, החלטות ותיוג נושאים",
  pricingBasicOutcome2: "משימות עם אחראים ודדליינים",
  pricingBasicOutcome3: "10 תמלולים בחודש · קבצים עד 25 MB",
  pricingBasicCta: "התחילו בחינם",
  pricingProName: "Pro",
  pricingProDesc: "לאנשי מקצוע שחיים מפגישות וצריכים תוצאות מהר.",
  pricingProOutcome1: "סנטימנט, פרקים ומשימות מדורגות לפי עדיפות",
  pricingProOutcome2: "ציטוטים מרכזיים, סיכונים וטיוטות מייל המשך",
  pricingProOutcome3: "קבצים עד 500 MB · 100 תמלולים בחודש",
  pricingProCta: "שדרג ל-Pro",
  pricingEnterpriseName: "Enterprise",
  pricingEnterpriseDesc: "לצוותים שצריכים קנה מידה, שליטה ותמיכה ייעודית.",
  pricingEnterpriseOutcome1: "תובנות אחידות בכל הארגון",
  pricingEnterpriseOutcome2: "הטמעת צוותים תוך ימים, לא שבועות",
  pricingEnterpriseOutcome3: "תמיכה ייעודית עם SLA מובטח",
  pricingEnterpriseCta: "צור קשר עם מכירות",
  onboardTag: "התחלה מהירה",
  onboardTitle: "בואו נתחיל: תמלול ראשון בתוך 5 דקות",
  onboardSubtitle: "השלימו 3 שלבים כדי לפתוח את מלוא הכוח של Staz AI.",
  onboardProgress: "התקדמות הגדרה",
  onboardDismiss: "אסיים את זה אחר כך",
  onboardExpand: "הרחב",
  onboardHide: "הסתר",
  onboardComplete: "הכל מוכן!",
  onboardCompleteDesc: "סביבת העבודה שלך מוכנה. התחילו להפוך פגישות לפעולה.",
  onboardStep1Title: "חברו את הפרופיל",
  onboardStep1Desc: "אשרו שם ואימייל כדי שדוחות יהיו מותאמים אישית.",
  onboardStep1Outcome: "תוצאה: סיכומים ממותגים מוכנים לשיתוף",
  onboardStep1Cta: "עבור לפרופיל",
  onboardStep2Title: "צרו את הפרויקט הראשון",
  onboardStep2Desc: "העלו הקלטה כדי להתחיל את התמלול הראשון שלכם.",
  onboardStep2Outcome: "תוצאה: תמלול ראשון תוך פחות מ-2 דקות",
  onboardStep2Cta: "העלו הקלטה",
  onboardStep3Title: "סקורו את סיכום ה-AI",
  onboardStep3Desc: "פתחו את סיכום המנהלים ורשימת המשימות.",
  onboardStep3Outcome: "תוצאה: תובנות מעשיות בלי רשימות ידניות",
  onboardStep3Cta: "צפה בסיכום",
  onboardStep3Waiting: "השלימו העלאה — הסיכום יופיע כאן אוטומטית.",
  gateEyebrow: "שדרגו כדי לפתוח",
  gateStartTrial: "התחילו Pro בחינם",
  gateNotNow: "לא עכשיו",
  gatePriceHint: "Pro מ-{price}/חודש · ביטול בכל עת",
  gateLanguageTitle: "תמלול בכל שפה",
  gateLanguageLine1: "בחרו עברית, אנגלית, ערבית ועוד לפני ההעלאה.",
  gateLanguageLine2: "תמלול מדויק לצוותים גלובליים בלי להקליט מחדש.",
  gateLargeFilesTitle: "העלאת הקלטות ארוכות",
  gateLargeFilesLine1: "עיבוד קבצים עד 500 MB ופגישות מעל 3 שעות.",
  gateLargeFilesLine2: "בלי לפצל הקלטות — העלאה אחת, דוח מלא אחד.",
  gateSentimentTitle: "ניתוח אווירת הפגישה",
  gateSentimentLine1: "ראו במבט אחד אם השיחה הייתה חיובית, מעורבת או מתוחה.",
  gateSentimentLine2: "הדריכו צוותים ופנו מחדש בטון הנכון, מהר יותר.",
  gateChaptersTitle: "פרקי פגישה אוטומטיים",
  gateChaptersLine1: "קפצו לרגעים מרכזיים עם סימוני פרקים וחותמות זמן.",
  gateChaptersLine2: "שתפו היילייטים בלי לגרום לעמיתים לצפות בהקלטה המלאה.",
  gatePrioritiesTitle: "עדיפויות למשימות",
  gatePrioritiesLine1: "תוויות גבוהה, בינונית ונמוכה כדי שהצוות יידע מה לעשות קודם.",
  gatePrioritiesLine2: "הפכו פגישות לרשימת משימות מדורגת — לא קיר של הערות.",
  gatePrioritiesTeaser: "עדיפויות",
  gateInsightsTeaser: "תובנות AI",
  gateQuotesTitle: "ציטוטים מרכזיים",
  gateQuotesLine1: "ה-AI מדגיש את הציטוטים החשובים ביותר מכל פגישה.",
  gateQuotesLine2: "שתפו נקודות מפתח בלי להאזין שוב להקלטה.",
  gateRisksTitle: "זיהוי סיכונים וחסמים",
  gateRisksLine1: "ה-AI מסמן סיכונים, חסמים וחומרה לפני שהם מתגלים.",
  gateRisksLine2: "הישארו צעד לפני בעיות משלוח בצוות.",
  gateEmailTitle: "טיוטת מייל המשך",
  gateEmailLine1: "קבלו מייל סיכום מוכן לשליחה תוך שניות.",
  gateEmailLine2: "העתיקו, ערכו ושלחו — בלי כתיבה ידנית.",
  gatePriorityProcTitle: "עיבוד בעדיפות",
  gatePriorityProcLine1: "הקבצים שלכם עוברים לראש התור בשעות עומס.",
  gatePriorityProcLine2: "זמן תגובה מהיר יותר לפגישות דחופות.",
  gateSentimentTeaser: "סנטימנט",
  trustUsedBy: "נמצא בשימוש של צוותים מובילים ב:",
  trustTeamsCount: "מעל 2,400 צוותים ברחבי העולם",
  liveActivityLabel: "פעילות חיה",
  liveActivityDismiss: "סגור",
  liveActivityJustNow: "עכשיו",
  liveActivityMinutesAgo: "לפני {n} דק׳",
  liveActivitySignup: "{name} מ{location} הצטרף/ה עכשיו",
  liveActivityTranscription: "{name} מ{location} סיים/ה תמלול",
  liveActivityUpgrade: "{name} מ{location} שדרג/ה ל-Pro",
  liveActivityExport: "{name} מ{location} ייצא/ה דוח PDF",
};

const ar: Translations = {
  ...en,
  authTagline: "ذكاء اصطناعي بمستوى الاستوديو",
  authTitle: "حوّل كل اجتماع إلى إجراء",
  authSubtitle: "نسخ احترافي وملخصات ومهام — مصمم لسير عملك اليومي.",
  authName: "اسمك",
  authEmail: "البريد للتحديثات",
  authSubmit: "ابدأ مجاناً",
  authGoogle: "المتابعة مع Google",
  authUpdates: "سنرسل تحديثات ونصائح. يمكنك الإلغاء في أي وقت.",
  navDashboard: "لوحة التحكم",
  navHistory: "السجل",
  navSettings: "الإعدادات",
  navSignOut: "تسجيل الخروج",
  dashTitle: "لوحة التحكم",
  uploadDrop: "أسقط التسجيل هنا",
  resDownloadTranscript: "تحميل النص",
  resFullReport: "تقرير كامل",
  planUpgrade: "ترقية إلى Pro",
  settingsTitle: "الإعدادات",
  historyTitle: "السجل",
  langLabel: "اللغة",
};

const es: Translations = {
  ...en,
  authTagline: "IA de nivel estudio",
  authTitle: "Convierte cada reunión en acción",
  authSubtitle:
    "Transcripción profesional, resúmenes y tareas — para tu flujo diario.",
  authName: "Tu nombre",
  authEmail: "Email para actualizaciones",
  authSubmit: "Empezar gratis",
  authGoogle: "Continuar con Google",
  navDashboard: "Panel",
  navHistory: "Historial",
  navSettings: "Ajustes",
  navSignOut: "Cerrar sesión",
  uploadDrop: "Suelta tu grabación aquí",
  resDownloadTranscript: "Descargar transcripción",
  resFullReport: "Informe completo",
  planUpgrade: "Mejorar a Pro",
  langLabel: "Idioma",
};

const fr: Translations = {
  ...en,
  authTagline: "IA de qualité studio",
  authTitle: "Transformez chaque réunion en action",
  authSubtitle:
    "Transcription pro, résumés et tâches — pour votre flux quotidien.",
  authName: "Votre nom",
  authEmail: "Email pour les mises à jour",
  authSubmit: "Commencer gratuitement",
  authGoogle: "Continuer avec Google",
  navDashboard: "Tableau de bord",
  navHistory: "Historique",
  navSettings: "Paramètres",
  navSignOut: "Déconnexion",
  uploadDrop: "Déposez votre enregistrement ici",
  resDownloadTranscript: "Télécharger la transcription",
  resFullReport: "Rapport complet",
  planUpgrade: "Passer à Pro",
  langLabel: "Langue",
};

const ru: Translations = {
  ...en,
  authTagline: "ИИ студийного уровня",
  authTitle: "Превратите каждую встречу в действие",
  authSubtitle:
    "Профессиональная транскрипция, резюме и задачи — для ежедневной работы.",
  authName: "Ваше имя",
  authEmail: "Email для обновлений",
  authSubmit: "Начать бесплатно",
  authGoogle: "Войти через Google",
  navDashboard: "Панель",
  navHistory: "История",
  navSettings: "Настройки",
  navSignOut: "Выйти",
  uploadDrop: "Перетащите запись сюда",
  resDownloadTranscript: "Скачать транскрипт",
  resFullReport: "Полный отчёт",
  planUpgrade: "Перейти на Pro",
  langLabel: "Язык",
};

export const translations: Record<Locale, Translations> = {
  en,
  he,
  ar,
  es,
  fr,
  ru,
};

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  he: "עברית",
  ar: "العربية",
  es: "Español",
  fr: "Français",
  ru: "Русский",
};

export function detectLocale(): Locale {
  if (typeof window === "undefined") return "en";

  const stored = localStorage.getItem("meetscribe-locale") as Locale | null;
  if (stored && LOCALES.includes(stored)) return stored;

  const browserLang = navigator.language.split("-")[0] as Locale;
  if (LOCALES.includes(browserLang)) return browserLang;

  return "en";
}

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}
