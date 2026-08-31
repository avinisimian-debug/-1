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
  authLiveDownloadsLabel: string;
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
  authStepEmailTitle: string;
  authStepEmailSub: string;
  authStepNameTitle: string;
  authStepNameSub: string;
  authStepOtpTitle: string;
  authStepOtpSub: string;
  authContinue: string;
  authSendCode: string;
  authVerifyCode: string;
  authBack: string;
  authChangeEmail: string;
  authResend: string;
  authResendIn: string;
  authReturningWelcome: string;
  authNameHint: string;
  authEmailPlaceholder: string;
  authOtpRequired: string;
  authOtpInvalid: string;
  authFocusedHeadline: string;
  authFocusedSubhead: string;
  proUnlockedTitle: string;
  proUnlockedCta: string;
  proWelcomeTitle: string;
  proWelcomeBody: string;
  proWelcomeLibraryCta: string;
  proWelcomeDismiss: string;
  // Nav
  navDashboard: string;
  navHistory: string;
  navSettings: string;
  navLive: string;
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
  uploadLinkInvalid: string;
  uploadMicDenied: string;
  langSearchPlaceholder: string;
  langWorldHint: string;
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
  blobBannerTitle: string;
  blobBannerBody: string;
  blobBannerCta: string;
  // Processing
  procWait: string;
  procUploading: string;
  procQueued: string;
  procTranscribing: string;
  procAnalyzing: string;
  procCompleted: string;
  landingGuestTryHint: string;
  landingGuestLimit: string;
  landingGuestSignIn: string;
  liveAttendeesLabel: string;
  liveAttendeesHint: string;
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
  transcriptionErrorYoutubeInvalid: string;
  transcriptionErrorYoutubeUnavailable: string;
  transcriptionErrorYoutubePrivate: string;
  transcriptionErrorYoutubeAge: string;
  transcriptionErrorYoutubeLive: string;
  transcriptionErrorYoutubeTemp: string;
  transcriptionErrorTranscribeFailed: string;
  transcriptionErrorAnalysisFailed: string;
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
  adminSyncSupabase: string;
  adminSyncSupabaseDone: string;
  adminSyncSupabaseError: string;
  adminOpenSupabase: string;
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
  gateQuotaTitle: string;
  gateQuotaLine1: string;
  gateQuotaLine2: string;
  gatePdfTitle: string;
  gatePdfLine1: string;
  gatePdfLine2: string;
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
  workspacePlaybackTip: string;
  workspaceVideoFallback: string;
  workspaceCopyTranscript: string;
  workspaceInteractivePlayer: string;
  chatTitle: string;
  chatSubtitle: string;
  chatPlaceholder: string;
  chatSend: string;
  chatClear: string;
  chatEmpty: string;
  chatThinking: string;
  chatPromptEmail: string;
  chatPromptActions: string;
  chatPromptSwot: string;
  chatPromptLegal: string;
  chatPromptTranslate: string;
  analyticsTitle: string;
  analyticsSpeakers: string;
  analyticsWpm: string;
  analyticsSentiment: string;
  playbackSpeed: string;
  playbackSkipSilence: string;
  globalAiTitle: string;
  globalAiSubtitle: string;
  globalAiPlaceholder: string;
  globalAiAsk: string;
  globalAiEmptyHistory: string;
  workspaceEditableHint: string;
  workspaceSaveTranscript: string;
  workspaceTranscriptSaved: string;
  workspaceTranscriptSaving: string;
  workspaceTranscriptUnsaved: string;
  workspaceAudioMode: string;
  workspaceSeek: string;
  // Live lectures hub
  liveHubBadge: string;
  liveHubTitle: string;
  liveHubDesc: string;
  liveHubUpcoming: string;
  liveHubSessions: string;
  liveHubEmpty: string;
  liveHubScheduleTitle: string;
  liveHubScheduleDesc: string;
  liveHubNewSession: string;
  liveHubCancel: string;
  liveHubSave: string;
  liveHubJoin: string;
  liveHubAddCalendar: string;
  liveHubSetReminder: string;
  liveHubExtras: string;
  liveHubDelete: string;
  liveHubLiveNow: string;
  liveHubEnded: string;
  liveHubMinutes: string;
  liveHubAgenda: string;
  liveHubAgendaEmpty: string;
  liveHubMaterials: string;
  liveHubMaterialsEmpty: string;
  liveHubQa: string;
  liveHubQaEmpty: string;
  liveHubQaPlaceholder: string;
  liveHubQaSend: string;
  liveHubFieldTitle: string;
  liveHubFieldUrl: string;
  liveHubBotTransparency: string;
  liveHubFieldStarts: string;
  liveHubFieldDuration: string;
  liveHubFieldDesc: string;
  liveHubFieldAgenda: string;
  liveHubAgendaPlaceholder: string;
  liveHubFieldMaterialTitle: string;
  liveHubFieldMaterialUrl: string;
  liveHubErrorTitle: string;
  liveHubErrorUrl: string;
  liveHubErrorTime: string;
  liveHubReminderSet: string;
  liveHubReminderDenied: string;
  liveHubReminderUnsupported: string;
  liveHubReminderNow: string;
  liveHubConfigTitle: string;
  liveHubConfigBody: string;
  liveHubShellDesc: string;
  liveHubChipBot: string;
  liveHubChipDigest: string;
  liveHubModeAuto: string;
  liveHubModeManual: string;
  liveHubModeCloseoutOk: string;
  liveHubModeCloseoutMissing: string;
  liveHubEmptyHint: string;
  liveHubHowItWorks: string;
  liveHubHowItWorksManual: string;
  liveHubLoadError: string;
  liveHubRetry: string;
  liveHubCreatedToast: string;
  liveHubDeletedToast: string;
  liveHubDeleteConfirm: string;
  liveHubTitlePlaceholder: string;
  liveHubDetectedPlatform: string;
  liveHubBotAutoJoin: string;
  liveHubBotDiarization: string;
  liveHubBotLanguage: string;
  liveHubMoreOptions: string;
  liveHubScheduling: string;
  liveHubScheduleFail: string;
  liveHubSaveHint: string;
  liveHubOpenCloseout: string;
  liveHubViewStatus: string;
  liveHubUploadRecording: string;
  liveHubMore: string;
  liveHubYou: string;
  liveHubQaFail: string;
  liveHubUploadAuthFail: string;
  liveHubUploadStarted: string;
  liveHubUploadFail: string;
  liveStatusScheduled: string;
  liveStatusDispatching: string;
  liveStatusJoining: string;
  liveStatusRecording: string;
  liveStatusUploading: string;
  liveStatusTranscribing: string;
  liveStatusAnalyzing: string;
  liveStatusReady: string;
  liveStatusFailed: string;
  liveStatusCancelled: string;
  liveStatusAwaitingRecording: string;
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
  liveActivityDownload: string;
}

