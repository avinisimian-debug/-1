"use client";

import { ProcessingTheatre } from "@/features/staz-workspace";
import type { ProcessingStage } from "../types";

interface ProcessingStateProps {
  fileName: string;
  fileSize?: number;
  stage: ProcessingStage;
  stageIndex?: number;
  uploadProgress?: unknown;
}

export function ProcessingState({ fileName, stage, onCancel }: ProcessingStateProps & { onCancel?: () => void }) {
  return (
    <ProcessingTheatre
      fileName={fileName}
      stage={stage}
      onCancel={onCancel}
      className="-mx-2 sm:-mx-4"
    />
  );
}
