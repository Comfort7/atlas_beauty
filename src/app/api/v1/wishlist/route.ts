import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAuth } from "@/helpers/auth-guard";
import { validateQuery } from "@/helpers/validate-request";
import { paginationSchema, getPaginationMeta } from "@/helpers/pagination";

// GET /api/v1/wishlist
export const GET = withAuth(async (request, _context, session) => {
  try {
    const result = validateQuery(request, paginationSchema);
    if ("error" in result) return result.error;

    const { page, limit } = result.data;

    const [items, total] = await Promise.all([
      prisma.wishlistItem.findMany({
        where: { userId: session.user.id },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              basePrice: true,
              compareAtPrice: true,
              averageRating: true,
              images: { take: 1, orderBy: { position: "asc" } },
              brand: { select: { name: true } },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.wishlistItem.count({ where: { userId: session.user.id } }),
    ]);

    return successResponse(items, 200, getPaginationMeta(total, page, limit));
  } catch (error) {
    return handleError(error);
  }
});
