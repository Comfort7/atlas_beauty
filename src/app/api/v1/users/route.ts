import { NextRequest } from "next/server";
import { userService } from "@/services/user.service";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { registerSchema } from "./schema";
import { paginationSchema } from "@/helpers/pagination";
import { getPaginationMeta } from "@/helpers/pagination";
import { validateQuery } from "@/helpers/validate-request";
import { z } from "zod";

// POST /api/v1/users - Register
export async function POST(request: NextRequest) {
  try {
    const result = await validateBody(request, registerSchema);
    if ("error" in result) return result.error;

    const user = await userService.register(result.data);
    return successResponse(user, 201);
  } catch (error) {
    return handleError(error);
  }
}

// GET /api/v1/users - Admin: list users
const listQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
});

export const GET = withAdmin(async (request) => {
  try {
    const result = validateQuery(request, listQuerySchema);
    if ("error" in result) return result.error;

    const { page, limit, search } = result.data;
    const { users, total } = await userService.listUsers(page, limit, search);

    return successResponse(users, 200, getPaginationMeta(total, page, limit));
  } catch (error) {
    return handleError(error);
  }
});
