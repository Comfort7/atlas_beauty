import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError, errorResponse } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { updateVariantSchema } from "../../../schema";

// PATCH /api/v1/products/:idOrSlug/variants/:variantId
export const PATCH = withAdmin(async (request, context) => {
  try {
    const { variantId } = await context.params;
    const result = await validateBody(request, updateVariantSchema);
    if ("error" in result) return result.error;

    const existing = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });
    if (!existing) return errorResponse("Variant not found", 404, "NOT_FOUND");

    const updateData: Prisma.ProductVariantUpdateInput = {};
    if (result.data.sku) updateData.sku = result.data.sku;
    if (result.data.name) updateData.name = result.data.name;
    if (result.data.price !== undefined)
      updateData.price = new Prisma.Decimal(result.data.price);
    if (result.data.compareAtPrice !== undefined)
      updateData.compareAtPrice = new Prisma.Decimal(result.data.compareAtPrice);
    if (result.data.options) updateData.options = result.data.options as Prisma.InputJsonValue;
    if (result.data.weight !== undefined)
      updateData.weight = new Prisma.Decimal(result.data.weight);
    if (result.data.isActive !== undefined)
      updateData.isActive = result.data.isActive;

    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: updateData,
      include: { inventory: true },
    });

    return successResponse(variant);
  } catch (error) {
    return handleError(error);
  }
});

// DELETE /api/v1/products/:idOrSlug/variants/:variantId
export const DELETE = withAdmin(async (_request, context) => {
  try {
    const { variantId } = await context.params;
    await prisma.productVariant.delete({ where: { id: variantId } });
    return successResponse({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
});
