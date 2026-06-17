import { ApiError, type ApiErrorCode } from "./errors";
import type { ApiResponse } from "./withApiHandler";

type RequestInitWithJson = RequestInit & {
  json?: unknown;
};

export async function apiFetch<T>(
  input: string,
  init: RequestInitWithJson = {},
): Promise<T> {
  const { json, headers, ...rest } = init;

  const response = await fetch(input, {
    ...rest,
    headers: {
      ...(json ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    ...(json !== undefined ? { body: JSON.stringify(json) } : {}),
  });

  let body: ApiResponse<T> | null = null;
  try {
    body = (await response.json()) as ApiResponse<T>;
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message = body?.error?.message ?? mapStatusToMessage(response.status);
    const code = (body?.error?.code as ApiErrorCode | undefined) ?? mapStatusToCode(response.status);
    throw new ApiError(message, response.status, code);
  }

  if (!body || body.error || body.data == null) {
    throw new ApiError("Malformed API response.", 500, "INTERNAL_ERROR");
  }

  return body.data;
}

function mapStatusToMessage(status: number): string {
  switch (status) {
    case 401:
      return "You must sign in to continue.";
    case 403:
      return "You do not have access to this resource.";
    case 404:
      return "The requested resource was not found.";
    case 500:
    default:
      return "Something went wrong. Please try again.";
  }
}

function mapStatusToCode(status: number): ApiErrorCode {
  switch (status) {
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 400:
      return "BAD_REQUEST";
    case 500:
    default:
      return "INTERNAL_ERROR";
  }
}