const en: Translations = {
  authTagline: "Meeting closeout",
  authTitle: "Finish meetings with decisions.",
  authTitleAccent: "Not with a transcript file.",
  authSubtitle:
    "Staz turns meetings into an executive brief, decisions, and tasks — and links each decision to the exact moment it was said.",
  authName: "Your name",
  authEmail: "Email address",
  authSubmit: "Get started free",
  authGoogle: "Continue with Google",
  authGoogleHint: "Quick sign-in with your Google account",
  authEmailOr: "or",
  authEmailSubmit: "Continue with email",
  authCardTitle: "Get started free",
  authCardSubtitle: "Create a free account to process your first meeting — not just the demo.",
  authFreeBadge: "No credit card required",
  authBenefit1: "Experience the executive closeout on your own meeting",
  authBenefit2: "Decisions, actions, and evidence you can click",
  authBenefit3: "Hebrew-first workspace for operators, not students",
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
  authLiveUsers: "{n} users in the community",
  authLiveUsersLabel: "in the community",
  authLiveDownloadsLabel: "downloads today",
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
  authStat1: "Executive briefs",
  authStat2: "Decisions and owners",
  authStat3: "Evidence from transcript",
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
  landingPricingTitle: "One good meeting can save more than the monthly price.",
  landingPricingFreeTitle: "Free — understand the aha",
  landingPricingProTitle: "Pro — work with Staz over time",
  landingPricingFree1: "Brief, decisions, actions, and copy",
  landingPricingFree2: "See the value with no credit card",
  landingPricingPro1: "Cloud meeting library across devices",
  landingPricingPro2: "Higher capacity and retained recordings",
  landingPricingPro3: "Professional PDF for sharing",
  landingPricingEnterprise: "",
  authErrorName: "Please enter your name",
  authErrorEmail: "Please enter a valid email",
  authErrorSignIn: "Sign-in failed. Please try again.",
  authGoogleUnavailable:
    "Google sign-in is not configured. Use email or contact support.",
  authLoading: "Signing in...",
  authStepEmailTitle: "Sign in or create account",
  authStepEmailSub: "Enter your work email — we'll send a quick code.",
  authStepNameTitle: "What's your name?",
  authStepNameSub: "One last step before we send your verification code.",
  authStepOtpTitle: "Enter the code",
  authStepOtpSub: "We sent a 6-digit code to {email}",
  authContinue: "Continue",
  authSendCode: "Send code",
  authVerifyCode: "Verify & sign in",
  authBack: "Back",
  authChangeEmail: "Change email",
  authResend: "Resend code",
  authResendIn: "Resend in {seconds}s",
  authReturningWelcome: "Welcome back, {name}",
  authNameHint: "Shown on your meeting summaries.",
  authEmailPlaceholder: "name@company.com",
  authOtpRequired: "Please enter the verification code.",
  authOtpInvalid: "Invalid or expired code. Request a new one.",
  authFocusedHeadline: "Sign in to close your meetings",
  authFocusedSubhead: "Google or email code — no password to remember.",
  proUnlockedTitle: "Pro is active — here's what's unlocked",
  proUnlockedCta: "Start working →",
  proWelcomeTitle: "Welcome to Pro",
  proWelcomeBody:
    "Your cloud library, larger uploads, PDF export, and deeper analysis are ready.",
  proWelcomeLibraryCta: "Open your meeting library →",
  proWelcomeDismiss: "Dismiss",
  navDashboard: "Closeout",
  navHistory: "Library",
  navSettings: "Settings",
  navLive: "Meeting bot",
  navSignOut: "Sign out",
  navUsers: "Registered Users",
  dashTitle: "Meeting closeout",
  dashDesc: "Executive brief · decisions · owners.",
  dashHero: "Upload a meeting. Get closeout.",
  dashHeroDesc:
    "Executive brief, what was decided, and who owns what — ready to share in minutes.",
  dashNewTranscription: "New meeting",
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
  uploadBrowse: "Drop a recording — or click to browse",
  uploadRecordMic: "Record microphone",
  uploadStopRec: "Stop recording",
  uploadPasteLink: "Paste web link",
  uploadLinkPlaceholder: "https://… direct MP3/MP4, Dropbox, Drive, or YouTube URL",
  uploadLinkSubmit: "Process link",
  uploadLinkSoonTitle: "Link import",
  uploadLinkSoonDesc:
    "Paste a direct media URL (.mp3/.mp4) or a public YouTube link.",
  uploadLinkInvalid: "Please paste a valid https:// URL.",
  uploadMicDenied: "Microphone access was denied. Check browser permissions.",
  langSearchPlaceholder: "Search languages…",
  langWorldHint: "{count} languages supported via Whisper",
  commandPaletteTitle: "Search workspace",
  commandPalettePlaceholder: "Search meetings, decisions, tasks…",
  commandPaletteEmpty: "No matches in your library.",
  commandPaletteHint: "⌘K",
  inspectorQuota: "Usage this month",
  inspectorPlan: "Current plan",
  inspectorRecent: "Recent",
  inspectorEmpty: "No meetings yet. Upload your first recording.",
  uploadMax: "Max",
  uploadFileSizeNote: "Up to {size} per file",
  uploadDurationNote: "Up to {duration} per recording · {plan}",
  uploadUpgrade: "for 500 MB & 3+ hour videos",
  uploadUpgradeLink: "Upgrade to Pro",
  uploadErrorType: "Please upload an MP3, WAV, MP4, or M4A file.",
  uploadErrorSize: "File exceeds the free tier limit. Upgrade to Pro for files up to 500 MB.",
  uploadErrorSizePro: "File exceeds the limit.",
  blobBannerTitle: "Video uploads need Vercel Blob",
  blobBannerBody:
    "Production is missing BLOB_READ_WRITE_TOKEN. Connect Blob in Vercel (Storage → Blob → Connect to this project), then Redeploy. Until then only files under ~4 MB will work.",
  blobBannerCta: "Open Vercel Dashboard",
  procWait: "Processing your recording — longer files may take a few minutes.",
  procUploading: "Uploading...",
  procQueued: "Queued for processing...",
  procTranscribing: "Transcribing audio using AI...",
  procAnalyzing: "Summarizing & extracting insights...",
  procCompleted: "Completed",
  landingGuestTryHint: "Try a short clip free — no account needed (max 4 MB).",
  landingGuestLimit: "Guest trial is limited to 4 MB. Sign in for full uploads.",
  landingGuestSignIn: "Create a free account to save history & unlock Pro.",
  liveAttendeesLabel: "Attendee emails (optional)",
  liveAttendeesHint: "Comma-separated. Digests are emailed when the bot finishes.",
  resComplete: "Closeout ready",
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
  resNewUpload: "New meeting",
  resSummary: "Closeout",
  resActions: "Who owns what",
  resTranscript: "What was said",
  resExecutive: "Executive brief",
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
  resDecisions: "What was decided",
  resKeyQuotes: "Key quotes",
  resRisks: "Risks & open questions",
  resFollowUpEmail: "Follow-up email",
  resCopyEmail: "Copy email",
  resSentiment: "Meeting Tone",
  resCopySummary: "Copy brief",
  resCopied: "Copied!",
  resMarkdownBrief: "Professional brief (Markdown)",
  resSearchTranscript: "Search what was said...",
  resNoResults: "No matching lines found.",
  resPriorityHigh: "High",
  resPriorityMedium: "Medium",
  resPriorityLow: "Low",
  pdfBrand: "Meeting closeout",
  pdfTagline: "Executive brief · decisions · owners",
  pdfDurationLabel: "Duration",
  pdfProcessedLabel: "Processed",
  pdfOwner: "Owner",
  pdfDeadline: "Deadline",
  pdfPending: "Pending",
  pdfGeneratedBy: "Generated by Staz AI",
  planFree: "Free Plan",
  planPro: "Pro Plan",
  planUpgrade: "Continue with Pro",
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
  settingsDesc: "Plan, billing, and account",
  settingsPlan: "Your Plan",
  settingsProfile: "Profile",
  settingsNotifications: "Notifications",
  settingsBilling: "Billing",
  settingsSecurity: "Security",
  settingsProActive: "Pro active — upload videos up to 500 MB",
  settingsNameLabel: "Name",
  settingsEmailLabel: "Email",
  settingsNotificationsBody: "Product updates enabled for {email}",
  settingsBasicPlan: "Free — $0",
  settingsProPlanLine: "Pro Plan — {price}/month",
  settingsManagePayPal: "Your monthly Pro subscription is managed via PayPal.",
  settingsProBillingScheduled: "Pro is active — $24.90/month.",
  settingsProLifetime: "Pro is active on this account.",
  billingSetupRequiredTitle: "Upgrade to Staz Pro",
  billingSetupRequiredDesc:
    "Subscribe with PayPal below for {price}/month — meetings stay on your account.",
  paypalCancelled: "PayPal checkout was cancelled. Your plan stays Free.",
  pricingProLaunchNote: "Pro — {regular}/month.",
  historyTitle: "Meeting library",
  historyDesc: "Your cloud meetings — available from any device.",
  historySearch: "Search history...",
  historyRecordings: "recordings",
  historyEmpty: "Your first meeting starts here. Upload a recording to build your closeout library.",
  historyView: "View",
  historyDelete: "Delete",
  historyLimitNote: "Free saves last 5 · Pro saves last 50",
  searchPlaceholder: "Search meetings...",
  studioGrade: "Closeout",
  tryAgain: "Try Again",
  transcriptionFailed: "Transcription failed",
  transcriptionFailedSubtitle: "We kept your link — you can retry or try another source.",
  transcriptionErrorGeneric:
    "We couldn't finish processing this recording. Please try again in a moment.",
  transcriptionErrorNetwork:
    "Connection was interrupted during upload. Check your network and try again.",
  transcriptionErrorTimeout:
    "Processing took too long. Shorter clips work best on the free plan.",
  transcriptionErrorEmpty:
    "No speech was detected in this file. Try a recording with clearer audio.",
  transcriptionErrorVideo:
    "We had trouble reading the audio track in this video. Try exporting MP3/WAV and upload again.",
  transcriptionErrorYoutubeInvalid:
    "The link you entered does not look like a valid YouTube URL.",
  transcriptionErrorYoutubeUnavailable:
    "This video is not available for processing. Try a public link, or download the audio and upload an MP3/MP4.",
  transcriptionErrorYoutubePrivate:
    "This video is private and cannot be processed. Try a public link.",
  transcriptionErrorYoutubeAge:
    "This video is age-restricted and cannot be processed automatically. Download the audio and upload the file.",
  transcriptionErrorYoutubeLive:
    "Live streams are not supported yet. Wait until the stream ends, or upload a recording.",
  transcriptionErrorYoutubeTemp:
    "We couldn't process this video right now. Please try again in a moment.",
  transcriptionErrorTranscribeFailed:
    "We got the media, but transcription failed. Please try again.",
  transcriptionErrorAnalysisFailed:
    "Transcription finished, but insight processing failed. Please try again.",
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
    "Large uploads are not configured. In Vercel: Storage → Blob → Connect to this project (sets BLOB_READ_WRITE_TOKEN) → Redeploy. Files under ~4 MB still work without Blob.",
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
  adminSyncSupabase: "Sync to Supabase",
  adminSyncSupabaseDone: "Users synced to Supabase",
  adminSyncSupabaseError: "Supabase sync failed",
  adminOpenSupabase: "Open in Supabase",
  paypalTitle: "Upgrade with PayPal",
  paypalDesc:
    "PayPal only — one secure payment. Pro is yours forever — no monthly subscription.",
  paypalPay: "Pay with PayPal",
  paypalSuccess: "Pro is active — $24.90/month. Your meetings stay on this account.",
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
  shareDesc: "This meeting stays in your account. There is no public share URL.",
  sharePrivate: "Private",
  sharePublicLink: "Public link (not available)",
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
  gateQuotaTitle: "Keep every meeting in your workspace",
  gateQuotaLine1: "Free is for experiencing the closeout. Pro keeps the library.",
  gateQuotaLine2: "Staz Pro unlocks more meetings, cloud memory, and professional send.",
  gatePdfTitle: "Professional executive PDF",
  gatePdfLine1: "Copy the brief for free. PDF is the sendable artifact for clients.",
  gatePdfLine2: "Included with Staz Pro — upgrade to unlock professional PDF.",
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
  workspacePlaybackTip: "For Zoom: download the MP4 (H.264) or M4A locally, then upload. Cloud Zoom links are not playable in-browser.",
  workspaceVideoFallback: "Video codec not supported in this browser — playing audio track only (common with Zoom HEVC/MOV).",
  workspaceCopyTranscript: "Copy transcript",
  workspaceInteractivePlayer: "Sync player",
  chatTitle: "Talk to transcript",
  chatSubtitle: "Ask anything · citations jump to audio",
  chatPlaceholder: "What did they decide about budget?",
  chatSend: "Send",
  chatClear: "Clear chat",
  chatEmpty: "Ask a question or tap a one-click prompt below.",
  chatThinking: "Thinking with your transcript…",
  chatPromptEmail: "Draft follow-up email",
  chatPromptActions: "Extract action items",
  chatPromptSwot: "SWOT analysis",
  chatPromptLegal: "Takeaways & risks",
  chatPromptTranslate: "Translate key points",
  analyticsTitle: "Speaker analytics",
  analyticsSpeakers: "speakers",
  analyticsWpm: "WPM",
  analyticsSentiment: "Tone",
  playbackSpeed: "Playback speed",
  playbackSkipSilence: "Skip silence",
  globalAiTitle: "Ask across meetings",
  globalAiSubtitle: "Search insights from your full history",
  globalAiPlaceholder: "Find meetings about Q3 strategy…",
  globalAiAsk: "Ask AI",
  globalAiEmptyHistory: "No saved transcripts yet. Transcribe a meeting first.",
  workspaceEditableHint: "Click any line to edit — changes auto-save and apply to exports.",
  workspaceSaveTranscript: "Save changes",
  workspaceTranscriptSaved: "All changes saved",
  workspaceTranscriptSaving: "Saving…",
  workspaceTranscriptUnsaved: "Unsaved changes",
  workspaceAudioMode: "Audio recording — use the controls below to play",
  workspaceSeek: "Seek",
  liveHubBadge: "Meeting bot",
  liveHubTitle: "Meeting bot",
  liveHubDesc:
    "Paste a Zoom, Meet, or Teams link. The bot joins quietly, then Staz closes the meeting with a brief, decisions, and owners.",
  liveHubUpcoming: "Your meetings",
  liveHubSessions: "meetings",
  liveHubEmpty: "No meetings yet",
  liveHubScheduleTitle: "Schedule a meeting",
  liveHubScheduleDesc:
    "Three fields are enough to start. Optional details are under “More options”.",
  liveHubNewSession: "New meeting",
  liveHubCancel: "Close",
  liveHubSave: "Schedule meeting",
  liveHubJoin: "Join meeting",
  liveHubAddCalendar: "Google Calendar",
  liveHubSetReminder: "Reminder",
  liveHubExtras: "Agenda & Q&A",
  liveHubDelete: "Delete",
  liveHubLiveNow: "Live now",
  liveHubEnded: "Ended",
  liveHubMinutes: "min",
  liveHubAgenda: "Agenda",
  liveHubAgendaEmpty: "No agenda items yet.",
  liveHubMaterials: "Materials",
  liveHubMaterialsEmpty: "No downloadable materials attached.",
  liveHubQa: "Live Q&A",
  liveHubQaEmpty: "Ask the first question to start the thread.",
  liveHubQaPlaceholder: "Type a question…",
  liveHubQaSend: "Send",
  liveHubFieldTitle: "Meeting title",
  liveHubFieldUrl: "Meeting link",
  liveHubBotTransparency:
    "Staz joins as a quiet participant — records and listens only. When the meeting ends you get a closeout: decisions, owners, and evidence from the transcript.",
  liveHubFieldStarts: "Starts at",
  liveHubFieldDuration: "Duration (minutes)",
  liveHubFieldDesc: "Description",
  liveHubFieldAgenda: "Agenda (one item per line)",
  liveHubAgendaPlaceholder: "Welcome\nDeep dive\nQ&A",
  liveHubFieldMaterialTitle: "Material title",
  liveHubFieldMaterialUrl: "Material URL",
  liveHubErrorTitle: "Please enter a meeting title.",
  liveHubErrorUrl:
    "Enter a valid Zoom, Google Meet, Teams, RTMP, or WebRTC link.",
  liveHubErrorTime: "Choose a start date and time.",
  liveHubReminderSet: "Reminder set (5 minutes before start).",
  liveHubReminderDenied: "Notification permission denied.",
  liveHubReminderUnsupported: "Browser notifications are not supported.",
  liveHubReminderNow: "Starting soon — join: {url}",
  liveHubConfigTitle: "Bot & pipeline",
  liveHubConfigBody:
    "Keep this page open near start time so the bot can dispatch. If auto-join is not configured, upload the recording after the call.",
  liveHubShellDesc: "Schedule · bot joins · closeout ready",
  liveHubChipBot: "Quiet auto-join",
  liveHubChipDigest: "Executive closeout after",
  liveHubModeAuto: "Auto-join on",
  liveHubModeManual: "Upload mode — add Recall key for auto-join",
  liveHubModeCloseoutOk: "Closeout pipeline ready",
  liveHubModeCloseoutMissing: "Closeout keys incomplete",
  liveHubEmptyHint:
    "Schedule a meeting with a link — the bot handles recording and closeout.",
  liveHubHowItWorks:
    "The bot joins ~2 minutes before start. Keep this page open around start time so dispatch can run (Hobby cron is once/day).",
  liveHubHowItWorksManual:
    "Auto-join needs RECALL_AI_API_KEY. Until then: after the call, upload the recording here for automatic closeout.",
  liveHubLoadError: "Could not load meetings.",
  liveHubRetry: "Retry",
  liveHubCreatedToast: "Meeting scheduled",
  liveHubDeletedToast: "Meeting deleted",
  liveHubDeleteConfirm: "Delete this meeting?",
  liveHubTitlePlaceholder: "e.g. Weekly product sync",
  liveHubDetectedPlatform: "Detected: {platform}",
  liveHubBotAutoJoin: "Auto-join bot",
  liveHubBotDiarization: "Speaker labels",
  liveHubBotLanguage: "Language",
  liveHubMoreOptions: "More options",
  liveHubScheduling: "Scheduling…",
  liveHubScheduleFail: "Could not schedule the meeting.",
  liveHubSaveHint: "The bot joins ~2 minutes before start when connected.",
  liveHubOpenCloseout: "Open closeout",
  liveHubViewStatus: "View status",
  liveHubUploadRecording: "Upload recording",
  liveHubMore: "More",
  liveHubYou: "You",
  liveHubQaFail: "Could not post question.",
  liveHubUploadAuthFail: "Upload authorization failed.",
  liveHubUploadStarted: "Recording uploaded — closeout started",
  liveHubUploadFail: "Upload failed",
  liveStatusScheduled: "Scheduled",
  liveStatusDispatching: "Sending bot…",
  liveStatusJoining: "Joining…",
  liveStatusRecording: "Recording",
  liveStatusUploading: "Uploading…",
  liveStatusTranscribing: "Transcribing…",
  liveStatusAnalyzing: "Building closeout…",
  liveStatusReady: "Closeout ready",
  liveStatusFailed: "Failed",
  liveStatusCancelled: "Cancelled",
  liveStatusAwaitingRecording: "Awaiting recording",
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
  pricingBasicName: "Free",
  pricingBasicDesc: "Enough to close one meeting and feel the aha.",
  pricingBasicOutcome1: "Executive brief, decisions and actions",
  pricingBasicOutcome2: "Click evidence when the match is real",
  pricingBasicOutcome3: "Copy the closeout to your team",
  pricingBasicCta: "Process a meeting",
  pricingProName: "Pro",
  pricingProDesc: "Your meeting memory — not a transcription meter.",
  pricingProOutcome1: "Cloud library on every device",
  pricingProOutcome2: "Professional PDF and retained recordings",
  pricingProOutcome3: "100 meetings/month · files up to 500 MB",
  pricingProCta: "Upgrade to Pro",
  pricingEnterpriseName: "Enterprise",
  pricingEnterpriseDesc: "For teams that need scale, control, and dedicated support.",
  pricingEnterpriseOutcome1: "Standardize insights across your entire organization",
  pricingEnterpriseOutcome2: "Onboard teams in days, not weeks",
  pricingEnterpriseOutcome3: "Dedicated support with SLA guarantees",
  pricingEnterpriseCta: "Contact sales",
  onboardTag: "Quick start",
  onboardTitle: "Your first closeout in three steps",
  onboardSubtitle: "Complete these 3 steps to unlock the full power of Staz AI.",
  onboardProgress: "Setup progress",
  onboardDismiss: "I'll finish this later",
  onboardExpand: "Expand",
  onboardHide: "Hide",
  onboardComplete: "You're all set!",
  onboardCompleteDesc: "You're ready. Upload a meeting and send the closeout.",
  onboardStep1Title: "Confirm your account",
  onboardStep1Desc: "Make sure your name and email are correct.",
  onboardStep1Outcome: "Ready to save meetings to your account",
  onboardStep1Cta: "Open settings",
  onboardStep2Title: "Upload a meeting",
  onboardStep2Desc: "Drop a recording — Staz builds the executive closeout.",
  onboardStep2Outcome: "Summary, decisions, and tasks in one place",
  onboardStep2Cta: "Upload meeting",
  onboardStep3Title: "Review and share",
  onboardStep3Desc: "Copy the brief or send decisions to your team.",
  onboardStep3Outcome: "Closeout ready to send",
  onboardStep3Cta: "Open closeout",
  onboardStep3Waiting: "Upload a meeting — the closeout appears here.",
  gateEyebrow: "Unlock your meeting library",
  gateStartTrial: "Upgrade to Pro",
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
  trustTeamsCount: "Built for Hebrew-speaking teams",
  liveActivityLabel: "Live activity",
  liveActivityDismiss: "Dismiss",
  liveActivityJustNow: "Just now",
  liveActivityMinutesAgo: "{n} min ago",
  liveActivitySignup: "{name} from {location} just signed up",
  liveActivityTranscription: "{name} from {location} completed a transcription",
  liveActivityUpgrade: "{name} from {location} upgraded to Pro",
  liveActivityExport: "{name} from {location} exported a PDF report",
  liveActivityDownload: "{name} from {location} downloaded a file",
};

