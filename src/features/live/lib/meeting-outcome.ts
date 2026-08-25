import type { TranscriptionResult } from "@/features/transcription/types";

export type MeetingOutcomeKind = "strong" | "needs_followup" | "unclear";

export type MeetingOutcome = {
  kind: MeetingOutcomeKind;
  label: string;
  reason: string;
};

/**
 * Evidence-based closeout status — no fake AI scores.
 * Derived only from structured fields already extracted from the meeting.
 */
export function deriveMeetingOutcome(
  result: TranscriptionResult,
  hebrew = true,
): MeetingOutcome {
  const decisions = result.decisions?.length ?? 0;
  const actions = result.actionItems?.length ?? 0;
  const owned = result.actionItems.filter(
    (a) =>
      a.owner &&
      a.owner !== "Unassigned" &&
      a.owner !== "לא צוין" &&
      a.owner !== "אחראי לא צוין",
  ).length;
  const openQs = result.openQuestions?.length ?? 0;
  const followUps = result.followUps?.length ?? 0;
  const dated = result.actionItems.filter(
    (a) =>
      a.deadline &&
      a.deadline !== "TBD" &&
      a.deadline !== "לא צוין" &&
      a.deadline !== "מועד לא צוין",
  ).length;

  if (decisions >= 1 && actions >= 1 && owned >= 1 && openQs === 0) {
    return {
      kind: "strong",
      label: hebrew ? "סגירה חזקה" : "Strong closeout",
      reason: hebrew
        ? `יש ${decisions} החלטות סופיות, ${owned} משימות עם אחראי${dated ? `, ו־${dated} עם מועד` : ""}${followUps ? `, ו־${followUps} המשכים` : ""}.`
        : `${decisions} final decision(s), ${owned} owned action(s)${dated ? `, ${dated} dated` : ""}${followUps ? `, ${followUps} follow-up(s)` : ""}.`,
    };
  }

  if (decisions >= 1 || actions >= 1 || followUps >= 1) {
    const gaps: string[] = [];
    if (openQs > 0) {
      gaps.push(hebrew ? `${openQs} שאלות פתוחות` : `${openQs} open question(s)`);
    }
    if (actions > 0 && owned < actions) {
      gaps.push(
        hebrew
          ? `${actions - owned} משימות בלי אחראי`
          : `${actions - owned} unowned action(s)`,
      );
    }
    if (actions > 0 && dated < actions) {
      gaps.push(
        hebrew
          ? `${actions - dated} בלי מועד`
          : `${actions - dated} without deadline`,
      );
    }
    return {
      kind: "needs_followup",
      label: hebrew ? "דורש המשך" : "Needs follow-up",
      reason:
        gaps.length > 0
          ? hebrew
            ? `יש התקדמות, אבל: ${gaps.join(" · ")}.`
            : `Progress exists, but: ${gaps.join(" · ")}.`
          : hebrew
            ? "יש החלטות או משימות — כדאי לוודא המשכים."
            : "Decisions or actions exist — confirm follow-through.",
    };
  }

  return {
    kind: "unclear",
    label: hebrew ? "סגירה לא ברורה" : "Unclear closeout",
    reason: hebrew
      ? "לא זוהו החלטות סופיות או משימות מפורשות — בדקו את התמלול."
      : "No final decisions or explicit actions found — review the transcript.",
  };
}
