import { webhooksPersistence } from "@/lib/webhooks-persistence";
import type {
  WebhookSettings,
  WebhookSettingsPatch,
} from "../types";

function emptySettings(userId: string): WebhookSettings {
  return {
    userId,
    url: "",
    isActive: false,
    updatedAt: new Date().toISOString(),
  };
}

export function resolveUserId(email: string): string {
  return email.trim().toLowerCase();
}

export async function getWebhookSettings(
  userId: string,
): Promise<WebhookSettings> {
  const db = await webhooksPersistence.read();
  return db[userId] ?? emptySettings(userId);
}

export async function updateWebhookSettings(
  userId: string,
  patch: WebhookSettingsPatch,
): Promise<WebhookSettings> {
  const db = await webhooksPersistence.read();
  const current = db[userId] ?? emptySettings(userId);

  const next: WebhookSettings = {
    ...current,
    userId,
    updatedAt: new Date().toISOString(),
  };

  if (patch.url !== undefined) {
    next.url = patch.url.trim();
  }

  if (patch.isActive !== undefined) {
    next.isActive = patch.isActive;
  }

  if (patch.signingKey !== undefined) {
    const trimmed = patch.signingKey.trim();
    next.signingKey = trimmed || undefined;
  }

  db[userId] = next;
  await webhooksPersistence.write(db);
  return next;
}

/** @deprecated Use getWebhookSettings */
export async function getUserWebhooks(email: string) {
  const settings = await getWebhookSettings(resolveUserId(email));
  return {
    email: settings.userId,
    updatedAt: settings.updatedAt,
    completion: {
      url: settings.url,
      enabled: settings.isActive,
      secret: settings.signingKey,
    },
  };
}

/** @deprecated Use updateWebhookSettings */
export async function updateUserWebhooks(
  email: string,
  patch: { completion?: { url?: string; enabled?: boolean; secret?: string } },
) {
  const userId = resolveUserId(email);
  const settings = await updateWebhookSettings(userId, {
    url: patch.completion?.url,
    isActive: patch.completion?.enabled,
    signingKey: patch.completion?.secret,
  });
  return getUserWebhooks(settings.userId);
}
