import type { SummaryFormatter } from "../../types";

function formatActionTable(
  items: Array<{ task: string; owner: string; deadline: string; priority?: string }>,
): string {
  if (!items.length) return "";
  const lines = [
    "| Priority | Task | Owner | Due |",
    "|----------|------|-------|-----|",
    ...items.map(
      (item) =>
        `| ${item.priority ?? "medium"} | ${item.task} | ${item.owner} | ${item.deadline} |`,
    ),
  ];
  return lines.join("\n");
}

export const markdownFormatter: SummaryFormatter = {
  format(document) {
    const lines: string[] = [
      `# ${document.title}`,
      "",
      `> **Generated** ${new Date(document.generatedAt).toLocaleString()} · Staz AI · \`${document.templateId}\` template`,
      "",
    ];

    for (const sec of document.sections) {
      lines.push(`## ${sec.heading}`);
      if (sec.body) {
        lines.push("", sec.body.trim(), "");
      }
      if (sec.bullets?.length) {
        for (const bullet of sec.bullets) {
          lines.push(`- ${bullet}`);
        }
        lines.push("");
      }
    }

    lines.push(
      "---",
      `_Exported from Staz AI · ${document.templateId} template_`,
    );

    return lines.join("\n").trim();
  },
};

export { formatActionTable };
