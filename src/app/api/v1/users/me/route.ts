import { NextRequest } from "next/server";
import { userService } from "@/services/user.service";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAuth } from "@/helpers/auth-guard";
import { updateProfileSchema } from "../schema";

// GET /api/v1/users/me
export const GET = withAuth(async (_request, _context, session) => {
  try {
    const user = await userService.getById(session.user.id);
    return successResponse(user);
  } catch (error) {
    return handleError(error);
  }
});

// PATCH /api/v1/users/me
export const PATCH = withAuth(async (request, _context, session) => {
  try {
    const result = await validateBody(request, updateProfileSchema);
    if ("error" in result) return result.error;

    const user = await userService.updateProfile(session.user.id, result.data);
    return successResponse(user);
  } catch (error) {
    return handleError(error);
  }
});
