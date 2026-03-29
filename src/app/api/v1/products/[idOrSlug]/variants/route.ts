import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { createVariantSchema } from "../../schema";

// GET /api/v1/products/:idOrSlug/variants
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await params;
    const product = await prisma.product.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      select: { id: true },
    });

    if (!product) {
      return successResponse([], 200);
    }

    const variants = await prisma.productVariant.findMany({
      where: { productId: product.id },
      include: { inventory: true },
      orderBy: { createdAt: "asc" },
    });

    return successResponse(variants);
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/v1/products/:idOrSlug/variants - Admin only
export const POST = withAdmin(async (request, context) => {
  try {
    const { idOrSlug } = await context.params;
    const result = await validateBody(request, createVariantSchema);
    if ("error" in result) return result.error;

    const product = await prisma.product.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    });

    if (!product) {
      return successResponse(null, 404);
    }

    const { quantity, lowStockThreshold, options, ...variantData } = result.data;

    const variant = await prisma.$transaction(async (tx) => {
      const v = await tx.productVariant.create({
        data: {
          ...variantData,
          options: options as Prisma.InputJsonValue,
          productId: product.id,
          price: new Prisma.Decimal(variantData.price),
          compareAtPrice: variantData.compareAtPrice
            ? new Prisma.Decimal(variantData.compareAtPrice)
            : null,
          weight: variantData.weight
            ? new Prisma.Decimal(variantData.weight)
            : null,
        },
      });

      await tx.inventory.create({
        data: {
          variantId: v.id,
          quantity,
          lowStockThreshold,
        },
      });

      return tx.productVariant.findUnique({
        where: { id: v.id },
        include: { inventory: true },
      });
    });

    return successResponse(variant, 201);
  } catch (error) {
    return handleError(error);
  }
});
