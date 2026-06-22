import type { OutputFormat, SummarizationOutput } from "../types";

function cacheKey(
  transcriptKey: string,
  templateId: string,
  format: OutputFormat,
): string {
  return `${transcriptKey}::${templateId}::${format}`;
}

export class SummarizationCache {
  private store = new Map<string, SummarizationOutput>();

  get(
    transcriptKey: string,
    templateId: string,
    format: OutputFormat,
  ): SummarizationOutput | undefined {
    return this.store.get(cacheKey(transcriptKey, templateId, format));
  }

  set(output: SummarizationOutput, transcriptKey: string): void {
    this.store.set(
      cacheKey(transcriptKey, output.templateId, output.format),
      { ...output, fromCache: false },
    );
  }

  /** Pre-warm all templates for instant tab switching */
  warm(outputs: SummarizationOutput[], transcriptKey: string): void {
    for (const output of outputs) {
      this.set(output, transcriptKey);
    }
  }

  clear(transcriptKey?: string): void {
    if (!transcriptKey) {
      this.store.clear();
      return;
    }
    for (const key of this.store.keys()) {
      if (key.startsWith(`${transcriptKey}::`)) {
        this.store.delete(key);
      }
    }
  }
}
