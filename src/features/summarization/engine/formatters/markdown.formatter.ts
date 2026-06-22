import type { SummaryDocument, SummaryFormatter } from "../../types";

export const markdownFormatter: SummaryFormatter = {
  format(document) {
    const lines: string[] = [`# ${document.title}`, ""];

    for (const sec of document.sections) {
      lines.push(`## ${sec.heading}`);
      if (sec.body) {
        lines.push("", sec.body, "");
      }
      if (sec.bullets?.length) {
        for (const bullet of sec.bullets) {
          lines.push(`- ${bullet}`);
        }
        lines.push("");
      }
    }

    lines.push(
      `---`,
      `_Generated with Staz AI · ${document.templateId} template · ${new Date(document.generatedAt).toLocaleString()}_`,
    );

    return lines.join("\n").trim();
  },
};
