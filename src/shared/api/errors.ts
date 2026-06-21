export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "INTERNAL_ERROR";

export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly details?: unknown;

  constructor(
    message: string,
    status = 500,
    code: ApiErrorCode = "INTERNAL_ERROR",
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad request.", details?: unknown) {
    super(message, 400, "BAD_REQUEST", details);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized.", details?: unknown) {
    super(message, 401, "UNAUTHORIZED", details);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Forbidden.", details?: unknown) {
    super(message, 403, "FORBIDDEN", details);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Not found.", details?: unknown) {
    super(message, 404, "NOT_FOUND", details);
    this.name = "NotFoundError";
  }
}

export class InternalServerError extends ApiError {
  constructor(message = "Internal server error.", details?: unknown) {
    super(message, 500, "INTERNAL_ERROR", details);
    this.name = "InternalServerError";
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof Error) {
    const message = error.message;

    if (message.includes("ENOENT") && message.includes("ffmpeg")) {
      return new InternalServerError(
        "Audio processing is temporarily unavailable. Try MP3/WAV or try again later.",
      );
    }

    if (
      message.includes("Invalid file format") ||
      message.includes("corrupted") ||
      message.includes("could not be decoded")
    ) {
      return new BadRequestError(
        "Could not read this recording. Try exporting as MP3 or WAV.",
      );
    }

    if (message.includes("rate limit") || message.includes("429")) {
      return new InternalServerError(
        "High demand right now. Please wait a moment and try again.",
      );
    }

    return new InternalServerError(message);
  }

  return new InternalServerError("An unexpected error occurred.");
}
