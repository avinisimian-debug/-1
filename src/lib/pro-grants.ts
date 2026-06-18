import { readFile } from "fs/promises";
import { join } from "path";

const GRANTS_FILE = join(process.cwd(), "data", "pro-grants.json");

let cachedGrants: Set<string> | null = null;
let cacheLoadedAt = 0;
const CACHE_MS = 30_000;

export async function getProGrantedEmails(): Promise<Set<string>> {
  const now = Date.now();
  if (cachedGrants && now - cacheLoadedAt < CACHE_MS) {
    return cachedGrants;
  }

  try {
    const raw = await readFile(GRANTS_FILE, "utf8");
    const emails = JSON.parse(raw) as string[];
    cachedGrants = new Set(
      emails.map((e) => e.trim().toLowerCase()).filter(Boolean),
    );
  } catch {
    cachedGrants = new Set();
  }

  cacheLoadedAt = now;
  return cachedGrants;
}

export async function isProGranted(email: string): Promise<boolean> {
  const grants = await getProGrantedEmails();
  return grants.has(email.trim().toLowerCase());
}
