import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError, errorResponse } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { createUniqueSlug } from "@/helpers/slug";
import { invalidateCache } from "@/helpers/cache";
import { updateCategorySchema } from "../schema";

// GET /api/v1/categories/:idOrSlug
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await params;
    const category = await prisma.category.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      include: {
        children: { include: { _count: { select: { products: true } } } },
        parent: true,
        _count: { select: { products: true } },
      },
    });

    if (!category) return errorResponse("Category not found", 404, "NOT_FOUND");
    return successResponse(category);
  } catch (error) {
    return handleError(error);
  }
}

// PATCH /api/v1/categories/:idOrSlug - Admin only
export const PATCH = withAdmin(async (request, context) => {
  try {
    const { idOrSlug } = await context.params;
    const result = await validateBody(request, updateCategorySchema);
    if ("error" in result) return result.error;

    const existing = await prisma.category.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    });
    if (!existing) return errorResponse("Category not found", 404, "NOT_FOUND");

    const updateData: Record<string, unknown> = { ...result.data };
    if (result.data.name && result.data.name !== existing.name) {
      updateData.slug = await createUniqueSlug(result.data.name, "category");
    }

    const category = await prisma.category.update({
      where: { id: existing.id },
      data: updateData,
    });

    await invalidateCache("categories:*");
    return successResponse(category);
  } catch (error) {
    return handleError(error);
  }
});

// DELETE /api/v1/categories/:idOrSlug - Admin only
export const DELETE = withAdmin(async (_request, context) => {
  try {
    const { idOrSlug } = await context.params;
    const existing = await prisma.category.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    });
    if (!existing) return errorResponse("Category not found", 404, "NOT_FOUND");

    await prisma.category.delete({ where: { id: existing.id } });
    await invalidateCache("categories:*");
    return successResponse({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
});
