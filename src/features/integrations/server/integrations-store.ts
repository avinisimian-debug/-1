import {
  readIntegrationsJson,
  writeIntegrationsJson,
} from "@/lib/integrations-persistence";
import type {
  IntegrationConfigPatch,
  UserIntegrationsConfig,
} from "../types";

type IntegrationsDb = Record<string, UserIntegrationsConfig>;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function readDb(): Promise<IntegrationsDb> {
  return readIntegrationsJson<IntegrationsDb>({});
}

async function writeDb(db: IntegrationsDb): Promise<void> {
  await writeIntegrationsJson(db);
}

export async function getUserIntegrations(
  email: string,
): Promise<UserIntegrationsConfig> {
  const db = await readDb();
  const key = normalizeEmail(email);
  return (
    db[key] ?? {
      email: key,
      updatedAt: new Date().toISOString(),
    }
  );
}

export async function updateUserIntegrations(
  email: string,
  patch: IntegrationConfigPatch,
): Promise<UserIntegrationsConfig> {
  const key = normalizeEmail(email);
  const db = await readDb();
  const current = db[key] ?? { email: key, updatedAt: new Date().toISOString() };

  const next: UserIntegrationsConfig = {
    ...current,
    ...patch,
    email: key,
    updatedAt: new Date().toISOString(),
  };

  db[key] = next;
  await writeDb(db);
  return next;
}
