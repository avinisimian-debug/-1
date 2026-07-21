import type { LiveSessionInput, LiveSessionPublic } from "../types";

async function parseJson<T>(res: Response): Promise<T> {
  const body = (await res.json()) as {
    data?: T;
    error?: { message?: string } | null;
  };
  if (!res.ok || body.data === undefined || body.data === null) {
    throw new Error(
      (typeof body.error === "object" && body.error?.message) ||
        `Request failed (${res.status})`,
    );
  }
  return body.data;
}

export async function fetchLiveMeetings(): Promise<LiveSessionPublic[]> {
  const res = await fetch("/api/live/meetings", {
    credentials: "include",
    cache: "no-store",
  });
  return parseJson(res);
}

export async function createLiveMeeting(
  input: LiveSessionInput,
): Promise<LiveSessionPublic> {
  const res = await fetch("/api/live/meetings", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseJson(res);
}

export async function fetchLiveMeeting(id: string): Promise<LiveSessionPublic> {
  const res = await fetch(`/api/live/meetings/${id}`, {
    credentials: "include",
    cache: "no-store",
  });
  return parseJson(res);
}

export async function deleteLiveMeeting(id: string): Promise<void> {
  const res = await fetch(`/api/live/meetings/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  await parseJson(res);
}

export async function postLiveMeetingQa(
  id: string,
  text: string,
  author?: string,
): Promise<LiveSessionPublic> {
  const res = await fetch(`/api/live/meetings/${id}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, author }),
  });
  return parseJson(res);
}

export async function attachMeetingRecording(
  id: string,
  payload: {
    blobUrl: string;
    pathname: string;
    fileName: string;
    contentType: string;
    fileSize?: number;
  },
): Promise<LiveSessionPublic> {
  const res = await fetch(`/api/live/meetings/${id}/recording`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}
