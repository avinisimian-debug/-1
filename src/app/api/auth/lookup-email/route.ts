import { NextResponse } from "next/server";
import { z } from "zod";
import { findUserByEmail } from "@/lib/users-store";

export const runtime = "nodejs";

const Body = z.object({
  email: z.string().email(),
});

/** Returns whether an account exists — used to skip name for returning users. */
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

  const email = parsed.data.email.trim().toLowerCase();
  const existing = await findUserByEmail(email);

  return NextResponse.json({
    exists: Boolean(existing),
    name: existing?.name,
  });
}
