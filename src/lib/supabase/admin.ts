import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type StazUserRow = {
  id: string;
  name: string;
  email: string;
  provider: "email" | "google";
  plan: "free" | "pro";
  registered_at: string;
  last_login_at: string;
  paid_at?: string | null;
  paypal_transaction_id?: string | null;
  pro_trial_ends_at?: string | null;
  pro_trial_used?: boolean | null;
  paypal_subscription_id?: string | null;
  pro_subscription_status?: string | null;
  pro_lifetime?: boolean | null;
  synced_at?: string;
};

let adminClient: SupabaseClient | null = null;

function getSupabaseUrl(): string | undefined {
  return (
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  );
}

function getServiceRoleKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
}

export function isSupabaseUsersSyncEnabled(): boolean {
  return Boolean(getSupabaseUrl() && getServiceRoleKey());
}

/** Server-only Supabase client (service role — bypasses RLS). */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseUsersSyncEnabled()) return null;

  if (!adminClient) {
    adminClient = createClient(getSupabaseUrl()!, getServiceRoleKey()!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return adminClient;
}
