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

export type LiveActivityType = "signup" | "transcription" | "upgrade" | "export";

export interface LiveActivityEvent {
  id: string;
  type: LiveActivityType;
  name: string;
  location: string;
  minutesAgo: number;
}

export const LIVE_ACTIVITY_EVENTS: LiveActivityEvent[] = [
  { id: "1", type: "signup", name: "Sarah M.", location: "Tel Aviv", minutesAgo: 1 },
  { id: "2", type: "transcription", name: "Daniel K.", location: "London", minutesAgo: 3 },
  { id: "3", type: "upgrade", name: "Emma R.", location: "New York", minutesAgo: 5 },
  { id: "4", type: "export", name: "Yuki T.", location: "Tokyo", minutesAgo: 7 },
  { id: "5", type: "transcription", name: "Marco B.", location: "Milan", minutesAgo: 4 },
  { id: "6", type: "signup", name: "Noa L.", location: "Haifa", minutesAgo: 2 },
  { id: "7", type: "transcription", name: "Alex P.", location: "Berlin", minutesAgo: 6 },
  { id: "8", type: "upgrade", name: "Priya S.", location: "Singapore", minutesAgo: 8 },
  { id: "9", type: "export", name: "James W.", location: "Sydney", minutesAgo: 9 },
  { id: "10", type: "signup", name: "Léa D.", location: "Paris", minutesAgo: 2 },
];
