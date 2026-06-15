import type { Locale } from "@/lib/i18n/translations";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  initials: string;
  accent: string;
}

const en: Testimonial[] = [
  {
    id: "1",
    name: "Dana Cohen",
    role: "Product Manager",
    quote:
      "Staz AI saves me hours every week. The executive summary is accurate enough to send straight to leadership.",
    initials: "DC",
    accent: "#8b5cf6",
  },
  {
    id: "2",
    name: "Yossi Levy",
    role: "Business Consultant",
    quote:
      "The best tool I've found for Hebrew meeting transcription. Clean PDF reports my clients actually read.",
    initials: "YL",
    accent: "#f59e0b",
  },
  {
    id: "3",
    name: "Michal Abraham",
    role: "Startup Founder",
    quote:
      "I upload hour-long interviews and get structured action items in minutes. Game changer for our team.",
    initials: "MA",
    accent: "#22d3ee",
  },
  {
    id: "4",
    name: "Omer Shalom",
    role: "Project Manager",
    quote:
      "Studio-grade quality without the studio price. The summaries capture decisions I used to miss.",
    initials: "OS",
    accent: "#10b981",
  },
  {
    id: "5",
    name: "Rachel Ben-David",
    role: "Content Creator",
    quote:
      "Finally — transcription that understands context. Key takeaways are consistently on point.",
    initials: "RB",
    accent: "#ec4899",
  },
];

const he: Testimonial[] = [
  {
    id: "1",
    name: "דנה כהן",
    role: "מנהלת מוצר",
    quote:
      "Staz AI חוסך לי שעות כל שבוע. הסיכום המנהלים מדויק מספיק לשלוח ישר להנהלה.",
    initials: "דכ",
    accent: "#8b5cf6",
  },
  {
    id: "2",
    name: "יוסי לוי",
    role: "יועץ עסקי",
    quote:
      "הכלי הכי טוב שמצאתי לתמלול פגישות בעברית. דוחות PDF מעוצבים שהלקוחות שלי באמת קוראים.",
    initials: "יל",
    accent: "#f59e0b",
  },
  {
    id: "3",
    name: "מיכל אברהם",
    role: "מייסדת סטארטאפ",
    quote:
      "מעלה ראיונות של שעה ומקבלת משימות מסודרות תוך דקות. שינה את הדרך שבה הצוות שלנו עובד.",
    initials: "מא",
    accent: "#22d3ee",
  },
  {
    id: "4",
    name: "עומר שלום",
    role: "מנהל פרויקטים",
    quote:
      "איכות ברמת אולפן בלי מחיר של אולפן. הסיכומים תופסים החלטות שפספסתי בעבר.",
    initials: "עש",
    accent: "#10b981",
  },
  {
    id: "5",
    name: "רחל בן-דוד",
    role: "יוצרת תוכן",
    quote:
      "סוף סוף תמלול שמבין הקשר. התובנות המרכזיות תמיד בול בפוני.",
    initials: "רב",
    accent: "#ec4899",
  },
];

export const testimonialsByLocale: Record<Locale, Testimonial[]> = {
  en,
  he,
  ar: en,
  es: en,
  fr: en,
  ru: en,
};
