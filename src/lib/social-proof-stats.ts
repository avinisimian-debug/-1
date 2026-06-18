/** Marketing launch anchor — social proof grows from this date. */
const LAUNCH_EPOCH = new Date("2026-06-17T00:00:00Z").getTime();
const SLOT_MS = 3 * 60 * 1000;

interface RealStats {
  transcriptionsToday: number;
  totalUsers: number;
}

export interface DisplayedPublicStats {
  transcriptionsToday: number;
  totalUsers: number;
}

/**
 * Returns believable, time-based social proof numbers for the landing page.
 * Real signups/transcriptions are added on top of a launch baseline.
 */
export function getDisplayedPublicStats(real: RealStats): DisplayedPublicStats {
  const now = Date.now();
  const slots = Math.max(0, Math.floor((now - LAUNCH_EPOCH) / SLOT_MS));

  const baseUsers = 2_847;
  const usersPerSlot = 2 + (slots % 5);
  const totalUsers = baseUsers + slots * usersPerSlot + real.totalUsers;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const minutesToday = Math.floor((now - startOfDay.getTime()) / 60_000);

  const baseTranscriptions = 96 + Math.floor(minutesToday / 4) * 6;
  const slotBoost = Math.floor(slots % 7);
  const transcriptionsToday =
    baseTranscriptions + slotBoost + real.transcriptionsToday;

  return { transcriptionsToday, totalUsers };
}

export function formatSocialProofNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === "he" ? "he-IL" : locale, {
    maximumFractionDigits: 0,
  }).format(value);
}
