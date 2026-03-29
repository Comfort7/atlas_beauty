import { NextRequest } from "next/server";
import { userService } from "@/services/user.service";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { z } from "zod";

const confirmResetSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/),
});

// POST /api/v1/users/password-reset/confirm
export async function POST(request: NextRequest) {
  try {
    const result = await validateBody(request, confirmResetSchema);
    if ("error" in result) return result.error;

    await userService.confirmPasswordReset(result.data.token, result.data.password);

    return successResponse({ message: "Password has been reset successfully." });
  } catch (error) {
    return handleError(error);
  }
}
