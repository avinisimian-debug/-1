export type Locale = "en" | "he" | "ar" | "es" | "fr" | "ru";

export const LOCALES: Locale[] = ["en", "he", "ar", "es", "fr", "ru"];

export const RTL_LOCALES: Locale[] = ["he", "ar"];

export interface Translations {
  // Auth
  authTagline: string;
  authTitle: string;
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
  uploadMax: string;
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
  downloadFormatFullTxt: string;
  downloadFormatTranscriptTxt: string;
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
  resSentiment: string;
  resCopySummary: string;
  resCopied: string;
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
  langLabel: string;
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
  // Trial / launch Pro
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
  gateSentimentTeaser: string;
  gatePrioritiesTeaser: string;
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
  authTitle: "Turn every meeting into results",
  authSubtitle:
    "Accurate AI transcription, executive summaries, and action items — all in one place. Start free in seconds.",
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
  uploadBrowse: "Cinema-quality transcription · drag & drop or browse",
  uploadMax: "Max",
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
  downloadFormatFullTxt: "Full report (.txt)",
  downloadFormatTranscriptTxt: "Transcript only (.txt)",
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
  resSentiment: "Meeting Tone",
  resCopySummary: "Copy summary",
  resCopied: "Copied!",
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
  featTranscriptSearch: "Transcript search",
  featCopyClipboard: "Copy to clipboard",
  featPdfExport: "PDF report export",
  featTxtExport: "Text export",
  featHistory: "Saved history",
  featLargeFiles: "Large files (500 MB)",
  featLanguageSelect: "Language selection",
  featSentiment: "Sentiment analysis",
  featChapters: "Meeting chapters",
  featPriorities: "Action item priorities",
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
  settingsBasicPlan: "Basic Plan — $0/month",
  settingsProPlanLine: "Pro Plan — {price}/month",
  settingsManagePayPal: "Manage or cancel your subscription in your PayPal account.",
  paypalCancelled: "PayPal subscription was cancelled.",
  pricingProLaunchNote: "Subscribe via PayPal — $0 during launch week, then auto-billing.",
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
  langLabel: "Language",
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
  paypalDesc: "Secure payment — unlock Pro instantly",
  paypalPay: "Subscribe with PayPal",
  paypalSuccess: "Pro activated! Your subscription is set up.",
  paypalProcessing: "Processing...",
  paypalError: "Payment failed. Please try again.",
  paypalNotConfigured: "PayPal is not configured yet. Add keys to .env.local",
  paypalSandboxNote: "Secure payment via PayPal",
  paypalSubscribeTitle: "Start Pro free — auto-billing after launch week",
  paypalSubscribeDesc:
    "Subscribe with PayPal — $0 until launch week ends, then {intro}/mo charged automatically, then {regular}/mo from month 2.",
  paypalAutoBillingNote:
    "You authorize PayPal to charge {intro} when launch week ends, then {regular}/month. Cancel anytime in PayPal.",
  trialTitle: "Pro is free during launch week",
  trialDesc:
    "Use PayPal below — full Pro access now at $0. When launch week ends, {intro}/mo is charged automatically; from month 2, {regular}/mo.",
  saleBadge: "Launch Week",
  saleTitle: "Join Pro free this week via PayPal — then automatic billing at the intro price.",
  saleFirstMonth: "Free until launch week ends — then {intro}, then {regular}/mo",
  saleFreeWeek: "Free this week",
  salePricingNote: "After launch week: {intro}/mo auto-charged, then {regular}/mo from month 2.",
  saleEndsIn: "Free signup ends in",
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
  pricingBasicOutcome1: "Capture meeting notes in under 2 minutes",
  pricingBasicOutcome2: "Send recap emails without manual typing",
  pricingBasicOutcome3: "Never lose what was said in a quick call",
  pricingBasicCta: "Get started free",
  pricingProName: "Pro",
  pricingProDesc: "For professionals who run on meetings and need outcomes fast.",
  pricingProOutcome1: "Cut post-meeting admin by 3+ hours per week",
  pricingProOutcome2: "Ship leadership-ready summaries the same day",
  pricingProOutcome3: "Turn every recording into tracked action items",
  pricingProCta: "Upgrade to Pro",
  pricingEnterpriseName: "Enterprise",
  pricingEnterpriseDesc: "For teams that need scale, control, and dedicated support.",
  pricingEnterpriseOutcome1: "Standardize insights across your entire organization",
  pricingEnterpriseOutcome2: "Onboard teams in days, not weeks",
  pricingEnterpriseOutcome3: "Dedicated support with SLA guarantees",
  pricingEnterpriseCta: "Contact sales",
  onboardTag: "Quick start",
  onboardTitle: "Get value in your first 5 minutes",
  onboardSubtitle: "Complete these 3 steps to unlock the full power of Staz AI.",
  onboardProgress: "Setup progress",
  onboardDismiss: "I'll finish this later",
  onboardExpand: "Expand",
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
  gateSentimentTeaser: "Sentiment",
  gatePrioritiesTeaser: "Priorities",
  trustUsedBy: "Used by teams at",
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
  authTitle: "הפכו כל פגישה לתוצאות",
  authSubtitle:
    "תמלול מדויק, סיכומי מנהלים ומשימות — הכל במקום אחד. התחילו בחינם תוך שניות.",
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
  uploadBrowse: "תמלול ברמת קולנוע · גרירה או בחירת קובץ",
  uploadMax: "מקסימום",
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
  downloadFormatFullTxt: "דוח מלא (.txt)",
  downloadFormatTranscriptTxt: "תמלול בלבד (.txt)",
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
  resSentiment: "אווירת הפגישה",
  resCopySummary: "העתק סיכום",
  resCopied: "הועתק!",
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
  featTranscriptSearch: "חיפוש בתמלול",
  featCopyClipboard: "העתקה ללוח",
  featPdfExport: "ייצוא PDF",
  featTxtExport: "ייצוא טקסט",
  featHistory: "היסטוריה שמורה",
  featLargeFiles: "קבצים גדולים (500 MB)",
  featLanguageSelect: "בחירת שפה",
  featSentiment: "ניתוח סנטימנט",
  featChapters: "פרקי פגישה",
  featPriorities: "עדיפויות משימות",
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
  settingsBasicPlan: "חבילת Basic — $0/חודש",
  settingsProPlanLine: "חבילת Pro — {price}/חודש",
  settingsManagePayPal: "ניהול או ביטול המנוי דרך חשבון PayPal שלכם.",
  paypalCancelled: "הרשמת המנוי ב-PayPal בוטלה.",
  pricingProLaunchNote: "הירשמו עם PayPal — $0 בשבוע ההשקה, ואז חיוב אוטומטי.",
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
  langLabel: "שפה",
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
  paypalDesc: "תשלום מאובטח — Pro מופעל מיד",
  paypalPay: "הירשמו עם PayPal",
  paypalSuccess: "Pro הופעל! המנוי שלכם מוגדר.",
  paypalProcessing: "מעבד...",
  paypalError: "יצירת המנוי נכשלה. נסו שוב או פנו לתמיכה.",
  paypalNotConfigured: "PayPal לא מוגדר. הוסף מפתחות ל-.env.local",
  paypalSandboxNote: "תשלום מאובטח דרך PayPal",
  paypalSubscribeTitle: "התחילו Pro בחינם — חיוב אוטומטי אחרי שבוע ההשקה",
  paypalSubscribeDesc:
    "הירשמו עם PayPal — $0 עד סוף שבוע ההשקה, אחר כך {intro}/חודש בחיוב אוטומטי, ומחודש שני {regular}/חודש.",
  paypalAutoBillingNote:
    "באישור המנוי PayPal יחייב {intro} בסוף שבוע ההשקה, ואז {regular}/חודש. ניתן לבטל בכל עת ב-PayPal.",
  trialTitle: "Pro בחינם בשבוע ההשקה",
  trialDesc:
    "השתמשו ב-PayPal למטה — גישה מלאה ל-Pro ב-$0. בסוף שבוע ההשקה יחויבו אוטומטית {intro}/חודש; מחודש שני {regular}/חודש.",
  saleBadge: "שבוע השקה",
  saleTitle: "הצטרפו ל-Pro בחינם השבוע דרך PayPal — ואז חיוב אוטומטי במחיר ההשקה.",
  saleFirstMonth: "חינם עד סוף שבוע ההשקה — אחר כך {intro}, ומחודש שני {regular}/חודש",
  saleFreeWeek: "חינם השבוע",
  salePricingNote: "אחרי שבוע ההשקה: חיוב אוטומטי {intro}/חודש, ומחודש שני {regular}/חודש.",
  saleEndsIn: "ההרשמה החינמית מסתיימת בעוד",
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
  pricingBasicOutcome1: "תיעוד פגישות תוך פחות מ-2 דקות",
  pricingBasicOutcome2: "שליחת סיכומים בלי הקלדה ידנית",
  pricingBasicOutcome3: "לא מאבדים מה שנאמר בשיחה קצרה",
  pricingBasicCta: "התחילו בחינם",
  pricingProName: "Pro",
  pricingProDesc: "לאנשי מקצוע שחיים מפגישות וצריכים תוצאות מהר.",
  pricingProOutcome1: "חיסכון של 3+ שעות עבודה אחרי כל פגישה בשבוע",
  pricingProOutcome2: "סיכומים מוכנים להנהלה באותו יום",
  pricingProOutcome3: "הפיכת כל הקלטה למשימות מעקב",
  pricingProCta: "שדרג ל-Pro",
  pricingEnterpriseName: "Enterprise",
  pricingEnterpriseDesc: "לצוותים שצריכים קנה מידה, שליטה ותמיכה ייעודית.",
  pricingEnterpriseOutcome1: "תובנות אחידות בכל הארגון",
  pricingEnterpriseOutcome2: "הטמעת צוותים תוך ימים, לא שבועות",
  pricingEnterpriseOutcome3: "תמיכה ייעודית עם SLA מובטח",
  pricingEnterpriseCta: "צור קשר עם מכירות",
  onboardTag: "התחלה מהירה",
  onboardTitle: "קבלו ערך תוך 5 דקות",
  onboardSubtitle: "השלימו 3 שלבים כדי לפתוח את מלוא הכוח של Staz AI.",
  onboardProgress: "התקדמות הגדרה",
  onboardDismiss: "אסיים את זה אחר כך",
  onboardExpand: "הרחב",
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
  gateSentimentTeaser: "סנטימנט",
  gatePrioritiesTeaser: "עדיפויות",
  trustUsedBy: "בשימוש צוותים ב-",
  trustTeamsCount: "מעל 2,400 צוותים ברחבי העולם",
  liveActivityLabel: "פעילות חיה",
  liveActivityDismiss: "סגור",
  liveActivityJustNow: "עכשיו",
  liveActivityMinutesAgo: "לפני {n} דק׳",
  liveActivitySignup: "{name} מ־{location} הצטרף/ה עכשיו",
  liveActivityTranscription: "{name} מ־{location} סיים/ה תמלול",
  liveActivityUpgrade: "{name} מ־{location} שדרג/ה ל-Pro",
  liveActivityExport: "{name} מ־{location} ייצא/ה דוח PDF",
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
