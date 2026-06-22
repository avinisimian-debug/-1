import { getSummaryTemplate, SUMMARY_TEMPLATE_LIST } from "../templates/registry";
import type {
  IngestedTranscript,
  OutputFormat,
  SummarizationInput,
  SummarizationOutput,
  SummaryFormatter,
  SummaryProcessor,
  SummaryTemplateId,
} from "../types";
import { SummarizationCache } from "./cache";
import { htmlFormatter } from "./formatters/html.formatter";
import { jsonFormatter } from "./formatters/json.formatter";
import { markdownFormatter } from "./formatters/markdown.formatter";
import { ingestTranscript } from "./ingestion";
import { mockSummaryProcessor } from "./processor.mock";

export interface SummarizationEngineOptions {
  processor?: SummaryProcessor;
  cache?: SummarizationCache;
}

export class SummarizationEngine {
  private processor: SummaryProcessor;
  private cache: SummarizationCache;
  private formatters: Record<OutputFormat, SummaryFormatter>;

  constructor(options: SummarizationEngineOptions = {}) {
    this.processor = options.processor ?? mockSummaryProcessor;
    this.cache = options.cache ?? new SummarizationCache();
    this.formatters = {
      markdown: markdownFormatter,
      json: jsonFormatter,
      html: htmlFormatter,
    };
  }

  /**
   * Process a transcript with the selected template.
   * Returns cached output instantly when available.
   */
  async process(input: SummarizationInput): Promise<SummarizationOutput> {
    const started = performance.now();
    const format = input.format ?? "markdown";
    const template = getSummaryTemplate(input.templateId);

    const cached = this.cache.get(input.cacheKey, input.templateId, format);
    if (cached) {
      return {
        ...cached,
        fromCache: true,
        latencyMs: Math.round(performance.now() - started),
      };
    }

    const ingested = ingestTranscript({
      cacheKey: input.cacheKey,
      result: input.result,
      transcript: input.transcript,
    });

    const document = await this.processor.process(ingested, template);
    const content = this.formatters[format].format(document);

    const output: SummarizationOutput = {
      templateId: input.templateId,
      format,
      document,
      content,
      fromCache: false,
      latencyMs: Math.round(performance.now() - started),
    };

    this.cache.set(output, input.cacheKey);
    return output;
  }

  /** Pre-generate every template for zero-latency mode switching in the UI. */
  async warmAll(
    input: Omit<SummarizationInput, "templateId">,
    templateIds: SummaryTemplateId[] = SUMMARY_TEMPLATE_LIST.map((t) => t.id),
  ): Promise<SummarizationOutput[]> {
    const outputs = await Promise.all(
      templateIds.map((templateId) =>
        this.process({ ...input, templateId }),
      ),
    );
    return outputs;
  }

  getCached(
    cacheKey: string,
    templateId: SummaryTemplateId,
    format: OutputFormat = "markdown",
  ): SummarizationOutput | undefined {
    return this.cache.get(cacheKey, templateId, format);
  }

  clearCache(cacheKey?: string): void {
    this.cache.clear(cacheKey);
  }
}

/** Singleton for client-side preview (mock, in-memory cache). */
export const summarizationEngine = new SummarizationEngine();
