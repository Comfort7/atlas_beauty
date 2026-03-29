import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviewService } from "@/services/review.service";
import { validateBody, validateQuery } from "@/helpers/validate-request";
import { successResponse, handleError, errorResponse } from "@/helpers/api-response";
import { withAuth } from "@/helpers/auth-guard";
import { paginationSchema, getPaginationMeta } from "@/helpers/pagination";
import { z } from "zod";

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  body: z.string().min(10).max(2000),
});

// GET /api/v1/products/:idOrSlug/reviews
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await params;
    const product = await prisma.product.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      select: { id: true },
    });

    if (!product) return errorResponse("Product not found", 404, "NOT_FOUND");

    const result = validateQuery(request, paginationSchema);
    if ("error" in result) return result.error;

    const { page, limit } = result.data;
    const { reviews, total } = await reviewService.listByProduct(product.id, page, limit);
    return successResponse(reviews, 200, getPaginationMeta(total, page, limit));
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/v1/products/:idOrSlug/reviews
export const POST = withAuth(async (request, context, session) => {
  try {
    const { idOrSlug } = await context.params;
    const product = await prisma.product.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      select: { id: true },
    });

    if (!product) return errorResponse("Product not found", 404, "NOT_FOUND");

    const result = await validateBody(request, createReviewSchema);
    if ("error" in result) return result.error;

    const review = await reviewService.create({
      productId: product.id,
      userId: session.user.id,
      ...result.data,
    });

    return successResponse(review, 201);
  } catch (error) {
    return handleError(error);
  }
});
