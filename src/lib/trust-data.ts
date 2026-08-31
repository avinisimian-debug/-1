export interface CompanyLogo {
  id: string;
  name: string;
}

export const TRUST_COMPANIES: CompanyLogo[] = [
  { id: "vertex", name: "Vertex" },
  { id: "horizon", name: "Horizon" },
  { id: "pulse", name: "Pulse" },
  { id: "atlas", name: "Atlas" },
  { id: "nova", name: "Nova" },
  { id: "summit", name: "Summit" },
];

export type LiveActivityType =
  | "signup"
  | "transcription"
  | "upgrade"
  | "export"
  | "download";

export interface LiveActivityEvent {
  id: string;
  type: LiveActivityType;
  name: string;
  location: string;
  minutesAgo: number;
}

/** International personas for English and other locales. */
export const LIVE_ACTIVITY_EVENTS_INTL: LiveActivityEvent[] = [
  { id: "1", type: "signup", name: "Sarah M.", location: "Tel Aviv", minutesAgo: 1 },
  { id: "2", type: "transcription", name: "Daniel K.", location: "London", minutesAgo: 3 },
  { id: "3", type: "upgrade", name: "Emma R.", location: "New York", minutesAgo: 5 },
  { id: "4", type: "export", name: "Yuki T.", location: "Tokyo", minutesAgo: 7 },
  { id: "5", type: "download", name: "Alex P.", location: "Berlin", minutesAgo: 4 },
  { id: "6", type: "signup", name: "James W.", location: "Sydney", minutesAgo: 2 },
  { id: "7", type: "transcription", name: "Priya S.", location: "Singapore", minutesAgo: 6 },
  { id: "8", type: "upgrade", name: "Léa D.", location: "Paris", minutesAgo: 8 },
  { id: "9", type: "download", name: "Noah B.", location: "Toronto", minutesAgo: 3 },
  { id: "10", type: "export", name: "Mia C.", location: "Amsterdam", minutesAgo: 5 },
];

/** Localized Israeli personas for Hebrew UI credibility. */
export const LIVE_ACTIVITY_EVENTS_HE: LiveActivityEvent[] = [
  { id: "he-1", type: "signup", name: "מיכל א.", location: "תל אביב", minutesAgo: 1 },
  { id: "he-2", type: "transcription", name: "רוני ק.", location: "חיפה", minutesAgo: 3 },
  { id: "he-3", type: "upgrade", name: "עידן מ.", location: "ירושלים", minutesAgo: 5 },
  { id: "he-4", type: "export", name: "נועה ש.", location: "רמת גן", minutesAgo: 7 },
  { id: "he-5", type: "download", name: "אורי ל.", location: "באר שבע", minutesAgo: 4 },
  { id: "he-6", type: "signup", name: "דנה ר.", location: "הרצליה", minutesAgo: 2 },
  { id: "he-7", type: "transcription", name: "יואב פ.", location: "נתניה", minutesAgo: 6 },
  { id: "he-8", type: "upgrade", name: "שירה ב.", location: "ראשון לציון", minutesAgo: 8 },
  { id: "he-9", type: "download", name: "איתי ג.", location: "כפר סבא", minutesAgo: 3 },
  { id: "he-10", type: "signup", name: "טל ה.", location: "חולון", minutesAgo: 2 },
  { id: "he-11", type: "download", name: "ליאור נ.", location: "פתח תקווה", minutesAgo: 4 },
  { id: "he-12", type: "export", name: "מאיה ד.", location: "רעננה", minutesAgo: 6 },
];

export function getLiveActivityEvents(locale: string): LiveActivityEvent[] {
  return locale === "he" ? LIVE_ACTIVITY_EVENTS_HE : LIVE_ACTIVITY_EVENTS_INTL;
}

/** Picks a random persona with a fresh “minutes ago” timestamp. */
export function pickRandomLiveActivity(locale: string): LiveActivityEvent {
  const pool = getLiveActivityEvents(locale);
  const base = pool[Math.floor(Math.random() * pool.length)];
  return {
    ...base,
    minutesAgo: 1 + Math.floor(Math.random() * 9),
  };
}