const he: Translations = {
  authTagline: "עוזר הסגירה של הפגישה",
  authTitle: "מסיימים פגישה עם החלטות.",
  authTitleAccent: "לא עם קובץ תמלול.",
  authSubtitle:
    "Staz הופך פגישות לתמצית מנהלים, החלטות ומשימות — ומחבר כל החלטה לרגע שבו היא נאמרה.",
  authName: "השם שלך",
  authEmail: "כתובת אימייל",
  authSubmit: "התחילו בחינם",
  authGoogle: "המשיכו עם Google",
  authGoogleHint: "התחברות מהירה עם חשבון Google שלך",
  authEmailOr: "או",
  authEmailSubmit: "המשיכו עם אימייל",
  authCardTitle: "התחילו בחינם",
  authCardSubtitle: "צרו חשבון חינמי כדי לעבד את הפגישה שלכם — לא רק את הדמו.",
  authFreeBadge: "ללא צורך בכרטיס אשראי",
  authBenefit1: "חווים סגירת מנהלים על הפגישה שלכם",
  authBenefit2: "החלטות, משימות וראיות שאפשר ללחוץ",
  authBenefit3: "סביבת עבודה בעברית למנהלים, לא לסטודנטים",
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
  authLiveUsers: "{n} משתמשים בקהילה",
  authLiveUsersLabel: "בקהילה",
  authLiveDownloadsLabel: "הורדות היום",
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
  authStat1: "תמצית מנהלים",
  authStat2: "החלטות ומשימות",
  authStat3: "ראיות מהתמלול",
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
  landingPricingTitle: "פגישה אחת טובה יכולה לחסוך יותר מהמחיר החודשי.",
  landingPricingFreeTitle: "חינמי — להבין את ה-Aha",
  landingPricingProTitle: "Pro — לעבוד עם Staz לאורך זמן",
  landingPricingFree1: "תמצית, החלטות, משימות והעתקה",
  landingPricingFree2: "להבין את הערך בלי כרטיס אשראי",
  landingPricingPro1: "ספריית פגישות בענן וגישה מכל מכשיר",
  landingPricingPro2: "נפח עבודה גבוה יותר ושמירת הקלטות",
  landingPricingPro3: "PDF מקצועי לשיתוף",
  landingPricingEnterprise: "",
  authErrorName: "נא להזין שם",
  authErrorEmail: "נא להזין אימייל תקין",
  authErrorSignIn: "ההתחברות נכשלה. נסו שוב.",
  authGoogleUnavailable:
    "התחברות עם Google לא מוגדרת. השתמש באימייל או פנה לתמיכה.",
  authLoading: "מתחבר...",
  authStepEmailTitle: "כניסה או הרשמה",
  authStepEmailSub: "הזינו אימייל עבודה — נשלח קוד קצר.",
  authStepNameTitle: "איך קוראים לכם?",
  authStepNameSub: "שלב אחרון לפני שליחת קוד האימות.",
  authStepOtpTitle: "הזינו את הקוד",
  authStepOtpSub: "שלחנו קוד בן 6 ספרות ל־{email}",
  authContinue: "המשך",
  authSendCode: "שלחו קוד",
  authVerifyCode: "אימות וכניסה",
  authBack: "חזרה",
  authChangeEmail: "שנו אימייל",
  authResend: "שלחו קוד שוב",
  authResendIn: "שליחה חוזרת בעוד {seconds} שנ׳",
  authReturningWelcome: "שמחים לראות אתכם שוב, {name}",
  authNameHint: "יופיע בתמציות הפגישות שלכם.",
  authEmailPlaceholder: "name@company.co.il",
  authOtpRequired: "נא להזין את קוד האימות.",
  authOtpInvalid: "קוד שגוי או שפג תוקפו. בקשו קוד חדש.",
  authFocusedHeadline: "התחברו לסגירת הפגישות",
  authFocusedSubhead: "Google או קוד באימייל — בלי סיסמה לזכור.",
  proUnlockedTitle: "Pro פעיל — זה מה שפתוח לכם עכשיו",
  proUnlockedCta: "התחילו לעבוד →",
  proWelcomeTitle: "ברוכים הבאים ל-Pro",
  proWelcomeBody:
    "ספריית הענן, העלאות גדולות יותר, ייצוא PDF וניתוח מעמיק — הכל מוכן.",
  proWelcomeLibraryCta: "לספריית הפגישות →",
  proWelcomeDismiss: "סגירה",
  navDashboard: "סגירת פגישה",
  navHistory: "ספרייה",
  navSettings: "הגדרות",
  navLive: "בוט פגישות",
  navSignOut: "התנתק",
  navUsers: "משתמשים רשומים",
  dashTitle: "סגירת פגישה",
  dashDesc: "תמצית מנהלים · מה הוחלט · מי עושה מה.",
  dashHero: "העלו פגישה. קבלו סגירה.",
  dashHeroDesc:
    "תמצית מנהלים, מה הוחלט ומי עושה מה — מוכנים לשליחה תוך דקות.",
  dashNewTranscription: "פגישה חדשה",
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
  uploadBrowse: "גררו הקלטה — או לחצו לבחירת קובץ",
  uploadRecordMic: "הקלט ממיקרופון",
  uploadStopRec: "עצור הקלטה",
  uploadPasteLink: "הדבק קישור",
  uploadLinkPlaceholder: "https://… קישור ישיר ל-MP3/MP4, Dropbox, Drive או YouTube",
  uploadLinkSubmit: "עיבוד מהקישור",
  uploadLinkSoonTitle: "ייבוא מקישור",
  uploadLinkSoonDesc:
    "הדביקו קישור מדיה ישיר (.mp3/.mp4) או קישור YouTube ציבורי.",
  uploadLinkInvalid: "נא להדביק כתובת https:// תקינה.",
  uploadMicDenied: "הגישה למיקרופון נדחתה. בדקו את הרשאות הדפדפן.",
  langSearchPlaceholder: "חיפוש שפות…",
  langWorldHint: "{count} שפות נתמכות דרך Whisper",
  commandPaletteTitle: "חיפוש בסביבת העבודה",
  commandPalettePlaceholder: "חיפוש פגישות, החלטות ומשימות…",
  commandPaletteEmpty: "אין תוצאות בספרייה.",
  commandPaletteHint: "⌘K",
  inspectorQuota: "שימוש החודש",
  inspectorPlan: "החבילה הנוכחית",
  inspectorRecent: "אחרונים",
  inspectorEmpty: "עדיין אין פגישות. העלו את ההקלטה הראשונה.",
  uploadMax: "מקסימום",
  uploadFileSizeNote: "עד {size} לקובץ",
  uploadDurationNote: "עד {duration} להקלטה · {plan}",
  uploadUpgrade: "ל-500 MB וסרטונים של 3+ שעות",
  uploadUpgradeLink: "שדרג ל-Pro",
  uploadErrorType: "נא להעלות MP3, WAV, MP4 או M4A.",
  uploadErrorSize: "הקובץ חורג ממגבלת החינם. שדרג ל-Pro עד 500 MB.",
  uploadErrorSizePro: "הקובץ חורג מהמגבלה.",
  blobBannerTitle: "העלאת וידאו דורשת Vercel Blob",
  blobBannerBody:
    "בפרודקשן חסר BLOB_READ_WRITE_TOKEN. חברו Blob ב-Vercel (Storage → Blob → Connect לפרויקט) ואז Redeploy. עד אז יעבדו רק קבצים מתחת ל־4 MB בערך.",
  blobBannerCta: "פתיחת Vercel Dashboard",
  procWait: "מעבד את ההקלטה — קבצים ארוכים עשויים לקחת כמה דקות.",
  procUploading: "מעלה...",
  procQueued: "בתור לעיבוד...",
  procTranscribing: "מתמלל באמצעות AI...",
  procAnalyzing: "מסכם ומחלץ תובנות...",
  procCompleted: "הושלם",
  landingGuestTryHint: "נסו קליפ קצר בחינם — בלי חשבון (עד 4MB).",
  landingGuestLimit: "ניסיון אורח מוגבל ל־4MB. התחברו להעלאות מלאות.",
  landingGuestSignIn: "צרו חשבון חינם לשמירת היסטוריה ולפתיחת Pro.",
  liveAttendeesLabel: "אימיילים של משתתפים (אופציונלי)",
  liveAttendeesHint: "מופרדים בפסיקים. סיכום יישלח כשהבוט מסיים.",
  resComplete: "הסגירה מוכנה",
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
  resNewUpload: "פגישה חדשה",
  resSummary: "תמצית",
  resActions: "מי עושה מה",
  resTranscript: "מה באמת נאמר",
  resExecutive: "תמצית מנהלים",
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
  resDecisions: "מה הוחלט",
  resKeyQuotes: "ציטוטים מרכזיים",
  resRisks: "סיכונים ושאלות פתוחות",
  resFollowUpEmail: "מייל המשך",
  resCopyEmail: "העתק מייל",
  resSentiment: "אווירת הפגישה",
  resCopySummary: "העתק תמצית",
  resCopied: "הועתק!",
  resMarkdownBrief: "תמצית מקצועית (Markdown)",
  resSearchTranscript: "חיפוש במה שנאמר...",
  resNoResults: "לא נמצאו תוצאות.",
  resPriorityHigh: "גבוהה",
  resPriorityMedium: "בינונית",
  resPriorityLow: "נמוכה",
  pdfBrand: "סגירת פגישה",
  pdfTagline: "תמצית מנהלים · החלטות · משימות",
  pdfDurationLabel: "משך",
  pdfProcessedLabel: "עובד",
  pdfOwner: "אחראי",
  pdfDeadline: "דדליין",
  pdfPending: "ממתין",
  pdfGeneratedBy: "נוצר על ידי Staz AI",
  planFree: "חבילה חינמית",
  planPro: "חבילת Pro",
  planUpgrade: "עברו ל-Pro",
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
  settingsDesc: "חבילה, חיוב וחשבון",
  settingsPlan: "החבילה שלך",
  settingsProfile: "פרופיל",
  settingsNotifications: "התראות",
  settingsBilling: "חיוב",
  settingsSecurity: "אבטחה",
  settingsProActive: "Pro פעיל — העלאה עד 500 MB",
  settingsNameLabel: "שם",
  settingsEmailLabel: "אימייל",
  settingsNotificationsBody: "עדכוני מוצר פעילים עבור {email}",
  settingsBasicPlan: "חינמי — $0",
  settingsProPlanLine: "חבילת Pro — {price} לחודש",
  settingsManagePayPal: "מנוי Pro החודשי מנוהל דרך PayPal.",
  settingsProBillingScheduled: "Pro פעיל — מנוי חודשי ב-$24.90.",
  settingsProLifetime: "Pro פעיל בחשבון זה.",
  billingSetupRequiredTitle: "שדרגו ל-Staz Pro",
  billingSetupRequiredDesc:
    "מנוי חודשי ב-{price} דרך PayPal — הפגישות נשמרות בחשבון שלכם.",
  paypalCancelled: "התשלום ב-PayPal בוטל. נשארתם בתוכנית החינמית.",
  pricingProLaunchNote: "Pro — {regular}/חודש.",
  historyTitle: "ספריית פגישות",
  historyDesc: "הפגישות שלכם בענן — זמינות גם ממכשיר אחר.",
  historySearch: "חיפוש בהיסטוריה...",
  historyRecordings: "הקלטות",
  historyEmpty: "הפגישה הראשונה שלכם מתחילה כאן. העלו הקלטה כדי לבנות ספריית סגירות.",
  historyView: "צפייה",
  historyDelete: "מחק",
  historyLimitNote: "חינם שומר 5 אחרונים · Pro שומר 50",
  searchPlaceholder: "חיפוש פגישות...",
  studioGrade: "סגירה",
  tryAgain: "נסו שוב",
  transcriptionFailed: "התמלול נכשל",
  transcriptionFailedSubtitle: "שמרנו את הקישור — אפשר לנסות שוב או להחליף מקור.",
  transcriptionErrorGeneric:
    "לא הצלחנו לסיים את העיבוד. נסו שוב בעוד רגע.",
  transcriptionErrorNetwork:
    "החיבור נותק במהלך ההעלאה. בדקו את הרשת ונסו שוב.",
  transcriptionErrorTimeout:
    "העיבוד ארך יותר מדי. בחבילה החינמית קטעים קצרים עובדים הכי טוב.",
  transcriptionErrorEmpty:
    "לא זוהתה דיבור בקובץ. נסו הקלטה עם שמע ברור יותר.",
  transcriptionErrorVideo:
    "לא הצלחנו לקרוא את ערוץ השמע בסרטון. נסו לייצא MP3/WAV ולהעלות שוב.",
  transcriptionErrorYoutubeInvalid:
    "הקישור שהוזן לא נראה כמו קישור YouTube תקין.",
  transcriptionErrorYoutubeUnavailable:
    "הסרטון הזה לא זמין לעיבוד. נסו קישור ציבורי אחר, או הורידו את האודיו והעלו MP3/MP4.",
  transcriptionErrorYoutubePrivate:
    "הסרטון פרטי ולא זמין לעיבוד. נסו קישור ציבורי אחר.",
  transcriptionErrorYoutubeAge:
    "הסרטון מוגבל לגיל ולא ניתן לעיבוד אוטומטי. הורידו את האודיו והעלו קובץ.",
  transcriptionErrorYoutubeLive:
    "שידורים חיים לא נתמכים כרגע. המתינו לסיום השידור או העלו הקלטה.",
  transcriptionErrorYoutubeTemp:
    "לא הצלחנו לעבד את הסרטון כרגע. נסו שוב בעוד רגע.",
  transcriptionErrorTranscribeFailed:
    "הצלחנו לקבל את הסרטון, אבל הייתה בעיה ביצירת התמלול. נסו שוב.",
  transcriptionErrorAnalysisFailed:
    "התמלול הושלם, אבל עיבוד התובנות נכשל. נסו שוב.",
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
    "העלאות גדולות לא מוגדרות. ב-Vercel: Storage → Blob → Connect לפרויקט (יוצר BLOB_READ_WRITE_TOKEN) → Redeploy. קבצים מתחת ל־4 MB עדיין עובדים בלי Blob.",
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
  adminSyncSupabase: "סנכרון ל-Supabase",
  adminSyncSupabaseDone: "המשתמשים סונכרנו ל-Supabase",
  adminSyncSupabaseError: "סנכרון Supabase נכשל",
  adminOpenSupabase: "פתיחה ב-Supabase",
  paypalTitle: "שדרוג עם PayPal",
  paypalDesc:
    "רק PayPal — תשלום מאובטח אחד. Pro שלכם לנצח — בלי מנוי חודשי.",
  paypalPay: "שלמו עם PayPal",
  paypalSuccess: "Pro הופעל — $24.90 לחודש. הפגישות נשמרות בחשבון שלכם.",
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
  shareDesc: "הפגישה נשארת בחשבון שלכם. אין קישור ציבורי לשיתוף.",
  sharePrivate: "פרטי",
  sharePublicLink: "קישור ציבורי (לא זמין)",
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
  gateQuotaTitle: "שמרו את הפגישות בספרייה",
  gateQuotaLine1: "החינמי נועד לחוות את הסגירה. Pro שומר את הזיכרון.",
  gateQuotaLine2: "Staz Pro פותח יותר פגישות, ספריית ענן ושליחה מקצועית.",
  gatePdfTitle: "PDF מנהלים מקצועי",
  gatePdfLine1: "העתקת הסיכום נשארת בחינם. PDF הוא מה ששולחים ללקוח.",
  gatePdfLine2: "כלול ב-Staz Pro — שדרגו כדי לפתוח PDF מקצועי.",
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
  workspacePlaybackTip: "לזום: הורידו MP4 (H.264) או M4A למחשב והעלו. קישורי Zoom בענן לא ניתנים לניגון בדפדפן.",
  workspaceVideoFallback: "קודק הווידאו לא נתמך בדפדפן — מנגנים אודיו בלבד (נפוץ ב-Zoom HEVC/MOV).",
  workspaceCopyTranscript: "העתק תמלול",
  workspaceInteractivePlayer: "נגן מסונכרן",
  chatTitle: "שיחה עם התמלול",
  chatSubtitle: "שאלו הכל · ציטוטים קופצים לאודיו",
  chatPlaceholder: "מה הוחלט לגבי התקציב?",
  chatSend: "שלח",
  chatClear: "נקה שיחה",
  chatEmpty: "שאלו שאלה או בחרו פרומפט מוכן.",
  chatThinking: "חושב על בסיס התמלול…",
  chatPromptEmail: "טיוטת מייל המשך",
  chatPromptActions: "חלץ משימות",
  chatPromptSwot: "ניתוח SWOT",
  chatPromptLegal: "תובנות וסיכונים",
  chatPromptTranslate: "תרגם נקודות מפתח",
  analyticsTitle: "אנליטיקת דוברים",
  analyticsSpeakers: "דוברים",
  analyticsWpm: "מילים/דקה",
  analyticsSentiment: "טון",
  playbackSpeed: "מהירות נגינה",
  playbackSkipSilence: "דלג על שקט",
  globalAiTitle: "שאלו על כל הפגישות",
  globalAiSubtitle: "חיפוש תובנות מכל ההיסטוריה",
  globalAiPlaceholder: "מצא פגישות על אסטרטגיית Q3…",
  globalAiAsk: "שאל את ה-AI",
  globalAiEmptyHistory: "עדיין אין תמלולים. תמללו פגישה קודם.",
  workspaceEditableHint: "לחצו על שורה לעריכה — השינויים נשמרים אוטומטית ומשפיעים על הייצוא.",
  workspaceSaveTranscript: "שמור שינויים",
  workspaceTranscriptSaved: "כל השינויים נשמרו",
  workspaceTranscriptSaving: "שומר…",
  workspaceTranscriptUnsaved: "שינויים שלא נשמרו",
  workspaceAudioMode: "הקלטת אודיו — השתמשו בפקדים למטה לניגון",
  workspaceSeek: "גלילה",
  liveHubBadge: "בוט פגישות",
  liveHubTitle: "בוט פגישות",
  liveHubDesc:
    "הדביקו קישור Zoom, Meet או Teams. הבוט מצטרף בשקט — ואז Staz סוגר את הפגישה עם תמצית, החלטות ואחראים.",
  liveHubUpcoming: "הפגישות שלכם",
  liveHubSessions: "פגישות",
  liveHubEmpty: "אין עדיין פגישות",
  liveHubScheduleTitle: "תזמון פגישה",
  liveHubScheduleDesc:
    "שלושה שדות מספיקים להתחלה. פרטים נוספים נמצאים תחת «אפשרויות נוספות».",
  liveHubNewSession: "פגישה חדשה",
  liveHubCancel: "סגירה",
  liveHubSave: "תזמון פגישה",
  liveHubJoin: "הצטרפות לפגישה",
  liveHubAddCalendar: "יומן Google",
  liveHubSetReminder: "תזכורת",
  liveHubExtras: "אג׳נדה ושאלות",
  liveHubDelete: "מחיקה",
  liveHubLiveNow: "בשידור חי",
  liveHubEnded: "הסתיים",
  liveHubMinutes: "דק׳",
  liveHubAgenda: "אג׳נדה",
  liveHubAgendaEmpty: "אין פריטי אג׳נדה עדיין.",
  liveHubMaterials: "חומרים",
  liveHubMaterialsEmpty: "לא צורפו חומרים להורדה.",
  liveHubQa: "שאלות ותשובות",
  liveHubQaEmpty: "שאלו את השאלה הראשונה כדי להתחיל.",
  liveHubQaPlaceholder: "כתבו שאלה…",
  liveHubQaSend: "שליחה",
  liveHubFieldTitle: "שם הפגישה",
  liveHubFieldUrl: "קישור לפגישה",
  liveHubBotTransparency:
    "Staz מצטרף כמשתתף שקט — מקליט ומקשיב בלבד. בסיום תקבלו סגירה: החלטות, אחראים וראיות מהתמלול.",
  liveHubFieldStarts: "שעת התחלה",
  liveHubFieldDuration: "משך (דקות)",
  liveHubFieldDesc: "תיאור",
  liveHubFieldAgenda: "אג׳נדה (שורה לכל פריט)",
  liveHubAgendaPlaceholder: "פתיחה\nהעמקה\nשאלות",
  liveHubFieldMaterialTitle: "שם חומר",
  liveHubFieldMaterialUrl: "קישור לחומר",
  liveHubErrorTitle: "נא להזין שם לפגישה.",
  liveHubErrorUrl: "הזינו קישור תקין של Zoom, Meet, Teams, RTMP או WebRTC.",
  liveHubErrorTime: "בחרו תאריך ושעת התחלה.",
  liveHubReminderSet: "התזכורת נקבעה (5 דקות לפני ההתחלה).",
  liveHubReminderDenied: "הרשאת התראות נדחתה.",
  liveHubReminderUnsupported: "הדפדפן לא תומך בהתראות.",
  liveHubReminderNow: "מתחיל בקרוב — הצטרפו: {url}",
  liveHubConfigTitle: "בוט וצינור עיבוד",
  liveHubConfigBody:
    "השאירו את העמוד פתוח סביב שעת ההתחלה כדי שהבוט יוכל להצטרף. אם אין הצטרפות אוטומטית — העלו הקלטה אחרי השיחה.",
  liveHubShellDesc: "תזמון · הבוט מצטרף · סגירה מוכנה",
  liveHubChipBot: "הצטרפות שקטה",
  liveHubChipDigest: "סגירת מנהלים אחרי",
  liveHubModeAuto: "הצטרפות אוטומטית פעילה",
  liveHubModeManual: "מצב העלאה — חסר מפתח Recall להצטרפות אוטומטית",
  liveHubModeCloseoutOk: "צינור סגירה מוכן",
  liveHubModeCloseoutMissing: "חסרים מפתחות לסגירה",
  liveHubEmptyHint:
    "תזמנו פגישה עם קישור — הבוט מטפל בהקלטה ובסגירה.",
  liveHubHowItWorks:
    "הבוט מצטרף כ־2 דקות לפני ההתחלה. השאירו את העמוד פתוח סביב שעת ההתחלה (ב־Hobby ה־cron רץ פעם ביום).",
  liveHubHowItWorksManual:
    "להצטרפות אוטומטית צריך RECALL_AI_API_KEY. בינתיים: אחרי השיחה העלו כאן הקלטה — הסגירה רצה אוטומטית.",
  liveHubLoadError: "לא ניתן לטעון פגישות.",
  liveHubRetry: "נסו שוב",
  liveHubCreatedToast: "הפגישה תוזמנה",
  liveHubDeletedToast: "הפגישה נמחקה",
  liveHubDeleteConfirm: "למחוק את הפגישה?",
  liveHubTitlePlaceholder: "למשל: סנכרון מוצר שבועי",
  liveHubDetectedPlatform: "זוהה: {platform}",
  liveHubBotAutoJoin: "הצטרפות אוטומטית של הבוט",
  liveHubBotDiarization: "זיהוי דוברים",
  liveHubBotLanguage: "שפה",
  liveHubMoreOptions: "אפשרויות נוספות",
  liveHubScheduling: "מתזמן…",
  liveHubScheduleFail: "לא ניתן לתזמן את הפגישה.",
  liveHubSaveHint: "הבוט מצטרף כ־2 דקות לפני ההתחלה (כשהוא מחובר).",
  liveHubOpenCloseout: "פתיחת סגירה",
  liveHubViewStatus: "סטטוס",
  liveHubUploadRecording: "העלאת הקלטה",
  liveHubMore: "עוד",
  liveHubYou: "אתם",
  liveHubQaFail: "לא ניתן לשלוח שאלה.",
  liveHubUploadAuthFail: "אישור ההעלאה נכשל.",
  liveHubUploadStarted: "ההקלטה הועלתה — הסגירה התחילה",
  liveHubUploadFail: "ההעלאה נכשלה",
  liveStatusScheduled: "מתוזמן",
  liveStatusDispatching: "שולח בוט…",
  liveStatusJoining: "מצטרף…",
  liveStatusRecording: "מקליט",
  liveStatusUploading: "מעלה…",
  liveStatusTranscribing: "מתמלל…",
  liveStatusAnalyzing: "בונה סגירה…",
  liveStatusReady: "סגירה מוכנה",
  liveStatusFailed: "נכשל",
  liveStatusCancelled: "בוטל",
  liveStatusAwaitingRecording: "ממתין להקלטה",
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
  pricingBasicName: "חינמי",
  pricingBasicDesc: "מספיק כדי לסגור פגישה אחת ולהרגיש את האהה.",
  pricingBasicOutcome1: "תמצית מנהלים, החלטות ומשימות",
  pricingBasicOutcome2: "קפיצה לראיה רק כשההתאמה אמיתית",
  pricingBasicOutcome3: "העתקת הסגירה לצוות",
  pricingBasicCta: "העלו פגישה",
  pricingProName: "Pro",
  pricingProDesc: "זיכרון הפגישות שלכם — לא מונה תמלולים.",
  pricingProOutcome1: "ספריית ענן בכל מכשיר",
  pricingProOutcome2: "PDF מקצועי והקלטות שמורות",
  pricingProOutcome3: "100 פגישות בחודש · קבצים עד 500 MB",
  pricingProCta: "שדרג ל-Pro",
  pricingEnterpriseName: "Enterprise",
  pricingEnterpriseDesc: "לצוותים שצריכים קנה מידה, שליטה ותמיכה ייעודית.",
  pricingEnterpriseOutcome1: "תובנות אחידות בכל הארגון",
  pricingEnterpriseOutcome2: "הטמעת צוותים תוך ימים, לא שבועות",
  pricingEnterpriseOutcome3: "תמיכה ייעודית עם SLA מובטח",
  pricingEnterpriseCta: "צור קשר עם מכירות",
  onboardTag: "התחלה מהירה",
  onboardTitle: "סגירה ראשונה בשלושה צעדים",
  onboardSubtitle: "השלימו 3 שלבים כדי לפתוח את מלוא הכוח של Staz AI.",
  onboardProgress: "התקדמות הגדרה",
  onboardDismiss: "אסיים את זה אחר כך",
  onboardExpand: "הרחב",
  onboardHide: "הסתר",
  onboardComplete: "הכל מוכן!",
  onboardCompleteDesc: "אתם מוכנים. העלו פגישה ושלחו את הסגירה.",
  onboardStep1Title: "אשרו את החשבון",
  onboardStep1Desc: "ודאו ששם ואימייל נכונים.",
  onboardStep1Outcome: "מוכנים לשמור פגישות בחשבון",
  onboardStep1Cta: "פתחו הגדרות",
  onboardStep2Title: "העלו פגישה",
  onboardStep2Desc: "גררו הקלטה — Staz בונה את סגירת המנהלים.",
  onboardStep2Outcome: "תמצית, החלטות ומשימות במקום אחד",
  onboardStep2Cta: "העלו פגישה",
  onboardStep3Title: "בדקו ושתפו",
  onboardStep3Desc: "העתיקו את התמצית או שלחו החלטות לצוות.",
  onboardStep3Outcome: "סגירה מוכנה לשליחה",
  onboardStep3Cta: "פתחו סגירה",
  onboardStep3Waiting: "העלו פגישה — הסגירה תופיע כאן.",
  gateEyebrow: "שמרו את הפגישות במקום אחד",
  gateStartTrial: "שדרגו ל-Pro",
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
  trustTeamsCount: "נבנה לצוותים דוברי עברית",
  liveActivityLabel: "פעילות חיה",
  liveActivityDismiss: "סגור",
  liveActivityJustNow: "עכשיו",
  liveActivityMinutesAgo: "לפני {n} דק׳",
  liveActivitySignup: "{name} מ{location} הצטרף/ה עכשיו",
  liveActivityTranscription: "{name} מ{location} סיים/ה תמלול",
  liveActivityUpgrade: "{name} מ{location} שדרג/ה ל-Pro",
  liveActivityExport: "{name} מ{location} ייצא/ה דוח PDF",
  liveActivityDownload: "{name} מ{location} הוריד/ה קובץ",
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
