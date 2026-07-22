import OpenAI from "openai";
import { getAppBaseUrl } from "@/lib/paypal-subscriptions";
import { normalizeSecret } from "@/lib/transcription-ready";
import { readPersistedJson } from "@/lib/user-persistence";

const CHECK_TIMEOUT_MS = 8_000;

export type HealthStatus = "healthy" | "degraded" | "unhealthy";

export interface HealthCheckResult {
  name: string;
  status: HealthStatus;
  latencyMs: number;
  message: string;
  details?: Record<string, string | boolean | number>;
}

export interface SystemHealthReport {
  status: HealthStatus;
  checkedAt: string;
  checks: HealthCheckResult[];
}

export interface SystemHealthCheckOptions {
  /** When false, skips outbound HTTP to the webhook URL (faster local checks). */
  probeWebhook?: boolean;
}

function worstStatus(checks: HealthCheckResult[]): HealthStatus {
  if (checks.some((c) => c.status === "unhealthy")) return "unhealthy";
  if (checks.some((c) => c.status === "degraded")) return "degraded";
  return "healthy";
}

async function withLatency<T>(
  fn: () => Promise<T>,
): Promise<{ result: T; latencyMs: number }> {
  const start = performance.now();
  const result = await fn();
  return { result, latencyMs: Math.round(performance.now() - start) };
}

/**
 * Verifies the persistence layer (Vercel Blob or local JSON).
 * There is no traditional SQL database in this app — Blob/local JSON is the data store.
 */
export async function checkPersistenceLayer(): Promise<HealthCheckResult> {
  const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  const onVercel = Boolean(process.env.VERCEL);

  try {
    const { latencyMs } = await withLatency(async () => {
      await readPersistedJson<Record<string, unknown>>({});
    });

    if (onVercel && !hasBlobToken) {
      return {
        name: "persistence",
        status: "degraded",
        latencyMs,
        message: "Readable, but Vercel deploy has no BLOB_READ_WRITE_TOKEN — data is ephemeral in /tmp.",
        details: {
          backend: "local-tmp",
          blobConfigured: false,
          onVercel: true,
        },
      };
    }

    return {
      name: "persistence",
      status: "healthy",
      latencyMs,
      message: hasBlobToken ? "Vercel Blob persistence is reachable." : "Local JSON persistence is reachable.",
      details: {
        backend: hasBlobToken ? "vercel-blob" : "local-json",
        blobConfigured: hasBlobToken,
        onVercel,
      },
    };
  } catch (error) {
    return {
      name: "persistence",
      status: "unhealthy",
      latencyMs: 0,
      message: error instanceof Error ? error.message : "Persistence read failed.",
      details: { blobConfigured: hasBlobToken, onVercel },
    };
  }
}

/**
 * Lightweight OpenAI credential check (models list). Transcription uses Whisper via this key.
 */
export async function checkOpenAI(): Promise<HealthCheckResult> {
  const apiKey = normalizeSecret(process.env.OPENAI_API_KEY);

  if (!apiKey) {
    return {
      name: "openai",
      status: "unhealthy",
      latencyMs: 0,
      message: "OPENAI_API_KEY is not configured.",
      details: { configured: false },
    };
  }

  try {
    const client = new OpenAI({
      apiKey,
      timeout: CHECK_TIMEOUT_MS,
      maxRetries: 0,
    });

    const { latencyMs } = await withLatency(() => client.models.retrieve("whisper-1"));

    return {
      name: "openai",
      status: "healthy",
      latencyMs,
      message: "OpenAI API key is valid.",
      details: { configured: true, provider: "openai-whisper" },
    };
  } catch (error) {
    const message =
      error instanceof OpenAI.APIError
        ? `OpenAI API error (${error.status}): ${error.message}`
        : error instanceof Error
          ? error.message
          : "OpenAI check failed.";

    const status =
      error instanceof OpenAI.AuthenticationError ? "unhealthy" : "degraded";

    return {
      name: "openai",
      status,
      latencyMs: 0,
      message,
      details: { configured: true },
    };
  }
}

/**
 * AssemblyAI is the primary STT engine when ASSEMBLYAI_API_KEY is set.
 * Whisper (OpenAI) remains the fallback and powers GPT analysis.
 */
export async function checkAssemblyAI(): Promise<HealthCheckResult> {
  const apiKey = process.env.ASSEMBLYAI_API_KEY?.trim();

  if (!apiKey) {
    return {
      name: "assemblyai",
      status: "healthy",
      latencyMs: 0,
      message: "Not configured — using OpenAI Whisper STT fallback.",
      details: { configured: false, skipped: true },
    };
  }

  try {
    const { latencyMs } = await withLatency(async () => {
      const res = await fetch("https://api.assemblyai.com/v2/transcript", {
        method: "GET",
        headers: { authorization: apiKey },
        signal: AbortSignal.timeout(CHECK_TIMEOUT_MS),
      });
      if (res.status === 401) {
        throw new Error("Invalid AssemblyAI API key.");
      }
      if (!res.ok && res.status !== 404) {
        throw new Error(`AssemblyAI responded with HTTP ${res.status}.`);
      }
    });

    return {
      name: "assemblyai",
      status: "healthy",
      latencyMs,
      message: "AssemblyAI API key accepted.",
      details: { configured: true },
    };
  } catch (error) {
    return {
      name: "assemblyai",
      status: "unhealthy",
      latencyMs: 0,
      message: error instanceof Error ? error.message : "AssemblyAI check failed.",
      details: { configured: true },
    };
  }
}

/**
 * Probes the PayPal webhook route. A 2xx response means the route is deployed and reachable.
 * Signature verification is a separate security concern (currently not implemented).
 */
export async function checkWebhookEndpoint(
  probe = true,
): Promise<HealthCheckResult> {
  const webhookUrl = `${getAppBaseUrl()}/api/paypal/webhook`;

  if (!probe) {
    return {
      name: "webhook",
      status: "healthy",
      latencyMs: 0,
      message: "Webhook URL configured (probe skipped).",
      details: { url: webhookUrl, probed: false },
    };
  }

  try {
    const { latencyMs } = await withLatency(async () => {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_type: "HEALTHCHECK", id: "system-health-probe" }),
        signal: AbortSignal.timeout(CHECK_TIMEOUT_MS),
      });

      if (!res.ok) {
        throw new Error(`Webhook endpoint returned HTTP ${res.status}.`);
      }
    });

    return {
      name: "webhook",
      status: "healthy",
      latencyMs,
      message: "PayPal webhook endpoint is reachable.",
      details: {
        url: webhookUrl,
        probed: true,
        signatureVerification: false,
      },
    };
  } catch (error) {
    return {
      name: "webhook",
      status: "degraded",
      latencyMs: 0,
      message:
        error instanceof Error
          ? error.message
          : "Webhook probe failed — route may be unreachable from this runtime.",
      details: { url: webhookUrl, probed: true },
    };
  }
}

/** Runs all subsystem checks and returns an aggregate report. */
export async function runSystemHealthCheck(
  options: SystemHealthCheckOptions = {},
): Promise<SystemHealthReport> {
  const probeWebhook = options.probeWebhook ?? true;

  const checks = await Promise.all([
    checkPersistenceLayer(),
    checkOpenAI(),
    checkAssemblyAI(),
    checkWebhookEndpoint(probeWebhook),
  ]);

  return {
    status: worstStatus(checks),
    checkedAt: new Date().toISOString(),
    checks,
  };
}
