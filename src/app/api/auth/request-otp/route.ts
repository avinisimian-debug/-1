import { NextResponse } from "next/server";
import { z } from "zod";
import {
  assertResendReady,
  issueEmailOtp,
  OtpDeliveryError,
  OtpRateLimitError,
} from "@/lib/email-otp";
import {
  CloudStorageUnavailableError,
  resendFromIsTestDomain,
} from "@/lib/runtime-env";
import { registerOrUpdateUser } from "@/lib/users-store";

export const runtime = "nodejs";

const Body = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(120).optional(),
});

function resendFailureMessage(status: number, bodyText: string): string {
  const lower = bodyText.toLowerCase();
  if (
    status === 403 ||
    lower.includes("verify a domain") ||
    lower.includes("only send testing emails") ||
    lower.includes("domain is not verified")
  ) {
    return "שליחת המייל חסומה: צריך לאמת את הדומיין ב-Resend (לא resend.dev) ולהגדיר RESEND_FROM_EMAIL כמו Staz AI <noreply@1stazai.com>.";
  }
  return "שליחת הקוד נכשלה. נסו שוב או התחברו עם Google.";
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "בקשה לא תקינה." }, { status: 400 });
  }

  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "נא להזין אימייל תקין" }, { status: 400 });
  }

  try {
    assertResendReady();
  } catch (error) {
    const message =
      error instanceof OtpDeliveryError
        ? error.message
        : "התחברות באימייל דורשת שליחת קוד. התחברו עם Google.";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  if (resendFromIsTestDomain()) {
    return NextResponse.json(
      {
        error:
          "שליחת קוד דורשת דומיין מאומת ב-Resend. הגדירו RESEND_FROM_EMAIL עם @1stazai.com (לא resend.dev).",
      },
      { status: 503 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const name = parsed.data.name?.trim() || email.split("@")[0] || "User";

  // Persist signup contact for product updates even if delivery fails later.
  try {
    await registerOrUpdateUser({ name, email, provider: "email" });
  } catch (error) {
    console.error("[otp] contact persist failed");
    void error;
  }

  let code: string;
  try {
    code = await issueEmailOtp(email);
  } catch (error) {
    if (error instanceof OtpRateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    if (error instanceof CloudStorageUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    return NextResponse.json(
      { error: "לא ניתן ליצור קוד כניסה. נסו שוב." },
      { status: 500 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY!.trim();
  const from = process.env.RESEND_FROM_EMAIL!.trim();

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "קוד כניסה ל-Staz",
        text: `קוד הכניסה שלכם ל-Staz: ${code}\nתוקף: 10 דקות. אל תשתפו את הקוד.`,
      }),
    });
    if (!res.ok) {
      const bodyText = await res.text().catch(() => "");
      console.error("[otp] resend HTTP", res.status, bodyText.slice(0, 300));
      return NextResponse.json(
        { error: resendFailureMessage(res.status, bodyText) },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("[otp] resend failed");
    void error;
    return NextResponse.json(
      { error: "שליחת הקוד נכשלה. נסו שוב או התחברו עם Google." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
