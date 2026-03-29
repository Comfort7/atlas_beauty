import { NextRequest } from "next/server";
import { reviewService } from "@/services/review.service";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { z } from "zod";

const moderateReviewSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

// PATCH /api/v1/admin/reviews/:id - Approve/reject
export const PATCH = withAdmin(async (request, context) => {
  try {
    const { id } = await context.params;
    const result = await validateBody(request, moderateReviewSchema);
    if ("error" in result) return result.error;

    const review = await reviewService.moderate(id, result.data.status);
    return successResponse(review);
  } catch (error) {
    return handleError(error);
  }
});
