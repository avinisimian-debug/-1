import { SITE_URL } from "@/lib/seo";

export type SeoPageSlug =
  | "ai-meeting-transcription"
  | "meeting-summary-hebrew"
  | "meeting-closeout";

export interface SeoPageConfig {
  slug: SeoPageSlug;
  path: `/${string}`;
  title: string;
  description: string;
  h1: string;
  subhead: string;
  bullets: string[];
  body: string[];
  keywords: string[];
}

export const SEO_PAGES: Record<SeoPageSlug, SeoPageConfig> = {
  "ai-meeting-transcription": {
    slug: "ai-meeting-transcription",
    path: "/ai-meeting-transcription",
    title: "תמלול פגישות עם AI בעברית",
    description:
      "תמלול פגישות אוטומטי בעברית עם Staz AI — הקלטות, זום ו-Teams הופכים לתמלול מדויק, תמצית מנהלים והחלטות. כלי AI לפגישות שעובד בעברית.",
    h1: "תמלול פגישות עם AI — בעברית, בדיוק",
    subhead:
      "העלו הקלטה או קישור. Staz מתמלל, מסכם וסוגר את הפגישה עם החלטות, משימות וקישור למשפט בתמלול.",
    bullets: [
      "תמלול בעברית לפגישות עסקיות ומכירות",
      "תמלול זום, Teams והקלטות מקומיות",
      "תמצית מנהלים + מה הוחלט + מי עושה מה",
      "חינם להתחלה — בלי כרטיס אשראי",
    ],
    body: [
      "מחפשים כלי AI לתמלול פגישות בעברית? Staz AI נבנה לצוותים דוברי עברית שצריכים יותר מתמלול גולמי — סגירה אמיתית של הפגישה.",
      "במקום לחפש בתמלול ארוך, מקבלים תמצית מנהלים, רשימת החלטות ומשימות עם אחריות. לחיצה על החלטה מדגישה את הרגע בתמלול.",
    ],
    keywords: [
      "תמלול פגישות",
      "תמלול בעברית AI",
      "כלי תמלול AI",
      "תמלול זום בעברית",
    ],
  },
  "meeting-summary-hebrew": {
    slug: "meeting-summary-hebrew",
    path: "/meeting-summary-hebrew",
    title: "סיכום פגישות בעברית עם AI",
    description:
      "סיכום פגישות אוטומטי בעברית — תמצית מנהלים, החלטות ומשימות מפגישות זום, Teams והקלטות. כלי AI לסיכום פגישות לצוותים בישראל.",
    h1: "סיכום פגישות בעברית — אוטומטי ומדויק",
    subhead:
      "Staz הופך כל פגישה לתמונה ברורה: מה הוחלט, מי אחראי, ואיפה זה נאמר בתמלול.",
    bullets: [
      "סיכום פגישה אוטומטי תוך דקות",
      "תמצית מנהלים מוכנה לשיתוף",
      "החלטות ומשימות עם בעלים ודדליינים",
      "עובד בעברית — ממשק ותוצרים",
    ],
    body: [
      "סיכום פגישות ידני לוקח זמן ונשכח. כלי AI לסיכום פגישות בעברית חוסך שעות ומונע איבוד החלטות.",
      "Staz AI מיועד למנהלים, יועצים וצוותי מכירות שצריכים סיכום פגישה מקצועי — לא רק תמלול.",
    ],
    keywords: [
      "סיכום פגישות",
      "סיכום פגישות אוטומטי",
      "סיכום פגישה בעברית",
      "כלי AI לפגישות",
    ],
  },
  "meeting-closeout": {
    slug: "meeting-closeout",
    path: "/meeting-closeout",
    title: "סגירת פגישות עם AI — החלטות ומשימות",
    description:
      "מערכת סגירת פגישות בעברית: תמלול, החלטות, משימות וראיות מהתמלול. Staz AI — עוזר AI לסגירת פגישות לעסקים בישראל.",
    h1: "סגירת פגישות — לא רק סיכום",
    subhead:
      "הפגישה נגמרת. Staz סוגר אותה: מה הוחלט, מי עושה מה, ואיפה זה נאמר — עם מקור אמיתי.",
    bullets: [
      "סגירת פגישות עם החלטות מסודרות",
      "משימות עם אחריות ברורה",
      "קפיצה למשפט בתמלול — בלי לנחש",
      "ספריית פגישות בענן (Pro)",
    ],
    body: [
      "סגירת פגישות היא הבעיה האמיתית אחרי כל שיחה: החלטות נשכחות, משימות נופלות, ואנשים זוכרים אחרת.",
      "Staz AI הוא כלי AI לסגירת פגישות בעברית — מחבר בין סיכום, אחריות וראיה מהתמלול.",
    ],
    keywords: [
      "סגירת פגישות",
      "עוזר AI לפגישות",
      "החלטות מפגישה",
      "משימות מפגישה",
    ],
  },
};

export const SEO_PAGE_LIST = Object.values(SEO_PAGES);

export function seoPageUrl(slug: SeoPageSlug): string {
  return `${SITE_URL}${SEO_PAGES[slug].path}`;
}
