/**
 * Webhook settings and outbound payload contracts.
 * @see POST /api/webhooks/test for the canonical test payload shape.
 */

export interface WebhookSettings {
  userId: string;
  url: string;
  signingKey?: string;
  isActive: boolean;
  updatedAt: string;
}

export interface WebhookSettingsPatch {
  url?: string;
  signingKey?: string;
  isActive?: boolean;
}

export interface WebhookTranscriptSegment {
  speaker: string;
  text: string;
  start: number;
  end: number;
}

export interface WebhookSummary {
  overview: string;
  executive: string;
  keyTakeaways: string[];
  markdown: string;
}

export interface TranscriptionCompletedWebhookPayload {
  event: "transcription.completed";
  status: "completed";
  source: "staz-ai";
  test?: boolean;
  metadata: {
    userEmail: string;
    plan: string;
    fileName: string;
    duration: number;
    processedAt: string;
  };
  summary: WebhookSummary;
  fullText: string;
  transcript: WebhookTranscriptSegment[];
  actionItems: string[];
}

export interface WebhookTestResult {
  ok: boolean;
  statusCode?: number;
}

/** @deprecated Use WebhookSettings */
export type CompletionWebhookConfig = Pick<
  WebhookSettings,
  "url" | "isActive"
> & {
  enabled: boolean;
  secret?: string;
};

/** @deprecated Use WebhookSettings */
export interface UserWebhooksConfig {
  email: string;
  updatedAt: string;
  completion?: CompletionWebhookConfig;
}

/** @deprecated Use WebhookSettingsPatch */
export type WebhooksConfigPatch = {
  completion?: CompletionWebhookConfig;
};
