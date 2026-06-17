import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Validated environment variables.
 *
 * Mirrors `.env.example` / `.env.local` keys. Import from server code only.
 * Existing code may continue using `process.env` until migration is complete.
 *
 * Set `SKIP_ENV_VALIDATION=1` in CI/Docker when secrets are unavailable.
 */
export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    /** OpenAI — transcription & analysis */
    OPENAI_API_KEY: z.string().min(1),

    /** NextAuth — required */
    AUTH_SECRET: z.string().min(1),

    /** Production URL (no trailing slash). Required on Vercel. */
    AUTH_URL: z.string().url().optional(),

    /** Google OAuth — use GOOGLE_CLIENT_ID/SECRET or AUTH_GOOGLE_ID/SECRET */
    GOOGLE_CLIENT_ID: z.string().min(1).optional(),
    GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
    AUTH_GOOGLE_ID: z.string().min(1).optional(),
    AUTH_GOOGLE_SECRET: z.string().min(1).optional(),

    /** Admin panel access at /admin/users */
    ADMIN_EMAIL: z.string().email().optional(),

    /** PayPal server credentials */
    PAYPAL_CLIENT_ID: z.string().min(1).optional(),
    PAYPAL_CLIENT_SECRET: z.string().min(1).optional(),
    PAYPAL_MODE: z.enum(["sandbox", "live"]).optional(),

    /** Override path to ffmpeg binary (large-file processing) */
    FFMPEG_BIN: z.string().optional(),
  },

  client: {
    /** PayPal button — must match PAYPAL_CLIENT_ID in sandbox/live */
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: z.string().min(1).optional(),

    /** Google Sign-In button (GIS) — same value as GOOGLE_CLIENT_ID */
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
    PAYPAL_MODE: process.env.PAYPAL_MODE,
    FFMPEG_BIN: process.env.FFMPEG_BIN,
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});

export type ServerEnv = typeof env;
