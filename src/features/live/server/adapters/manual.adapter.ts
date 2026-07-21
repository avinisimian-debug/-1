import type { LiveSession } from "../../types";
import type { BotDispatchResult, MeetingBotAdapter } from "./bot-adapter";

/**
 * Manual / attach-recording mode when no cloud bot provider is configured.
 * Cron still "dispatches" — session waits for recording upload or RTMP ingest.
 */
export const manualBotAdapter: MeetingBotAdapter = {
  id: "manual",
  isAvailable() {
    return true;
  },
  async dispatch(session: LiveSession): Promise<BotDispatchResult> {
    return {
      provider: "manual",
      externalBotId: `manual-${session.id}`,
      status: "awaiting_recording",
      message:
        "No RECALL_AI_API_KEY — awaiting recording upload or platform cloud recording link.",
    };
  },
};

/**
 * Dev/demo adapter: marks session as recording without external API.
 * Enabled when MEETING_BOT_SIMULATE=1.
 */
export const simulatedBotAdapter: MeetingBotAdapter = {
  id: "simulated",
  isAvailable() {
    return process.env.MEETING_BOT_SIMULATE === "1";
  },
  async dispatch(session: LiveSession): Promise<BotDispatchResult> {
    return {
      provider: "simulated",
      externalBotId: `sim-${session.id}`,
      status: "awaiting_recording",
      message: "Simulated bot armed — upload a recording to continue the pipeline.",
    };
  },
};
