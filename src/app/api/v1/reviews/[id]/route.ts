import { NextRequest } from "next/server";
import { reviewService } from "@/services/review.service";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAuth } from "@/helpers/auth-guard";
import { z } from "zod";

const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().max(200).optional(),
  body: z.string().min(10).max(2000).optional(),
});

// PATCH /api/v1/reviews/:id
export const PATCH = withAuth(async (request, context, session) => {
  try {
    const { id } = await context.params;
    const result = await validateBody(request, updateReviewSchema);
    if ("error" in result) return result.error;

    const review = await reviewService.update(id, session.user.id, result.data);
    return successResponse(review);
  } catch (error) {
    return handleError(error);
  }
});

// DELETE /api/v1/reviews/:id
export const DELETE = withAuth(async (_request, context, session) => {
  try {
    const { id } = await context.params;
    const isAdmin = session.user.role === "ADMIN";
    await reviewService.delete(id, session.user.id, isAdmin);
    return successResponse({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
});
