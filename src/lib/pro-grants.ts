import bundledProGrants from "../../data/pro-grants.json";
import { readFile } from "fs/promises";
import { join } from "path";

const GRANTS_FILE = join(process.cwd(), "data", "pro-grants.json");

let cachedGrants: Set<string> | null = null;
let cacheLoadedAt = 0;
const CACHE_MS = 30_000;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function parseEnvGrants(): string[] {
  const raw = process.env.PRO_GRANTED_EMAILS;
  if (!raw?.trim()) return [];
  return raw
    .split(/[,;\s]+/)
    .map(normalizeEmail)
    .filter(Boolean);
}

function parseBundledGrants(): string[] {
  return (bundledProGrants as string[]).map(normalizeEmail).filter(Boolean);
}

function parseAdminGrant(): string[] {
  const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return admin ? [admin] : [];
}

async function readFileGrants(): Promise<string[]> {
  try {
    const raw = await readFile(GRANTS_FILE, "utf8");
    const emails = JSON.parse(raw) as string[];
    return emails.map(normalizeEmail).filter(Boolean);
  } catch {
    return [];
  }
}

export async function getProGrantedEmails(): Promise<Set<string>> {
  const now = Date.now();
  if (cachedGrants && now - cacheLoadedAt < CACHE_MS) {
    return cachedGrants;
  }

  const grants = new Set([
    ...parseEnvGrants(),
    ...parseBundledGrants(),
    ...parseAdminGrant(),
    ...(await readFileGrants()),
  ]);
  cachedGrants = grants;
  cacheLoadedAt = now;
  return cachedGrants;
}

export async function isProGranted(email: string): Promise<boolean> {
  const grants = await getProGrantedEmails();
  return grants.has(normalizeEmail(email));
}
