export const transcriptionKeys = {
  all: ["transcription"] as const,
  result: (id: string) => [...transcriptionKeys.all, "result", id] as const,
};
