import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Validated environment variables for the media pipeline.
 *
 * Required for full integration:
 * - OPENAI_API_KEY — GPT insights & chat (Whisper fallback STT)
 * - BLOB_READ_WRITE_TOKEN — large direct-to-storage uploads
 * - ASSEMBLYAI_API_KEY — primary STT, diarization, YouTube/platform URLs
 *
 * Set `SKIP_ENV_VALIDATION=1` in CI when secrets are unavailable.
 */
export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    OPENAI_API_KEY: z.string().min(1),
    AUTH_SECRET: z.string().min(1),
    AUTH_URL: z.string().url().optional(),

    GOOGLE_CLIENT_ID: z.string().min(1).optional(),
    GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
    AUTH_GOOGLE_ID: z.string().min(1).optional(),
    AUTH_GOOGLE_SECRET: z.string().min(1).optional(),

    ADMIN_EMAIL: z.string().email().optional(),

    PAYPAL_CLIENT_ID: z.string().min(1).optional(),
    PAYPAL_CLIENT_SECRET: z.string().min(1).optional(),
    PAYPAL_MODE: z.enum(["sandbox", "live"]).optional(),

    FFMPEG_BIN: z.string().optional(),

    /** Vercel Blob — large Zoom/lecture uploads (multipart client upload). */
    BLOB_READ_WRITE_TOKEN: z.string().min(1).optional(),

    /** AssemblyAI — primary STT, speaker diarization, remote URL transcription. */
    ASSEMBLYAI_API_KEY: z.string().min(1).optional(),

    /**
     * Shared secret for AssemblyAI → `/api/webhooks/assemblyai`.
     * Falls back to AUTH_SECRET when unset.
     */
    ASSEMBLYAI_WEBHOOK_SECRET: z.string().min(1).optional(),

    /** Recall.ai — autonomous meeting bot join + recording */
    RECALL_AI_API_KEY: z.string().min(1).optional(),

    /** Protects GET /api/cron/live-bots */
    CRON_SECRET: z.string().min(1).optional(),

    /** Dev: force simulated bot adapter */
    MEETING_BOT_SIMULATE: z.string().optional(),
  },

  client: {
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: z.string().min(1).optional(),
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
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    ASSEMBLYAI_API_KEY: process.env.ASSEMBLYAI_API_KEY,
    ASSEMBLYAI_WEBHOOK_SECRET: process.env.ASSEMBLYAI_WEBHOOK_SECRET,
    RECALL_AI_API_KEY: process.env.RECALL_AI_API_KEY,
    CRON_SECRET: process.env.CRON_SECRET,
    MEETING_BOT_SIMULATE: process.env.MEETING_BOT_SIMULATE,
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});

export type ServerEnv = typeof env;
