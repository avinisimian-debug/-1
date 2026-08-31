-- Staz AI users mirror (synced from Next.js users-store / Vercel Blob)
-- View in Supabase: Table Editor → staz_users
-- Access: service role only (RLS enabled, no public policies)

CREATE TABLE IF NOT EXISTS public.staz_users (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  provider text NOT NULL CHECK (provider IN ('email', 'google')),
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  registered_at timestamptz NOT NULL,
  last_login_at timestamptz NOT NULL,
  paid_at timestamptz,
  paypal_transaction_id text,
  pro_trial_ends_at timestamptz,
  pro_trial_used boolean,
  paypal_subscription_id text,
  pro_subscription_status text,
  pro_lifetime boolean DEFAULT false,
  synced_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS staz_users_email_idx ON public.staz_users (email);
CREATE INDEX IF NOT EXISTS staz_users_plan_idx ON public.staz_users (plan);
CREATE INDEX IF NOT EXISTS staz_users_registered_at_idx ON public.staz_users (registered_at DESC);

ALTER TABLE public.staz_users ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.staz_users IS 'Staz AI app users synced from Next.js (service role only).';
