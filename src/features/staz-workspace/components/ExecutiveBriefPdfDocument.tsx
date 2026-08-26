"use client";

import type { CSSProperties } from "react";
import type { TranscriptionResult } from "@/features/transcription/types";
import { mapDecisionsToTimestamps } from "../lib/map-decision-timestamp";

/** Shared print styles — single declarations, no React.CSSProperties namespace. */
const sectionTitle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#1F6B5C",
  margin: "0 0 12px",
  letterSpacing: "0.02em",
};

const th: CSSProperties = {
  textAlign: "start",
  padding: "10px 12px",
  fontWeight: 600,
  color: "#141816",
};

const td: CSSProperties = {
  textAlign: "start",
  padding: "10px 12px",
  color: "#5C635C",
  verticalAlign: "top",
};

/**
 * Off-screen Latitude-styled executive brief for PDF (html2canvas + jsPDF).
 * Fixed light colors for print fidelity.
 */
export function ExecutiveBriefPdfDocument({
  result,
}: {
  result: TranscriptionResult;
}) {
  const decisions =
    result.decisions && result.decisions.length > 0
      ? result.decisions
      : result.summary.keyTakeaways;
  const moments = mapDecisionsToTimestamps(decisions, result.transcript);
  const dateLabel = new Date(
    result.processedAt || "1970-01-01T00:00:00.000Z",
  ).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const decisionRows =
    moments.length > 0
      ? moments
      : decisions.map((d) => ({
          decision: d,
          timestamp: "",
          quote: "",
          score: 0,
        }));

  return (
    <div
      dir="rtl"
      style={{
        width: 794,
        minHeight: 1123,
        padding: "48px 52px",
        boxSizing: "border-box",
        background: "#F6F5F2",
        color: "#141816",
        fontFamily: "Heebo, Manrope, Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottom: "2px solid #1F6B5C",
          paddingBottom: 20,
          marginBottom: 28,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/staz-mark.png"
              alt="STAZ"
              width={36}
              height={36}
              style={{ borderRadius: 8, display: "block" }}
            />
            <div
              style={{
                fontFamily: "Georgia, Times New Roman, serif",
                fontSize: 28,
                letterSpacing: "-0.02em",
                color: "#0E1210",
              }}
            >
              STAZ
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#1F6B5C",
              marginTop: 4,
              fontWeight: 600,
            }}
          >
            תמצית מנהלים · Executive Brief
          </div>
        </div>
        <div style={{ textAlign: "left", fontSize: 11, color: "#5C635C" }}>
          <div>{dateLabel}</div>
          <div style={{ marginTop: 2 }}>משך: {result.duration}</div>
        </div>
      </div>

      <h1
        style={{
          fontSize: 20,
          fontWeight: 700,
          margin: "0 0 8px",
          color: "#141816",
          lineHeight: 1.35,
        }}
      >
        {result.fileName}
      </h1>
      {result.headline ? (
        <p
          style={{
            fontSize: 14,
            color: "#5C635C",
            margin: "0 0 24px",
            lineHeight: 1.5,
          }}
        >
          {result.headline}
        </p>
      ) : (
        <div style={{ height: 12 }} />
      )}

      <section style={{ marginBottom: 28 }}>
        <h2 style={sectionTitle}>תמצית מנהלים</h2>
        <ul style={{ margin: 0, paddingInlineStart: 18 }}>
          {result.summary.executive.map((line) => (
            <li
              key={line}
              style={{
                fontSize: 13,
                lineHeight: 1.65,
                color: "#141816",
                marginBottom: 8,
              }}
            >
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={sectionTitle}>מה הוחלט</h2>
        {decisionRows.length === 0 ? (
          <p style={{ fontSize: 12, color: "#8B928A" }}>לא זוהו החלטות</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {decisionRows.map((m) => (
              <div
                key={m.decision}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(20,24,22,0.08)",
                  borderRadius: 12,
                  padding: "12px 14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  {m.timestamp ? (
                    <span
                      style={{
                        fontFamily: "ui-monospace, monospace",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#1F6B5C",
                        background: "rgba(31,107,92,0.1)",
                        padding: "2px 8px",
                        borderRadius: 6,
                      }}
                    >
                      {m.timestamp}
                    </span>
                  ) : null}
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: "#141816" }}
                  >
                    {m.decision}
                  </span>
                </div>
                {m.quote ? (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 11,
                      color: "#5C635C",
                      lineHeight: 1.5,
                      borderInlineStart: "2px solid #C4A35A",
                      paddingInlineStart: 10,
                    }}
                  >
                    &ldquo;{m.quote}&rdquo;
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={sectionTitle}>מי עושה מה</h2>
        {result.actionItems.length === 0 ? (
          <p style={{ fontSize: 12, color: "#8B928A" }}>אין משימות</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 12,
              background: "#FFFFFF",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ background: "rgba(31,107,92,0.08)" }}>
                <th style={th}>משימה</th>
                <th style={th}>אחראי</th>
                <th style={th}>דדליין</th>
              </tr>
            </thead>
            <tbody>
              {result.actionItems.map((a) => (
                <tr
                  key={a.id}
                  style={{ borderTop: "1px solid rgba(20,24,22,0.08)" }}
                >
                  <td style={td}>{a.task}</td>
                  <td style={td}>{a.owner || "—"}</td>
                  <td style={td}>{a.deadline || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <footer
        style={{
          marginTop: 40,
          paddingTop: 16,
          borderTop: "1px solid rgba(20,24,22,0.08)",
          fontSize: 10,
          color: "#8B928A",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Generated by Staz AI</span>
        <span style={{ color: "#1F6B5C", fontWeight: 600 }}>1stazai.com</span>
      </footer>
    </div>
  );
}
