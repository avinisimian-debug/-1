const SPEAKER_PALETTE = [
  { bg: "bg-indigo-100", text: "text-indigo-700", ring: "ring-indigo-200", bubble: "bg-indigo-50 border-indigo-100" },
  { bg: "bg-emerald-100", text: "text-emerald-700", ring: "ring-emerald-200", bubble: "bg-emerald-50 border-emerald-100" },
  { bg: "bg-amber-100", text: "text-amber-800", ring: "ring-amber-200", bubble: "bg-amber-50 border-amber-100" },
  { bg: "bg-violet-100", text: "text-violet-700", ring: "ring-violet-200", bubble: "bg-violet-50 border-violet-100" },
  { bg: "bg-sky-100", text: "text-sky-700", ring: "ring-sky-200", bubble: "bg-sky-50 border-sky-100" },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getSpeakerStyle(speaker: string) {
  const index = hashString(speaker) % SPEAKER_PALETTE.length;
  return SPEAKER_PALETTE[index];
}

export function getSpeakerInitials(speaker: string): string {
  const parts = speaker.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function buildSpeakerIndexMap(speakers: string[]): Map<string, number> {
  const unique = [...new Set(speakers)];
  return new Map(unique.map((name, index) => [name, index]));
}
