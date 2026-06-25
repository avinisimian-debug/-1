const MAX_URL_LENGTH = 2048;

export function validateWebhookUrl(
  url: string,
): { ok: true } | { ok: false; error: string } {
  const trimmed = url.trim();
  if (!trimmed) {
    return { ok: false, error: "Webhook URL is required." };
  }
  if (trimmed.length > MAX_URL_LENGTH) {
    return { ok: false, error: "Webhook URL is too long." };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") {
      return { ok: false, error: "Webhook URL must use HTTPS." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Webhook URL is invalid." };
  }
}
