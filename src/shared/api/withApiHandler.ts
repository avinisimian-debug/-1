import { NextRequest, NextResponse } from "next/server";
import { ApiError, normalizeApiError } from "./errors";

export interface ApiErrorPayload {
  code: string;
  message: string;
}

export interface ApiSuccessResponse<T> {
  data: T;
  error: null;
}

export interface ApiFailureResponse {
  data: null;
  error: ApiErrorPayload;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiFailureResponse;

type Handler<T> = (request: NextRequest) => Promise<T>;

export function withApiHandler<T>(handler: Handler<T>) {
  return async (request: NextRequest): Promise<NextResponse<ApiResponse<T>>> => {
    try {
      const data = await handler(request);
      return NextResponse.json({ data, error: null }, { status: 200 });
    } catch (error) {
      const normalized = normalizeApiError(error);
      logApiError(normalized, request, error);

      return NextResponse.json(
        {
          data: null,
          error: {
            code: normalized.code,
            message: normalized.message,
          },
        },
        { status: normalized.status },
      );
    }
  };
}

function logApiError(error: ApiError, request: NextRequest, raw: unknown) {
  const details = {
    path: request.nextUrl.pathname,
    method: request.method,
    status: error.status,
    code: error.code,
    details: error.details,
  };

  console.error("[api:error]", error.message, details, raw);
}
