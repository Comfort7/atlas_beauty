import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, handleError, errorResponse } from "@/helpers/api-response";
import { withAuth } from "@/helpers/auth-guard";

// POST /api/v1/wishlist/:productId - Add to wishlist
export const POST = withAuth(async (_request, context, session) => {
  try {
    const { productId } = await context.params;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) return errorResponse("Product not found", 404, "NOT_FOUND");

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existing) {
      return successResponse(existing);
    }

    const item = await prisma.wishlistItem.create({
      data: { userId: session.user.id, productId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            basePrice: true,
            images: { take: 1, orderBy: { position: "asc" } },
          },
        },
      },
    });

    return successResponse(item, 201);
  } catch (error) {
    return handleError(error);
  }
});

// DELETE /api/v1/wishlist/:productId - Remove from wishlist
export const DELETE = withAuth(async (_request, context, session) => {
  try {
    const { productId } = await context.params;

    await prisma.wishlistItem.deleteMany({
      where: { userId: session.user.id, productId },
    });

    return successResponse({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
});
