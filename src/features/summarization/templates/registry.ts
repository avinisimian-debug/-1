import type { SummaryTemplate, SummaryTemplateId } from "../types";

export const SUMMARY_TEMPLATES: Record<SummaryTemplateId, SummaryTemplate> = {
  manager: {
    id: "manager",
    displayName: "Manager",
    description: "Executive brief — decisions, owners, and next steps.",
    sections: ["headline", "decisions", "executive", "actions"],
    promptDefinition: `You are a chief of staff writing for a busy executive.
Focus on: headline outcome, key decisions, executive bullets, and action items with owners.
Tone: concise, outcome-oriented, no filler. Write in the same language as the transcript.`,
  },
  student: {
    id: "student",
    displayName: "Student",
    description: "Study notes — concepts, takeaways, and review questions.",
    sections: ["overview", "concepts", "takeaways", "review"],
    promptDefinition: `You are an academic note-taker helping a student review a lecture or study session.
Focus on: plain-language overview, core concepts, memorable takeaways, and 3-5 review questions.
Tone: clear, educational, structured for revision. Write in the same language as the transcript.`,
  },
  technical: {
    id: "technical",
    displayName: "Technical",
    description: "Engineering digest — architecture, risks, and implementation tasks.",
    sections: ["headline", "architecture", "risks", "implementation"],
    proOnly: true,
    promptDefinition: `You are a senior staff engineer writing a technical meeting digest.
Focus on: system decisions, architecture notes, risks/blockers, and implementation tasks with owners.
Tone: precise, technical, bullet-heavy. Write in the same language as the transcript.`,
  },
};

export const SUMMARY_TEMPLATE_LIST = Object.values(SUMMARY_TEMPLATES);

export function getSummaryTemplate(id: SummaryTemplateId): SummaryTemplate {
  const template = SUMMARY_TEMPLATES[id];
  if (!template) {
    throw new Error(`Unknown summary template: ${id}`);
  }
  return template;
}
