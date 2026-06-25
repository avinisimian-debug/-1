export interface AiInsights {
  executiveSummary: string;
  actionItems: string[];
  topics: string[];
  generatedAt: string;
  model: string;
}

export interface GenerateInsightsInput {
  transcriptText: string;
  fileName?: string;
}
