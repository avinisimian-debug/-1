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
  adminNoAccess: string;
  adminEmpty: string;
  // PayPal
  paypalTitle: string;
  paypalDesc: string;
  paypalPay: string;
  paypalSuccess: string;
  paypalProcessing: string;
  paypalError: string;
  paypalNotConfigured: string;
  paypalSandboxNote: string;
  // Sale
  saleBadge: string;
  saleTitle: string;
  saleFirstMonth: string;
  saleEndsIn: string;
  saleDays: string;
  saleHours: string;
  saleMinutes: string;
  saleSeconds: string;
}

const en: Translations = {
  authTagline: "Studio-Grade AI",
  authTitle: "Turn every meeting into action",
  authSubtitle:
    "Professional transcription, summaries & action items — built for your daily workflow.",
  authName: "Your name",
  authEmail: "Email for updates",
  authSubmit: "Get started free",
  authGoogle: "Continue with Google",
  authUpdates: "We'll send product updates & tips. Unsubscribe anytime.",
  authSocialProof: "Trusted by creators, teams & studios worldwide",
  authFeature1: "AI transcription in seconds",
  authFeature2: "Executive summaries & action items",
  authFeature3: "Long videos up to 3+ hours (Pro)",
  authStat1: "50K+ sessions",
  authStat2: "98% accuracy",
  authStat3: "4.9★ rating",
  authErrorName: "Please enter your name",
  authErrorEmail: "Please enter a valid email",
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
  pdfGeneratedBy: "Generated by MeetScribe",
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
  adminDesc: "Everyone who signed up to MeetScribe",
  adminTotal: "total registered",
  adminName: "Name",
  adminEmail: "Email",
  adminProvider: "Sign-in method",
  adminRegistered: "Registered",
  adminLastLogin: "Last login",
  adminNoAccess: "You don't have permission to view this page.",
  adminEmpty: "No users registered yet.",
  paypalTitle: "Upgrade with PayPal",
  paypalDesc: "Secure payment — unlock Pro instantly",
  paypalPay: "Pay $14.90/month with PayPal",
  paypalSuccess: "Payment successful! Pro plan activated.",
  paypalProcessing: "Processing payment...",
  paypalError: "Payment failed. Please try again.",
  paypalNotConfigured: "PayPal is not configured yet. Add keys to .env.local",
  paypalSandboxNote: "Secure payment via PayPal",
  saleBadge: "50% OFF — First Month",
  saleTitle: "Launch week special — lock in your discounted first month before the offer ends.",
  saleFirstMonth: "50% off your first month",
  saleEndsIn: "Offer ends in",
  saleDays: "Days",
  saleHours: "Hours",
  saleMinutes: "Min",
  saleSeconds: "Sec",
};

const he: Translations = {
  authTagline: "בינה מלאכותית ברמת אולפן",
  authTitle: "הפוך כל פגישה לפעולה",
  authSubtitle:
    "תמלול מקצועי, סיכומים ומשימות — נבנה לעבודה היומיומית שלך.",
  authName: "השם שלך",
  authEmail: "אימייל לעדכונים",
  authSubmit: "התחל בחינם",
  authGoogle: "המשך עם Google",
  authUpdates: "נשלח עדכונים וטיפים. אפשר לבטל בכל עת.",
  authSocialProof: "בשימוש יוצרים, צוותים ואולפנים ברחבי העולם",
  authFeature1: "תמלול AI תוך שניות",
  authFeature2: "סיכומים מנהלים ומשימות",
  authFeature3: "סרטונים ארוכים עד 3+ שעות (Pro)",
  authStat1: "50K+ סשנים",
  authStat2: "98% דיוק",
  authStat3: "דירוג 4.9★",
  authErrorName: "נא להזין שם",
  authErrorEmail: "נא להזין אימייל תקין",
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
    "העלה פגישות, ראיונות או וידאו ארוך. קבל תמלול ברמת אולפן, סיכומים ומשימות.",
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
  pdfGeneratedBy: "נוצר על ידי MeetScribe",
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
  tryAgain: "נסה שוב",
  transcriptionFailed: "התמלול נכשל",
  langLabel: "שפה",
  adminTitle: "משתמשים רשומים",
  adminDesc: "כל מי שנרשם ל-MeetScribe",
  adminTotal: "נרשמו בסך הכל",
  adminName: "שם",
  adminEmail: "אימייל",
  adminProvider: "שיטת התחברות",
  adminRegistered: "תאריך הרשמה",
  adminLastLogin: "כניסה אחרונה",
  adminNoAccess: "אין לך הרשאה לצפות בדף זה.",
  adminEmpty: "עדיין אין משתמשים רשומים.",
  paypalTitle: "שדרוג עם PayPal",
  paypalDesc: "תשלום מאובטח — Pro מופעל מיד",
  paypalPay: "שלם $14.90/חודש עם PayPal",
  paypalSuccess: "התשלום הצליח! חבילת Pro הופעלה.",
  paypalProcessing: "מעבד תשלום...",
  paypalError: "התשלום נכשל. נסה שוב.",
  paypalNotConfigured: "PayPal לא מוגדר. הוסף מפתחות ל-.env.local",
  paypalSandboxNote: "תשלום מאובטח דרך PayPal",
  saleBadge: "50% הנחה — חודש ראשון",
  saleTitle: "מבצע השקה לשבוע — נעל את מחיר החודש הראשון לפני שהמבצע נגמר.",
  saleFirstMonth: "50% הנחה על החודש הראשון",
  saleEndsIn: "המבצע מסתיים בעוד",
  saleDays: "ימים",
  saleHours: "שעות",
  saleMinutes: "דקות",
  saleSeconds: "שניות",
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
