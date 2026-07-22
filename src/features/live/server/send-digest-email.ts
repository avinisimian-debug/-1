import { normalizeSecret } from "@/lib/transcription-ready";

export type DigestEmailPayload = {
  to: string[];
  meetingTitle: string;
  meetingUrl?: string;
  playbackUrl: string;
  subject: string;
  bodyText: string;
  executiveSummary?: string;
  actionItems?: string[];
};

function buildHtml(payload: DigestEmailPayload): string {
  const actions =
    payload.actionItems && payload.actionItems.length > 0
      ? `<h3 style="margin:24px 0 8px;font-family:system-ui,sans-serif;">Action items</h3>
         <ul style="font-family:system-ui,sans-serif;line-height:1.5;">
           ${payload.actionItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
         </ul>`
      : "";

  const summary = payload.executiveSummary
    ? `<h3 style="margin:24px 0 8px;font-family:system-ui,sans-serif;">Executive summary</h3>
       <p style="font-family:system-ui,sans-serif;line-height:1.6;white-space:pre-wrap;">${escapeHtml(payload.executiveSummary)}</p>`
    : "";

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#0b0b0f;color:#f4f4f5;">
    <div style="max-width:640px;margin:0 auto;background:#18181b;border-radius:16px;padding:28px;border:1px solid #27272a;">
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#a1a1aa;font-family:system-ui,sans-serif;">Staz AI</p>
      <h1 style="margin:0 0 12px;font-size:22px;font-family:system-ui,sans-serif;">${escapeHtml(payload.meetingTitle)}</h1>
      <p style="margin:0 0 20px;font-family:system-ui,sans-serif;line-height:1.6;white-space:pre-wrap;">${escapeHtml(payload.bodyText)}</p>
      ${summary}
      ${actions}
      <p style="margin:28px 0 0;">
        <a href="${escapeAttr(payload.playbackUrl)}"
           style="display:inline-block;background:#6366f1;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-family:system-ui,sans-serif;font-weight:600;">
          Open meeting digest
        </a>
      </p>
    </div>
  </body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

export function isEmailDispatchConfigured(): boolean {
  return Boolean(normalizeSecret(process.env.RESEND_API_KEY));
}

/**
 * Send meeting digest via Resend when RESEND_API_KEY is set.
 * No-ops (returns skipped) when unset — never throws to callers.
 */
export async function sendMeetingDigestEmail(
  payload: DigestEmailPayload,
): Promise<{ sent: boolean; skipped?: string; id?: string; error?: string }> {
  const apiKey = normalizeSecret(process.env.RESEND_API_KEY);
  if (!apiKey) {
    return { sent: false, skipped: "RESEND_API_KEY not configured" };
  }

  const recipients = [...new Set(payload.to.map((e) => e.trim().toLowerCase()).filter(Boolean))];
  if (recipients.length === 0) {
    return { sent: false, skipped: "no recipients" };
  }

  const from =
    normalizeSecret(process.env.RESEND_FROM_EMAIL) ||
    "Staz AI <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: recipients,
        subject: payload.subject,
        text: `${payload.bodyText}\n\nOpen digest: ${payload.playbackUrl}`,
        html: buildHtml(payload),
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[email] Resend failed:", res.status, text.slice(0, 300));
      return {
        sent: false,
        error: `Resend ${res.status}: ${text.slice(0, 160)}`,
      };
    }

    const data = (await res.json()) as { id?: string };
    return { sent: true, id: data.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Email send failed";
    console.error("[email] dispatch error:", message);
    return { sent: false, error: message };
  }
}
