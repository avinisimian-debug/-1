import type { LiveSession } from "../../types";

export interface BotDispatchResult {
  provider: "recall" | "manual" | "simulated";
  externalBotId?: string;
  status: LiveSession["botStatus"];
  message?: string;
}

export interface MeetingBotAdapter {
  id: "recall" | "manual" | "simulated";
  isAvailable(): boolean;
  /**
   * Join the meeting and begin recording.
   * For Recall: creates a bot via API.
   * For manual: marks session as awaiting_recording.
   */
  dispatch(session: LiveSession): Promise<BotDispatchResult>;
}
