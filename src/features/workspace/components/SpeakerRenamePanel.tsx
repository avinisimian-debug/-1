"use client";

import { useCallback, useState } from "react";
import { Pencil, Users } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import {
  collectSpeakerIds,
  defaultLabelForSpeakerId,
} from "@/features/transcription/lib/speaker-labels";
import type { TranscriptEntry } from "@/features/transcription/types";
import { getSpeakerStyle } from "../lib/speaker-style";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

interface SpeakerRenamePanelProps {
  entries: TranscriptEntry[];
  speakerLabels: Record<string, string>;
  onSpeakerLabelsChange: (labels: Record<string, string>) => void;
  diarizationEnabled?: boolean;
  className?: string;
}

export function SpeakerRenamePanel({
  entries,
  speakerLabels,
  onSpeakerLabelsChange,
  diarizationEnabled,
  className,
}: SpeakerRenamePanelProps) {
  const { t } = useLocale();
  const speakerIds = collectSpeakerIds(entries);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const startEdit = useCallback(
    (speakerId: string) => {
      setEditingId(speakerId);
      setDraft(
        speakerLabels[speakerId] ??
          defaultLabelForSpeakerId(speakerId, entries),
      );
    },
    [entries, speakerLabels],
  );

  const commitEdit = useCallback(() => {
    if (!editingId) return;
    const trimmed = draft.trim();
    const next = { ...speakerLabels };
    const defaultName = defaultLabelForSpeakerId(editingId, entries);
    if (!trimmed || trimmed === defaultName) {
      delete next[editingId];
    } else {
      next[editingId] = trimmed;
    }
    onSpeakerLabelsChange(next);
    setEditingId(null);
    setDraft("");
  }, [draft, editingId, entries, onSpeakerLabelsChange, speakerLabels]);

  if (speakerIds.length === 0) return null;

  const showPanel = diarizationEnabled || speakerIds.length > 1;

  if (!showPanel) return null;

  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-muted/30 px-3 py-3 sm:px-4",
        className,
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <Users className="h-3.5 w-3.5 text-muted-foreground" />
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t.workspaceRenameSpeakers}
        </p>
        {diarizationEnabled && (
          <span className="rounded-md border border-accent/20 bg-accent-muted/40 px-1.5 py-0.5 text-[9px] font-semibold text-accent">
            {t.workspaceDiarizationBadge}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {speakerIds.map((speakerId) => {
          const defaultName = defaultLabelForSpeakerId(speakerId, entries);
          const displayName = speakerLabels[speakerId] ?? defaultName;
          const style = getSpeakerStyle(displayName);
          const isEditing = editingId === speakerId;

          return (
            <div
              key={speakerId}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-1",
                style.bubble,
              )}
            >
              {isEditing ? (
                <Input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitEdit();
                    if (e.key === "Escape") {
                      setEditingId(null);
                      setDraft("");
                    }
                  }}
                  placeholder={t.workspaceSpeakerRenamePlaceholder}
                  className="h-7 w-28 border-0 bg-transparent px-1 text-xs shadow-none focus-visible:ring-0"
                />
              ) : (
                <>
                  <span className="text-xs font-medium text-foreground/90">
                    {displayName}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => startEdit(speakerId)}
                    aria-label={t.workspaceRenameSpeakerAction.replace(
                      "{name}",
                      displayName,
                    )}
                  >
                    <Pencil className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
