import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

export interface RuntimeAuthConfig {
  googleClientId?: string;
  googleClientSecret?: string;
  updatedAt?: string;
}

function getDataDir(): string {
  if (process.env.VERCEL) {
    return join(tmpdir(), "meetscribe-data");
  }
  return join(process.cwd(), "data");
}

const CONFIG_FILE = join(getDataDir(), "auth-config.json");

let cachedConfig: RuntimeAuthConfig | null = null;
let cacheLoadedAt = 0;
const CACHE_MS = 3_000;

async function ensureDataDir() {
  await mkdir(getDataDir(), { recursive: true });
}

export async function getRuntimeAuthConfig(): Promise<RuntimeAuthConfig> {
  const now = Date.now();
  if (cachedConfig && now - cacheLoadedAt < CACHE_MS) {
    return cachedConfig;
  }

  try {
    if (!existsSync(CONFIG_FILE)) {
      cachedConfig = {};
      cacheLoadedAt = now;
      return cachedConfig;
    }

    const raw = await readFile(CONFIG_FILE, "utf8");
    cachedConfig = JSON.parse(raw) as RuntimeAuthConfig;
    cacheLoadedAt = now;
    return cachedConfig;
  } catch {
    cachedConfig = {};
    cacheLoadedAt = now;
    return cachedConfig;
  }
}

export async function saveRuntimeAuthConfig(
  input: Pick<RuntimeAuthConfig, "googleClientId" | "googleClientSecret">,
): Promise<RuntimeAuthConfig> {
  const current = await getRuntimeAuthConfig();
  const next: RuntimeAuthConfig = {
    ...current,
    googleClientId: input.googleClientId?.trim() || current.googleClientId,
    googleClientSecret:
      input.googleClientSecret?.trim() || current.googleClientSecret,
    updatedAt: new Date().toISOString(),
  };

  await ensureDataDir();
  await writeFile(CONFIG_FILE, JSON.stringify(next, null, 2), "utf8");
  cachedConfig = next;
  cacheLoadedAt = Date.now();
  return next;
}

export function getAuthSetupOrigins(requestOrigin?: string | null): string[] {
  const origins = new Set<string>([
    "http://localhost:3000",
    "https://1stazai.com",
    "https://www.1stazai.com",
    "https://1-cswh.vercel.app",
  ]);

  if (process.env.AUTH_URL) {
    origins.add(process.env.AUTH_URL.replace(/\/$/, ""));
  }

  if (requestOrigin) {
    try {
      origins.add(new URL(requestOrigin).origin);
    } catch {
      // ignore invalid origin
    }
  }

  return [...origins];
}
