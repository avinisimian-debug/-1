import { AssemblyAI } from "assemblyai";
import { failure, isFailure, success, type Result } from "@/shared/lib/result";
import type { DiarizationUtterance } from "./align-speakers";
import { mapAssemblyAIWordsToTimedWords } from "./build-word-timestamps";

export function isDiarizationConfigured(): boolean {
  return Boolean(process.env.ASSEMBLYAI_API_KEY?.trim());
}

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

/**
 * Transcribe audio with AssemblyAI speaker diarization (Node.js API).
 * Returns utterances with stable Speaker 1 / Speaker 2 labels.
 */
export async function transcribeWithDiarization(
  audioFile: File,
  language?: string | null,
): Promise<Result<DiarizationTranscriptResult, Error>> {
  try {
    const client = getAssemblyAIClient();
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const uploadUrl = await client.files.upload(buffer);

    const languageCode =
      language && language !== "auto" ? language : undefined;

    const transcript = await client.transcripts.transcribe({
      audio: uploadUrl,
      speaker_labels: true,
      ...(languageCode ? { language_code: languageCode } : {}),
    });

    if (transcript.status === "error") {
      return failure(
        new Error(transcript.error ?? "AssemblyAI diarization failed."),
      );
    }

    const indexByRaw = new Map<string, number>();
    const speakerLabelByRaw = new Map<
      string,
      { speakerId: string; speakerLabel: string }
    >();
    const utterances: DiarizationUtterance[] = (transcript.utterances ?? []).map(
      (utterance) => {
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
      transcript.text?.trim() ??
      utterances
        .map((u) => u.text)
        .join(" ")
        .trim();

    const durationSeconds =
      utterances.length > 0
        ? utterances[utterances.length - 1].endMs / 1000
        : (transcript.audio_duration ?? 0);

    if (!transcriptText) {
      return failure(new Error("Diarization returned an empty transcript."));
    }

    const timedWords =
      transcript.words && transcript.words.length > 0
        ? mapAssemblyAIWordsToTimedWords(
            transcript.words.map((w) => ({
              text: w.text,
              start: w.start,
              end: w.end,
              speaker: w.speaker,
            })),
            speakerLabelByRaw,
          )
        : undefined;

    return success({
      utterances,
      transcriptText,
      durationSeconds,
      ...(timedWords?.length ? { timedWords } : {}),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Diarization request failed.";
    return failure(new Error(message));
  }
}

/** Diarization-only pass — labels utterance timestamps without replacing Whisper text. */
export async function diarizeAudioUtterances(
  audioFile: File,
  language?: string | null,
): Promise<Result<DiarizationUtterance[], Error>> {
  const result = await transcribeWithDiarization(audioFile, language);
  if (isFailure(result)) {
    return failure(result.error);
  }
  return success(result.data.utterances);
}
