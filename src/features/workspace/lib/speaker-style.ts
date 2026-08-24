const SPEAKER_PALETTE = [
  {
    bg: "bg-[var(--accent-soft)]",
    text: "text-[var(--accent)]",
    ring: "ring-[color-mix(in_srgb,var(--accent)_22%,transparent)]",
    bubble: "bg-[var(--accent-soft)] border-[color-mix(in_srgb,var(--accent)_18%,transparent)]",
  },
  {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    ring: "ring-emerald-200",
    bubble: "bg-emerald-50 border-emerald-100",
  },
  {
    bg: "bg-amber-100",
    text: "text-amber-800",
    ring: "ring-amber-200",
    bubble: "bg-amber-50 border-amber-100",
  },
  {
    bg: "bg-sky-100",
    text: "text-sky-800",
    ring: "ring-sky-200",
    bubble: "bg-sky-50 border-sky-100",
  },
  {
    bg: "bg-[var(--bg-subtle)]",
    text: "text-[var(--ink-secondary)]",
    ring: "ring-[var(--line-subtle)]",
    bubble: "bg-[var(--bg-subtle)] border-[var(--line-subtle)]",
  },
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
