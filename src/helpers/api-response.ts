import { NextResponse } from "next/server";
import { AppError } from "@/lib/errors";

interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function successResponse<T>(
  data: T,
  status: number = 200,
  meta?: SuccessResponse<T>["meta"]
): NextResponse<SuccessResponse<T>> {
  const body: SuccessResponse<T> = { success: true, data };
  if (meta) body.meta = meta;
  return NextResponse.json(body, { status });
}

export function errorResponse(
  message: string,
  status: number = 500,
  code: string = "INTERNAL_ERROR",
  details?: unknown
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, details },
    },
    { status }
  );
}

export function handleError(error: unknown): NextResponse<ErrorResponse> {
  if (error instanceof AppError) {
    return errorResponse(
      error.message,
      error.statusCode,
      error.code || "APP_ERROR",
      error instanceof AppError && "details" in error
        ? (error as { details?: unknown }).details
        : undefined
    );
  }

  console.error("Unhandled error:", error);
  return errorResponse("Internal server error", 500);
}
