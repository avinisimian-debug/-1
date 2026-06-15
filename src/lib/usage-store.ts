import type { PlanTier } from "./constants";
import { PLAN_LIMITS } from "./constants";

const USAGE_KEY = "meetscribe-usage";

interface UsageRecord {
  month: string;
  count: number;
}

function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function readRecord(): UsageRecord {
  if (typeof window === "undefined") {
    return { month: currentMonth(), count: 0 };
  }
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (!raw) return { month: currentMonth(), count: 0 };
    const parsed = JSON.parse(raw) as UsageRecord;
    if (parsed.month !== currentMonth()) {
      return { month: currentMonth(), count: 0 };
    }
    return parsed;
  } catch {
    return { month: currentMonth(), count: 0 };
  }
}

function writeRecord(record: UsageRecord): void {
  localStorage.setItem(USAGE_KEY, JSON.stringify(record));
}

export function getUsageCount(): number {
  return readRecord().count;
}

export function getUsageLimit(plan: PlanTier): number {
  return PLAN_LIMITS[plan].transcriptionsPerMonth;
}

export function canTranscribe(plan: PlanTier): boolean {
  return getUsageCount() < getUsageLimit(plan);
}

export function incrementUsage(): void {
  const record = readRecord();
  writeRecord({ month: record.month, count: record.count + 1 });
}

export function getUsagePercent(plan: PlanTier): number {
  const limit = getUsageLimit(plan);
  if (limit === 0) return 100;
  return Math.min(100, Math.round((getUsageCount() / limit) * 100));
}
