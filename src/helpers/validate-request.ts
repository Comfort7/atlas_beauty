import { NextRequest } from "next/server";
import { z } from "zod";
import { errorResponse } from "./api-response";

export async function validateBody<T extends z.ZodSchema>(
  request: NextRequest,
  schema: T
): Promise<{ data: z.infer<T> } | { error: ReturnType<typeof errorResponse> }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return {
        error: errorResponse(
          "Validation failed",
          400,
          "VALIDATION_ERROR",
          result.error.flatten().fieldErrors
        ),
      };
    }

    return { data: result.data };
  } catch {
    return {
      error: errorResponse("Invalid JSON body", 400, "INVALID_JSON"),
    };
  }
}

export function validateQuery<T extends z.ZodSchema>(
  request: NextRequest,
  schema: T
): { data: z.infer<T> } | { error: ReturnType<typeof errorResponse> } {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const result = schema.safeParse(params);

  if (!result.success) {
    return {
      error: errorResponse(
        "Invalid query parameters",
        400,
        "VALIDATION_ERROR",
        result.error.flatten().fieldErrors
      ),
    };
  }

  return { data: result.data };
}
