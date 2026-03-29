import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError, errorResponse } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { createUniqueSlug } from "@/helpers/slug";
import { updateBrandSchema } from "../schema";

// GET /api/v1/brands/:id
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!brand) return errorResponse("Brand not found", 404, "NOT_FOUND");
    return successResponse(brand);
  } catch (error) {
    return handleError(error);
  }
}

// PATCH /api/v1/brands/:id - Admin only
export const PATCH = withAdmin(async (request, context) => {
  try {
    const { id } = await context.params;
    const result = await validateBody(request, updateBrandSchema);
    if ("error" in result) return result.error;

    const existing = await prisma.brand.findUnique({ where: { id } });
    if (!existing) return errorResponse("Brand not found", 404, "NOT_FOUND");

    const updateData: Record<string, unknown> = { ...result.data };
    if (result.data.name && result.data.name !== existing.name) {
      updateData.slug = await createUniqueSlug(result.data.name, "brand");
    }

    const brand = await prisma.brand.update({ where: { id }, data: updateData });
    return successResponse(brand);
  } catch (error) {
    return handleError(error);
  }
});

// DELETE /api/v1/brands/:id - Admin only
export const DELETE = withAdmin(async (_request, context) => {
  try {
    const { id } = await context.params;
    await prisma.brand.delete({ where: { id } });
    return successResponse({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
});
