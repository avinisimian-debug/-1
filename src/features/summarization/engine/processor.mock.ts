import type {
  IngestedTranscript,
  SummaryDocument,
  SummaryProcessor,
  SummarySection,
  SummaryTemplate,
} from "../types";

function section(
  id: string,
  heading: string,
  body?: string,
  bullets?: string[],
): SummarySection {
  return { id, heading, body, bullets };
}

function managerDocument(
  ingested: IngestedTranscript,
  template: SummaryTemplate,
): SummaryDocument {
  const { metadata } = ingested;
  return {
    templateId: template.id,
    title: metadata.headline ?? ingested.fileName,
    generatedAt: new Date().toISOString(),
    sections: [
      section(
        "headline",
        "Executive headline",
        metadata.headline ??
          `Leadership review of ${ingested.fileName} (${ingested.duration}).`,
      ),
      section(
        "decisions",
        "Key decisions",
        undefined,
        metadata.decisions?.length
          ? metadata.decisions
          : ["No explicit decisions captured — review transcript for commitments."],
      ),
      section(
        "executive",
        "Executive summary",
        metadata.overview,
        metadata.executive.length
          ? metadata.executive
          : metadata.keyTakeaways.slice(0, 5),
      ),
      section(
        "actions",
        "Action items",
        undefined,
        metadata.actionItems.map(
          (item) =>
            `${item.task} — ${item.owner} (due ${item.deadline})${
              item.priority ? ` [${item.priority}]` : ""
            }`,
        ),
      ),
    ],
  };
}

function studentDocument(
  ingested: IngestedTranscript,
  template: SummaryTemplate,
): SummaryDocument {
  const { metadata } = ingested;
  const concepts =
    metadata.topics?.length
      ? metadata.topics
      : metadata.keyTakeaways.slice(0, 4).map((t) => t.split(/[.!?]/)[0]);

  return {
    templateId: template.id,
    title: `Study notes — ${ingested.fileName}`,
    generatedAt: new Date().toISOString(),
    sections: [
      section(
        "overview",
        "Session overview",
        metadata.overview ??
          `Notes from a ${ingested.duration} session. Focus on the takeaways below before your next review.`,
      ),
      section("concepts", "Core concepts", undefined, concepts),
      section(
        "takeaways",
        "Key takeaways",
        undefined,
        metadata.keyTakeaways.length
          ? metadata.keyTakeaways
          : ["Review the full transcript and highlight unfamiliar terms."],
      ),
      section(
        "review",
        "Review questions",
        undefined,
        [
          "What were the three most important ideas discussed?",
          "Which decisions or conclusions should you remember?",
          "What follow-up tasks were assigned and to whom?",
          "What would you explain to a classmate in two minutes?",
        ],
      ),
    ],
  };
}

function technicalDocument(
  ingested: IngestedTranscript,
  template: SummaryTemplate,
): SummaryDocument {
  const { metadata } = ingested;
  const implementation = metadata.actionItems.map(
    (item) =>
      `[${item.priority ?? "medium"}] ${item.task} → ${item.owner} (${item.deadline})`,
  );

  return {
    templateId: template.id,
    title: `Technical digest — ${ingested.fileName}`,
    generatedAt: new Date().toISOString(),
    sections: [
      section(
        "headline",
        "Technical headline",
        metadata.headline ??
          `Engineering sync on ${ingested.fileName} — ${ingested.duration} recorded.`,
      ),
      section(
        "architecture",
        "Architecture & system notes",
        metadata.overview,
        metadata.executive.length
          ? metadata.executive
          : metadata.decisions ?? metadata.keyTakeaways.slice(0, 5),
      ),
      section(
        "risks",
        "Risks & blockers",
        undefined,
        metadata.decisions?.length
          ? metadata.decisions.map((d) => `Decision risk: ${d}`)
          : ["No blockers flagged — validate during standup."],
      ),
      section(
        "implementation",
        "Implementation tasks",
        undefined,
        implementation.length
          ? implementation
          : ["No tasks extracted — scan transcript for TODOs."],
      ),
    ],
  };
}

const BUILDERS: Record<
  SummaryTemplate["id"],
  (ingested: IngestedTranscript, template: SummaryTemplate) => SummaryDocument
> = {
  manager: managerDocument,
  student: studentDocument,
  technical: technicalDocument,
};

/** Mock processor — instant, no LLM. Swap for OpenAI handler in production. */
export const mockSummaryProcessor: SummaryProcessor = {
  process(ingested, template) {
    const build = BUILDERS[template.id];
    return build(ingested, template);
  },
};
