import { NextRequest } from "next/server";
import { userService } from "@/services/user.service";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { z } from "zod";

const requestResetSchema = z.object({
  email: z.string().email(),
});

// POST /api/v1/users/password-reset - Request reset
export async function POST(request: NextRequest) {
  try {
    const result = await validateBody(request, requestResetSchema);
    if ("error" in result) return result.error;

    await userService.requestPasswordReset(result.data.email);

    // Always return success to prevent email enumeration
    return successResponse({
      message: "If an account exists with that email, a reset link has been sent.",
    });
  } catch (error) {
    return handleError(error);
  }
}
