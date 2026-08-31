/** Gentle live drift — bumps by 0–1 every few minutes so numbers feel alive. */
const LIVE_SLOT_MS = 2 * 60 * 1000;

interface RealStats {
  transcriptionsToday: number;
  downloadsToday: number;
  totalUsers: number;
}

export interface DisplayedPublicStats {
  transcriptionsToday: number;
  downloadsToday: number;
  totalUsers: number;
}

/**
 * Modest, credible social-proof numbers for an early-stage product.
 * Real usage is added on top — never inflated into thousands.
 */
export function getDisplayedPublicStats(
  real: RealStats,
  now = Date.now(),
): DisplayedPublicStats {
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const minutesToday = Math.floor((now - startOfDay.getTime()) / 60_000);
  const hour = new Date(now).getHours();

  // Slow daytime ramp (quiet at night, busier mid-day)
  const dayPulse =
    hour < 7 ? 0.15 : hour < 12 ? 0.55 : hour < 18 ? 1 : hour < 22 ? 0.7 : 0.25;
  const liveSlot = Math.floor(now / LIVE_SLOT_MS);

  // Community size: real signups + small cushion, hard-capped
  const totalUsers = Math.min(
    148,
    Math.max(14, real.totalUsers + 11 + (liveSlot % 5 === 0 ? 1 : 0)),
  );

  const transcriptionsToday = Math.min(
    36,
    Math.max(
      2,
      Math.floor(2 + dayPulse * 14 + minutesToday / 18) +
        real.transcriptionsToday +
        (liveSlot % 3 === 0 ? 1 : 0),
    ),
  );

  const downloadsToday = Math.min(
    24,
    Math.max(
      1,
      Math.floor(1 + dayPulse * 9 + minutesToday / 24) +
        real.downloadsToday +
        (liveSlot % 4 === 1 ? 1 : 0),
    ),
  );

  return { transcriptionsToday, downloadsToday, totalUsers };
}

export function formatSocialProofNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === "he" ? "he-IL" : locale, {
    maximumFractionDigits: 0,
  }).format(value);
}
