import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarkdownViewProps {
  content: string;
  className?: string;
}

function inlineFormat(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function isTableRow(line: string): boolean {
  return line.trim().startsWith("|") && line.trim().endsWith("|");
}

function isTableSeparator(line: string): boolean {
  return /^\|[\s\-:|]+\|$/.test(line.trim());
}

export function MarkdownView({ content, className }: MarkdownViewProps) {
  const lines = content.split("\n");
  const nodes: ReactNode[] = [];
  let listItems: string[] = [];
  let tableRows: string[][] = [];
  let key = 0;

  const flushList = () => {
    if (!listItems.length) return;
    nodes.push(
      <ul key={key++} className="my-3 list-disc space-y-1.5 ps-5 text-sm leading-relaxed">
        {listItems.map((item, i) => (
          <li key={i}>{inlineFormat(item)}</li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  const flushTable = () => {
    if (tableRows.length < 2) {
      tableRows = [];
      return;
    }
    const [header, ...bodyRows] = tableRows.filter(
      (row) => !row.every((cell) => /^-+$/.test(cell.trim())),
    );
    if (!header?.length) {
      tableRows = [];
      return;
    }
    nodes.push(
      <div key={key++} className="my-4 overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[280px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              {header.map((cell, i) => (
                <th key={i} className="px-3 py-2 font-semibold text-foreground">
                  {cell.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, ri) => (
              <tr key={ri} className="border-b border-border/60 last:border-0">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-2 text-foreground/90">
                    {inlineFormat(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
    );
    tableRows = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      flushTable();
      continue;
    }

    if (isTableRow(trimmed)) {
      flushList();
      const cells = trimmed
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());
      if (!isTableSeparator(trimmed)) {
        tableRows.push(cells);
      }
      continue;
    }

    flushTable();

    if (trimmed.startsWith("# ")) {
      flushList();
      nodes.push(
        <h1 key={key++} className="mb-3 text-xl font-bold tracking-tight text-foreground">
          {trimmed.slice(2)}
        </h1>,
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      nodes.push(
        <h2 key={key++} className="mb-2 mt-6 text-base font-semibold text-foreground">
          {trimmed.slice(3)}
        </h2>,
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushList();
      nodes.push(
        <h3 key={key++} className="mb-2 mt-4 text-sm font-semibold text-foreground">
          {trimmed.slice(4)}
        </h3>,
      );
      continue;
    }

    if (trimmed.startsWith("> ")) {
      flushList();
      nodes.push(
        <blockquote
          key={key++}
          className="my-3 border-s-4 border-accent/40 bg-accent-muted/30 px-4 py-2 text-sm italic leading-relaxed text-foreground/90"
        >
          {inlineFormat(trimmed.slice(2))}
        </blockquote>,
      );
      continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      listItems.push(trimmed.slice(2));
      continue;
    }

    const orderedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (orderedMatch) {
      flushList();
      nodes.push(
        <p key={key++} className="my-1.5 text-sm leading-relaxed text-foreground/90">
          {inlineFormat(trimmed)}
        </p>,
      );
      continue;
    }

    if (trimmed === "---") {
      flushList();
      nodes.push(<hr key={key++} className="my-6 border-border" />);
      continue;
    }

    flushList();
    nodes.push(
      <p key={key++} className="my-2 text-sm leading-relaxed text-foreground/90">
        {inlineFormat(trimmed)}
      </p>,
    );
  }

  flushList();
  flushTable();

  return (
    <article className={cn("markdown-view space-y-1", className)} dir="auto">
      {nodes}
    </article>
  );
}
