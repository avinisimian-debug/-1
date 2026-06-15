import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAllUsers } from "@/lib/users-store";

export async function GET() {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const users = await getAllUsers();

  return NextResponse.json({
    users,
    total: users.length,
  });
}
