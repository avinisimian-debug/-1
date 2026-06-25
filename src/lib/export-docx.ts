import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import type { ActionItem, TranscriptionResult } from "@/features/transcription/types";
import { applySpeakerLabelOverrides } from "@/features/transcription/lib/speaker-labels";
import type { PdfReportLabels } from "@/features/transcription/components/PdfReportTemplate";

function sanitizeFileName(name: string): string {
  return name.replace(/\.[^/.]+$/, "").replace(/[^\w\s-]/g, "").trim() || "report";
}

function sectionHeading(text: string, rtl: boolean): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    bidirectional: rtl,
    spacing: { before: 320, after: 160 },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 22,
        color: "52525b",
      }),
    ],
  });
}

function bodyParagraph(text: string, rtl: boolean): Paragraph {
  return new Paragraph({
    bidirectional: rtl,
    spacing: { after: 120 },
    children: [new TextRun({ text, size: 22 })],
  });
}

function bulletParagraph(text: string, rtl: boolean): Paragraph {
  return new Paragraph({
    bidirectional: rtl,
    spacing: { after: 80 },
    children: [new TextRun({ text: `• ${text}`, size: 22 })],
  });
}

function buildActionItemsTable(
  actionItems: ActionItem[],
  labels: PdfReportLabels,
  rtl: boolean,
): Table {
  const header = new TableRow({
    children: [
      cell("#", true, rtl, AlignmentType.CENTER),
      cell(labels.actions, true, rtl),
      cell(labels.owner, true, rtl),
      cell(labels.deadline, true, rtl),
      cell("Status", true, rtl),
    ],
  });

  const rows = actionItems.map((item, index) =>
    new TableRow({
      children: [
        cell(String(index + 1), false, rtl, AlignmentType.CENTER),
        cell(item.task, false, rtl),
        cell(item.owner, false, rtl),
        cell(item.deadline, false, rtl),
        cell(item.completed ? labels.completed : labels.pending, false, rtl),
      ],
    }),
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [header, ...rows],
  });
}

function cell(
  text: string,
  header: boolean,
  rtl: boolean,
  alignment: (typeof AlignmentType)[keyof typeof AlignmentType] = rtl
    ? AlignmentType.RIGHT
    : AlignmentType.LEFT,
): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        bidirectional: rtl,
        alignment,
        children: [
          new TextRun({
            text,
            bold: header,
            size: header ? 18 : 20,
          }),
        ],
      }),
    ],
  });
}

export function buildDocxDocument(
  result: TranscriptionResult,
  actionItems: ActionItem[],
  labels: PdfReportLabels,
  rtl = false,
): Document {
  const children: (Paragraph | Table)[] = [];

  children.push(
    new Paragraph({
      heading: HeadingLevel.TITLE,
      bidirectional: rtl,
      spacing: { after: 120 },
      children: [new TextRun({ text: result.fileName, bold: true, size: 36 })],
    }),
    new Paragraph({
      bidirectional: rtl,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `${labels.duration}: ${result.duration}  |  ${labels.processed}: ${result.processedAt}`,
          size: 20,
          color: "71717a",
        }),
      ],
    }),
    new Paragraph({
      bidirectional: rtl,
      spacing: { after: 240 },
      children: [
        new TextRun({ text: labels.tagline, italics: true, size: 20, color: "a1a1aa" }),
      ],
    }),
  );

  if (result.headline) {
    children.push(sectionHeading("Headline", rtl), bodyParagraph(result.headline, rtl));
  }

  if (result.summary.overview) {
    children.push(
      sectionHeading(labels.overview, rtl),
      ...result.summary.overview
        .split("\n")
        .filter(Boolean)
        .map((para) => bodyParagraph(para, rtl)),
    );
  }

  if (result.summary.executive.length > 0) {
    children.push(
      sectionHeading(labels.executive, rtl),
      ...result.summary.executive.map((point) => bulletParagraph(point, rtl)),
    );
  }

  if (result.summary.keyTakeaways.length > 0) {
    children.push(
      sectionHeading(labels.takeaways, rtl),
      ...result.summary.keyTakeaways.map((point) => bulletParagraph(point, rtl)),
    );
  }

  if (actionItems.length > 0) {
    const completedCount = actionItems.filter((i) => i.completed).length;
    children.push(
      sectionHeading(labels.actions, rtl),
      bodyParagraph(`${completedCount} / ${actionItems.length} ${labels.completed}`, rtl),
      buildActionItemsTable(actionItems, labels, rtl),
    );
  }

  const transcript = applySpeakerLabelOverrides(
    result.transcript,
    result.speakerLabels,
  );

  if (transcript.length > 0) {
    children.push(sectionHeading(labels.transcript, rtl));
    for (const entry of transcript) {
      children.push(
        new Paragraph({
          bidirectional: rtl,
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: `[${entry.timestamp}] ${entry.speaker}`,
              bold: true,
              size: 20,
              color: "7c3aed",
            }),
          ],
        }),
        bodyParagraph(entry.text, rtl),
      );
    }
  }

  children.push(
    new Paragraph({
      bidirectional: rtl,
      spacing: { before: 400 },
      children: [
        new TextRun({
          text: `${labels.generatedBy} — Staz AI`,
          size: 18,
          color: "a1a1aa",
        }),
      ],
    }),
  );

  return new Document({
    sections: [{ children }],
  });
}

export async function downloadDocxReport(
  result: TranscriptionResult,
  actionItems: ActionItem[],
  labels: PdfReportLabels,
  rtl = false,
): Promise<void> {
  const doc = buildDocxDocument(result, actionItems, labels, rtl);
  const blob = await Packer.toBlob(doc);
  const base = sanitizeFileName(result.fileName);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${base}-report.docx`;
  anchor.click();
  URL.revokeObjectURL(url);
}
