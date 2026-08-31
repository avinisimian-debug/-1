import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isSupabaseUsersSyncEnabled } from "@/lib/supabase/admin";
import { syncUsersToSupabase } from "@/lib/supabase/users-sync";
import { getAllUsers } from "@/lib/users-store";

export async function POST() {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (!isSupabaseUsersSyncEnabled()) {
    return NextResponse.json(
      {
        error:
          "Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.",
      },
      { status: 503 },
    );
  }

  const users = await getAllUsers();
  const result = await syncUsersToSupabase(users);

  if (result.error) {
    return NextResponse.json(
      { error: result.error, synced: result.synced, total: users.length },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    synced: result.synced,
    total: users.length,
  });
}
