import { NextRequest } from "next/server";
import { userService } from "@/services/user.service";
import { validateQuery } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { getPaginationMeta } from "@/helpers/pagination";
import { z } from "zod";

const userQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

// GET /api/v1/admin/users
export const GET = withAdmin(async (request) => {
  try {
    const result = validateQuery(request, userQuerySchema);
    if ("error" in result) return result.error;

    const { page, limit, search } = result.data;
    const { users, total } = await userService.listUsers(page, limit, search);

    return successResponse(users, 200, getPaginationMeta(total, page, limit));
  } catch (error) {
    return handleError(error);
  }
});
