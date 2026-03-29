import { NextRequest } from "next/server";
import { reviewService } from "@/services/review.service";
import { validateQuery } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { paginationSchema, getPaginationMeta } from "@/helpers/pagination";

// GET /api/v1/admin/reviews - List pending reviews
export const GET = withAdmin(async (request) => {
  try {
    const result = validateQuery(request, paginationSchema);
    if ("error" in result) return result.error;

    const { page, limit } = result.data;
    const { reviews, total } = await reviewService.listPending(page, limit);

    return successResponse(reviews, 200, getPaginationMeta(total, page, limit));
  } catch (error) {
    return handleError(error);
  }
});
