/**
 * ICP demo: Hebrew B2B pipeline closeout — sales manager + CEO.
 * Used for landing theatre + aha onboarding (no media required).
 */

import type { TranscriptionResult } from "@/features/transcription/types";

export const DEMO_MEETING_ID = "demo-pipeline-q3";

export const DEMO_AHA_TIMESTAMP = "02:14";

export function getDemoMeetingResult(): TranscriptionResult {
  return {
    fileName: "סיכום פיילוט · Q3 — Staz Demo",
    duration: "04:12",
    processedAt: new Date().toISOString(),
    headline: "אישור פיילוט עם לקוח עד יום חמישי",
    topics: ["פיילוט", "תקציב", "אישור משפטי", "לוחות זמנים"],
    decisions: [
      "מאשרים פיילוט ללקוח עד חמישי הקרוב",
      "הצעת מחיר לא נשלחת לפני אישור משפטי",
      "פגישת סטטוס ביום שני בבוקר",
    ],
    summary: {
      executive: [
        "הצוות סיכם להשיק פיילוט מול הלקוח עד יום חמישי, בכפוף לאישור משפטי.",
        "נועה תוביל את הכנת המסמכים; איתי אחראי על הצעת המחיר אחרי אור ירוק.",
        "סוכם לא להבטיח תאריך השקה מלא לפני סוף הפיילוט.",
      ],
      keyTakeaways: [
        "יש לחץ לקוח על timeline — נדרשת תשובה ברורה עד חמישי.",
        "סיכון: סעיף אחריות בחוזה עדיין פתוח.",
        "הצלחת הפיילוט תימדד באימוץ שבועי, לא רק בהדגמה.",
      ],
      overview:
        "ישיבת הנהלה קצרה על סגירת פיילוט מכירות. ההחלטה המרכזית: לצאת לפיילוט השבוע אחרי ירוק ממשפט.",
    },
    actionItems: [
      {
        id: "a1",
        task: "להעביר טיוטת הסכם לפיילוט לאישור משפטי",
        owner: "נועה",
        deadline: "מחר 12:00",
        completed: false,
        priority: "high",
      },
      {
        id: "a2",
        task: "לעדכן את הלקוח בסטטוס והצעד הבא",
        owner: "איתי",
        deadline: "אחרי אישור משפטי",
        completed: false,
        priority: "high",
      },
      {
        id: "a3",
        task: "לקבוע סטטוס פנימי ביום שני",
        owner: "נועה",
        deadline: "היום",
        completed: false,
        priority: "medium",
      },
    ],
    transcript: [
      {
        timestamp: "00:12",
        speaker: "נועה",
        speakerId: "1",
        text: "בוקר טוב. אנחנו כאן לסגור האם יוצאים לפיילוט עם הלקוח עוד השבוע.",
      },
      {
        timestamp: "00:34",
        speaker: "איתי",
        speakerId: "2",
        text: "הם לוחצים. אם לא נאשר עד חמישי — יש סיכון שיבחרו מתחרה.",
      },
      {
        timestamp: "01:05",
        speaker: "נועה",
        speakerId: "1",
        text: "אני מוכנה להכין את מסמכי הפיילוט, אבל רק אחרי עין של משפטים.",
      },
      {
        timestamp: "01:28",
        speaker: "איתי",
        speakerId: "2",
        text: "מסכים. בלי אישור משפטי — לא שולחים הצעת מחיר.",
      },
      {
        timestamp: "02:14",
        speaker: "נועה",
        speakerId: "1",
        text: "אז אנחנו סוגרים: פיילוט מאושר עד חמישי, בכפוף לאישור משפטי. זה ההחלטה.",
      },
      {
        timestamp: "02:41",
        speaker: "איתי",
        speakerId: "2",
        text: "מעולה. אני מעדכן את הלקוח ברגע שיש ירוק, לא לפני.",
      },
      {
        timestamp: "03:10",
        speaker: "נועה",
        speakerId: "1",
        text: "נקבע סטטוס פנימי ביום שני בבוקר. אני שולחת זימון.",
      },
      {
        timestamp: "03:42",
        speaker: "איתי",
        speakerId: "2",
        text: "חשוב: לא מבטיחים השקה מלאה לפני שאנחנו רואים אימוץ בשבוע הראשון של הפיילוט.",
      },
    ],
    chapters: [
      { timestamp: "00:12", title: "מטרת הישיבה" },
      { timestamp: "01:05", title: "תנאים לאישור" },
      { timestamp: "02:14", title: "החלטה" },
      { timestamp: "03:10", title: "צעדים הבאים" },
    ],
    keyQuotes: [
      {
        quote: "אנחנו סוגרים: פיילוט מאושר עד חמישי, בכפוף לאישור משפטי.",
        context: "החלטת הליבה של הפגישה",
      },
    ],
    followUpEmail: {
      subject: "סיכום: אישור פיילוט עד חמישי (בכפוף למשפט)",
      body: "שלום צוות,\n\nסוכם:\n• פיילוט עד חמישי בכפוף לאישור משפטי\n• אין שליחת הצעת מחיר לפני ירוק\n• סטטוס פנימי ביום שני\n\nתודה,\nStaz AI",
    },
  };
}
