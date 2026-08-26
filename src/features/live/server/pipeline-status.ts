export type LivePipelineStatus = {
  /** Recall (or simulate) can auto-join meetings */
  autoJoin: boolean;
  provider: "recall" | "manual" | "simulate";
  /** AssemblyAI + OpenAI + Blob present for closeout after recording */
  closeoutReady: boolean;
  hasRecall: boolean;
  hasAssemblyAI: boolean;
  hasOpenAI: boolean;
  hasBlob: boolean;
  hasCronSecret: boolean;
};

export function getLivePipelineStatus(): LivePipelineStatus {
  const hasRecall = Boolean(process.env.RECALL_AI_API_KEY?.trim());
  const simulate = process.env.MEETING_BOT_SIMULATE === "1";
  const hasAssemblyAI = Boolean(process.env.ASSEMBLYAI_API_KEY?.trim());
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY?.trim());
  const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
  const hasCronSecret = Boolean(process.env.CRON_SECRET?.trim());

  const provider: LivePipelineStatus["provider"] = simulate
    ? "simulate"
    : hasRecall
      ? "recall"
      : "manual";

  return {
    autoJoin: simulate || hasRecall,
    provider,
    closeoutReady: hasAssemblyAI && hasOpenAI && hasBlob,
    hasRecall,
    hasAssemblyAI,
    hasOpenAI,
    hasBlob,
    hasCronSecret,
  };
}
