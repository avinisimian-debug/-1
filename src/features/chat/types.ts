export interface ChatCitation {
  timestamp: string;
  speaker?: string;
  quote?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: ChatCitation[];
  createdAt: string;
}

export interface ChatTranscriptResponse {
  answer: string;
  citations: ChatCitation[];
  model: string;
}

export interface ChatPromptPreset {
  id: string;
  labelKey:
    | "chatPromptEmail"
    | "chatPromptActions"
    | "chatPromptSwot"
    | "chatPromptLegal"
    | "chatPromptTranslate";
  prompt: string;
}

export const CHAT_PROMPT_PRESETS: ChatPromptPreset[] = [
  {
    id: "email",
    labelKey: "chatPromptEmail",
    prompt:
      "Draft a professional follow-up email to attendees summarizing decisions, action items, and next steps. Include a clear subject line.",
  },
  {
    id: "actions",
    labelKey: "chatPromptActions",
    prompt:
      "Extract all action items with assignees/owners and deadlines when mentioned. Format as a prioritized checklist.",
  },
  {
    id: "swot",
    labelKey: "chatPromptSwot",
    prompt:
      "Create a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) based on this meeting discussion.",
  },
  {
    id: "legal",
    labelKey: "chatPromptLegal",
    prompt:
      "Generate key takeaways and flag any legal, compliance, contractual, or risk-related concerns mentioned in the meeting.",
  },
  {
    id: "translate",
    labelKey: "chatPromptTranslate",
    prompt:
      "Translate the key points of this meeting into both English and Hebrew. Keep bullet points concise.",
  },
];
