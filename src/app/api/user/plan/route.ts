import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserPlan } from "@/lib/users-store";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const plan = await getUserPlan(session.user.email);

  return NextResponse.json({ plan });
}
