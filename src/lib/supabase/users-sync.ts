import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { StazUserRow } from "@/lib/supabase/admin";
import type { StoredUser } from "@/lib/users-store";

function toRow(user: StoredUser): StazUserRow {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    provider: user.provider,
    plan: user.plan,
    registered_at: user.registeredAt,
    last_login_at: user.lastLoginAt,
    paid_at: user.paidAt ?? null,
    paypal_transaction_id: user.paypalTransactionId ?? null,
    pro_trial_ends_at: user.proTrialEndsAt ?? null,
    pro_trial_used: user.proTrialUsed ?? null,
    paypal_subscription_id: user.paypalSubscriptionId ?? null,
    pro_subscription_status: user.proSubscriptionStatus ?? null,
    pro_lifetime: user.proLifetime ?? null,
    synced_at: new Date().toISOString(),
  };
}

/** Upsert one user into Supabase `staz_users` (best-effort). */
export async function syncUserToSupabase(user: StoredUser): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const { error } = await supabase
    .from("staz_users")
    .upsert(toRow(user) as never, { onConflict: "id" });

  if (error) {
    console.error("[supabase-users] sync failed:", user.email, error.message);
  }
}

/** Upsert many users (admin backfill). */
export async function syncUsersToSupabase(
  users: StoredUser[],
): Promise<{ synced: number; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      synced: 0,
      error: "Supabase not configured (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)",
    };
  }

  if (users.length === 0) return { synced: 0 };

  const rows = users.map(toRow);
  const chunkSize = 100;
  let synced = 0;

  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabase
      .from("staz_users")
      .upsert(chunk as never, { onConflict: "id" });

    if (error) {
      return { synced, error: error.message };
    }
    synced += chunk.length;
  }

  return { synced };
}
