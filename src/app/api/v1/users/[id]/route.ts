import { NextRequest } from "next/server";
import { userService } from "@/services/user.service";
import { successResponse, handleError, errorResponse } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { z } from "zod";

const updateRoleSchema = z.object({
  role: z.enum(["CUSTOMER", "ADMIN"]),
});

// GET /api/v1/users/:id - Admin only
export const GET = withAdmin(async (_request, context) => {
  try {
    const { id } = await context.params;
    const user = await userService.getById(id);
    return successResponse(user);
  } catch (error) {
    return handleError(error);
  }
});

// PATCH /api/v1/users/:id - Admin only (role change)
export const PATCH = withAdmin(async (request, context) => {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateRoleSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Invalid role", 400, "VALIDATION_ERROR");
    }

    const user = await userService.updateRole(id, parsed.data.role);
    return successResponse(user);
  } catch (error) {
    return handleError(error);
  }
});

// DELETE /api/v1/users/:id - Admin only
export const DELETE = withAdmin(async (_request, context) => {
  try {
    const { id } = await context.params;
    await userService.deleteUser(id);
    return successResponse({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
});
