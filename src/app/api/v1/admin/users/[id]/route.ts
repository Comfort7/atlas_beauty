import { NextRequest } from "next/server";
import { userService } from "@/services/user.service";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { z } from "zod";

const updateUserSchema = z.object({
  role: z.enum(["CUSTOMER", "ADMIN"]).optional(),
  name: z.string().min(2).max(100).optional(),
});

// GET /api/v1/admin/users/:id
export const GET = withAdmin(async (_request, context) => {
  try {
    const { id } = await context.params;
    const user = await userService.getById(id);
    return successResponse(user);
  } catch (error) {
    return handleError(error);
  }
});

// PATCH /api/v1/admin/users/:id
export const PATCH = withAdmin(async (request, context) => {
  try {
    const { id } = await context.params;
    const result = await validateBody(request, updateUserSchema);
    if ("error" in result) return result.error;

    if (result.data.role) {
      const user = await userService.updateRole(id, result.data.role);
      return successResponse(user);
    }

    const user = await userService.updateProfile(id, result.data);
    return successResponse(user);
  } catch (error) {
    return handleError(error);
  }
});

// DELETE /api/v1/admin/users/:id
export const DELETE = withAdmin(async (_request, context) => {
  try {
    const { id } = await context.params;
    await userService.deleteUser(id);
    return successResponse({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
});
