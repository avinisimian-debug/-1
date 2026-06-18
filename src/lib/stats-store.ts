import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

interface DailyStats {
  date: string;
  transcriptions: number;
}

function getDataDir(): string {
  if (process.env.VERCEL) {
    return join(tmpdir(), "meetscribe-data");
  }
  return join(process.cwd(), "data");
}

const DATA_DIR = getDataDir();
const STATS_FILE = join(DATA_DIR, "stats.json");

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readStats(): Promise<DailyStats> {
  try {
    const raw = await readFile(STATS_FILE, "utf8");
    const parsed = JSON.parse(raw) as DailyStats;
    if (parsed.date !== todayKey()) {
      return { date: todayKey(), transcriptions: 0 };
    }
    return parsed;
  } catch {
    return { date: todayKey(), transcriptions: 0 };
  }
}

async function writeStats(stats: DailyStats) {
  await ensureDataDir();
  await writeFile(STATS_FILE, JSON.stringify(stats, null, 2), "utf8");
}

export async function incrementTranscriptionsToday(): Promise<number> {
  const stats = await readStats();
  const next = {
    date: todayKey(),
    transcriptions: stats.transcriptions + 1,
  };
  await writeStats(next);
  return next.transcriptions;
}

export async function getTranscriptionsToday(): Promise<number> {
  const stats = await readStats();
  return stats.transcriptions;
}
