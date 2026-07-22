import type { SummaryFormatter } from "../../types";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const htmlFormatter: SummaryFormatter = {
  format(document) {
    const sections = document.sections
      .map((sec) => {
        const body = sec.body
          ? `<p>${escapeHtml(sec.body).replace(/\n/g, "<br/>")}</p>`
          : "";
        const bullets = sec.bullets?.length
          ? `<ul>${sec.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
          : "";
        return `<section><h2>${escapeHtml(sec.heading)}</h2>${body}${bullets}</section>`;
      })
      .join("\n");

    return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><title>${escapeHtml(document.title)}</title></head>
<body>
  <article>
    <h1>${escapeHtml(document.title)}</h1>
    ${sections}
    <footer><small>Staz AI · ${escapeHtml(document.templateId)} template</small></footer>
  </article>
</body>
</html>`;
  },
};
