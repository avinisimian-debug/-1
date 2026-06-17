import type { CSSProperties, ReactNode } from "react";
import type { ActionItem, TranscriptionResult } from "../types";

export interface PdfReportLabels {
  brand: string;
  tagline: string;
  duration: string;
  processed: string;
  overview: string;
  executive: string;
  takeaways: string;
  actions: string;
  transcript: string;
  owner: string;
  deadline: string;
  completed: string;
  pending: string;
  generatedBy: string;
}

interface PdfReportTemplateProps {
  result: TranscriptionResult;
  actionItems: ActionItem[];
  labels: PdfReportLabels;
  rtl?: boolean;
}

export function PdfReportTemplate({
  result,
  actionItems,
  labels,
  rtl = false,
}: PdfReportTemplateProps) {
  const completedCount = actionItems.filter((i) => i.completed).length;

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      style={{
        width: "794px",
        backgroundColor: "#ffffff",
        color: "#18181b",
        fontFamily: "Segoe UI, Tahoma, Arial, sans-serif",
        lineHeight: 1.6,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 45%, #b45309 100%)",
          padding: "40px 48px 36px",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(251, 191, 36, 0.9)",
              }}
            >
              {labels.brand}
            </p>
            <h1
              style={{
                margin: "8px 0 0",
                fontSize: "28px",
                fontWeight: 800,
                lineHeight: 1.25,
                maxWidth: "520px",
              }}
            >
              {result.fileName}
            </h1>
            <p style={{ margin: "10px 0 0", fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>
              {labels.tagline}
            </p>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "12px",
              padding: "14px 18px",
              minWidth: "160px",
            }}
          >
            <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
              {labels.duration}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: "18px", fontWeight: 700 }}>
              {result.duration}
            </p>
            <p style={{ margin: "12px 0 0", fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
              {labels.processed}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: "12px", fontWeight: 600 }}>
              {result.processedAt}
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: "40px 48px 48px" }}>
        {/* Executive Overview */}
        {result.summary.overview && (
          <section style={{ marginBottom: "36px" }}>
            <SectionTitle accent="#d97706">{labels.overview}</SectionTitle>
            <div
              style={{
                background: "linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)",
                border: "1px solid #fde68a",
                borderRadius: "16px",
                padding: "24px 28px",
                borderLeft: rtl ? undefined : "4px solid #f59e0b",
                borderRight: rtl ? "4px solid #f59e0b" : undefined,
              }}
            >
              {result.summary.overview.split("\n").filter(Boolean).map((para, i) => (
                <p
                  key={i}
                  style={{
                    margin: i === 0 ? 0 : "16px 0 0",
                    fontSize: "15px",
                    lineHeight: 1.75,
                    color: "#3f3f46",
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Executive Summary */}
        <section style={{ marginBottom: "36px" }}>
          <SectionTitle accent="#7c3aed">{labels.executive}</SectionTitle>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {result.summary.executive.map((point, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: "14px",
                  marginBottom: "12px",
                  padding: "14px 16px",
                  background: "#fafafa",
                  border: "1px solid #f4f4f5",
                  borderRadius: "12px",
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: "8px",
                    height: "8px",
                    marginTop: "8px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #7c3aed, #f59e0b)",
                  }}
                />
                <span style={{ fontSize: "14px", color: "#27272a" }}>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Key Takeaways */}
        <section style={{ marginBottom: "36px" }}>
          <SectionTitle accent="#0891b2">{labels.takeaways}</SectionTitle>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            {result.summary.keyTakeaways.map((point, i) => (
              <div
                key={i}
                style={{
                  padding: "16px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#d97706",
                    marginBottom: "8px",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p style={{ margin: 0, fontSize: "13px", color: "#334155", lineHeight: 1.6 }}>
                  {point}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Action Items */}
        <section style={{ marginBottom: "36px", pageBreakInside: "avoid" }}>
          <SectionTitle accent="#059669">{labels.actions}</SectionTitle>
          <div
            style={{
              marginBottom: "14px",
              fontSize: "12px",
              color: "#71717a",
            }}
          >
            {completedCount} / {actionItems.length} {labels.completed}
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr style={{ background: "#18181b", color: "#ffffff" }}>
                <th style={thStyle}>#</th>
                <th style={{ ...thStyle, textAlign: rtl ? "right" : "left" }}>{labels.actions}</th>
                <th style={thStyle}>{labels.owner}</th>
                <th style={thStyle}>{labels.deadline}</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {actionItems.map((item, i) => (
                <tr
                  key={item.id}
                  style={{
                    background: i % 2 === 0 ? "#ffffff" : "#fafafa",
                    borderBottom: "1px solid #f4f4f5",
                  }}
                >
                  <td style={tdStyle}>{i + 1}</td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: rtl ? "right" : "left",
                      textDecoration: item.completed ? "line-through" : "none",
                      color: item.completed ? "#a1a1aa" : "#27272a",
                    }}
                  >
                    {item.task}
                  </td>
                  <td style={tdStyle}>{item.owner}</td>
                  <td style={tdStyle}>{item.deadline}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: "999px",
                        fontSize: "11px",
                        fontWeight: 600,
                        background: item.completed ? "#d1fae5" : "#fef3c7",
                        color: item.completed ? "#047857" : "#b45309",
                      }}
                    >
                      {item.completed ? labels.completed : labels.pending}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Transcript */}
        <section>
          <SectionTitle accent="#6366f1">{labels.transcript}</SectionTitle>
          <div
            style={{
              border: "1px solid #e4e4e7",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {result.transcript.map((entry, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "16px",
                  padding: "14px 18px",
                  background: i % 2 === 0 ? "#ffffff" : "#fafafa",
                  borderBottom: i < result.transcript.length - 1 ? "1px solid #f4f4f5" : "none",
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: "52px",
                    fontFamily: "monospace",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#d97706",
                  }}
                >
                  {entry.timestamp}
                </span>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#7c3aed",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {entry.speaker}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#3f3f46", lineHeight: 1.65 }}>
                    {entry.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div
          style={{
            marginTop: "40px",
            paddingTop: "20px",
            borderTop: "1px solid #e4e4e7",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "11px",
            color: "#a1a1aa",
          }}
        >
          <span>{labels.generatedBy}</span>
          <span>Staz AI</span>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  children,
  accent,
}: {
  children: ReactNode;
  accent: string;
}) {
  return (
    <h2
      style={{
        margin: "0 0 16px",
        fontSize: "12px",
        fontWeight: 800,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "#71717a",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: "4px",
          height: "18px",
          borderRadius: "2px",
          background: accent,
        }}
      />
      {children}
    </h2>
  );
}

const thStyle: CSSProperties = {
  padding: "10px 12px",
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tdStyle: CSSProperties = {
  padding: "12px",
  verticalAlign: "top",
};
