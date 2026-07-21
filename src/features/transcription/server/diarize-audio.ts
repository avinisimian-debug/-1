import { AssemblyAI } from "assemblyai";
import { failure, isFailure, success, type Result } from "@/shared/lib/result";
import {
  isAssemblyAIConfigured,
  isDiarizationConfigured,
} from "@/lib/transcription-ready";
import type { DiarizationUtterance } from "./align-speakers";
import { mapAssemblyAIWordsToTimedWords } from "./build-word-timestamps";

export { isAssemblyAIConfigured, isDiarizationConfigured };

function getAssemblyAIClient(): AssemblyAI {
  const apiKey = process.env.ASSEMBLYAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("ASSEMBLYAI_API_KEY is not configured.");
  }
  return new AssemblyAI({ apiKey });
}

function mapSpeakerLabel(rawSpeaker: string, indexByRaw: Map<string, number>): {
  speakerId: string;
  speakerLabel: string;
} {
  if (!indexByRaw.has(rawSpeaker)) {
    indexByRaw.set(rawSpeaker, indexByRaw.size + 1);
  }
  const number = indexByRaw.get(rawSpeaker)!;
  return {
    speakerId: String(number),
    speakerLabel: `Speaker ${number}`,
  };
}

export interface DiarizationTranscriptResult {
  utterances: DiarizationUtterance[];
  transcriptText: string;
  durationSeconds: number;
  timedWords?: Array<{
    word: string;
    start_time: number;
    end_time: number;
    speaker?: string;
    speakerId?: string;
  }>;
}

export interface AssemblyAITranscribeOptions {
  language?: string | null;
  /** Speaker diarization (Pro). Default false. */
  speakerLabels?: boolean;
}

export function mapAssemblyAITranscript(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transcript: any,
): DiarizationTranscriptResult {
  const indexByRaw = new Map<string, number>();
  const speakerLabelByRaw = new Map<
    string,
    { speakerId: string; speakerLabel: string }
  >();

  const utterances: DiarizationUtterance[] = (transcript.utterances ?? []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (utterance: any) => {
      const rawSpeaker = utterance.speaker ?? "A";
      const { speakerId, speakerLabel } = mapSpeakerLabel(
        rawSpeaker,
        indexByRaw,
      );
      speakerLabelByRaw.set(rawSpeaker, { speakerId, speakerLabel });
      return {
        speakerId,
        speakerLabel,
        startMs: utterance.start,
        endMs: utterance.end,
        text: utterance.text,
      };
    },
  );

  const transcriptText =
    (transcript.text as string | undefined)?.trim() ||
    utterances
      .map((u) => u.text)
      .join(" ")
      .trim();

  const durationSeconds =
    utterances.length > 0
      ? utterances[utterances.length - 1].endMs / 1000
      : (transcript.audio_duration ?? 0);

  const timedWords =
    transcript.words && transcript.words.length > 0
      ? mapAssemblyAIWordsToTimedWords(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          transcript.words.map((w: any) => ({
            text: w.text,
            start: w.start,
            end: w.end,
            speaker: w.speaker,
          })),
          speakerLabelByRaw.size > 0
            ? speakerLabelByRaw
            : new Map([
                ["A", { speakerId: "1", speakerLabel: "Speaker 1" }],
              ]),
        )
      : undefined;

  return {
    utterances,
    transcriptText,
    durationSeconds,
    ...(timedWords?.length ? { timedWords } : {}),
  };
}

/**
 * Primary AssemblyAI STT for uploaded files (upload buffer → transcribe).
 */
export async function transcribeWithAssemblyAI(
  audioFile: File,
  options: AssemblyAITranscribeOptions = {},
): Promise<Result<DiarizationTranscriptResult, Error>> {
  try {
    if (!isAssemblyAIConfigured()) {
      return failure(new Error("ASSEMBLYAI_API_KEY is not configured."));
    }

    const client = getAssemblyAIClient();
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const uploadUrl = await client.files.upload(buffer);

    const languageCode =
      options.language && options.language !== "auto"
        ? options.language
        : undefined;

    const transcript = await client.transcripts.transcribe({
      audio: uploadUrl,
      speaker_labels: Boolean(options.speakerLabels),
      ...(languageCode ? { language_code: languageCode } : {}),
    });

    if (transcript.status === "error") {
      return failure(
        new Error(transcript.error ?? "AssemblyAI transcription failed."),
      );
    }

    const mapped = mapAssemblyAITranscript(transcript);
    if (!mapped.transcriptText) {
      return failure(new Error("AssemblyAI returned an empty transcript."));
    }

    return success(mapped);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "AssemblyAI request failed.";
    return failure(new Error(message));
  }
}

/**
 * Transcribe a public media / platform URL via AssemblyAI (no app-server download).
 */
export async function transcribeUrlWithAssemblyAI(
  audioUrl: string,
  options: AssemblyAITranscribeOptions = {},
): Promise<Result<DiarizationTranscriptResult, Error>> {
  try {
    if (!isAssemblyAIConfigured()) {
      return failure(new Error("ASSEMBLYAI_API_KEY is not configured."));
    }

    const client = getAssemblyAIClient();
    const languageCode =
      options.language && options.language !== "auto"
        ? options.language
        : undefined;

    const transcript = await client.transcripts.transcribe({
      audio_url: audioUrl,
      speaker_labels: Boolean(options.speakerLabels),
      ...(languageCode ? { language_code: languageCode } : {}),
    });

    if (transcript.status === "error") {
      return failure(
        new Error(transcript.error ?? "AssemblyAI URL transcription failed."),
      );
    }

    const mapped = mapAssemblyAITranscript(transcript);
    if (!mapped.transcriptText) {
      return failure(new Error("AssemblyAI returned an empty transcript."));
    }

    return success(mapped);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "AssemblyAI URL request failed.";
    return failure(new Error(message));
  }
}

/** @deprecated Prefer transcribeWithAssemblyAI({ speakerLabels: true }) */
export async function transcribeWithDiarization(
  audioFile: File,
  language?: string | null,
): Promise<Result<DiarizationTranscriptResult, Error>> {
  return transcribeWithAssemblyAI(audioFile, {
    language,
    speakerLabels: true,
  });
}

/** Diarization-only pass — labels utterance timestamps without replacing Whisper text. */
export async function diarizeAudioUtterances(
  audioFile: File,
  language?: string | null,
): Promise<Result<DiarizationUtterance[], Error>> {
  const result = await transcribeWithAssemblyAI(audioFile, {
    language,
    speakerLabels: true,
  });
  if (isFailure(result)) {
    return failure(result.error);
  }
  return success(result.data.utterances);
}
