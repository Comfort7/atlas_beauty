import { NextRequest } from "next/server";
import { productService } from "@/services/product.service";
import { validateQuery } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { paginationSchema, getPaginationMeta } from "@/helpers/pagination";
import { prisma } from "@/lib/prisma";

// GET /api/v1/categories/:idOrSlug/products
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await params;
    const category = await prisma.category.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    });

    if (!category) {
      return successResponse([], 200);
    }

    const result = validateQuery(request, paginationSchema);
    if ("error" in result) return result.error;

    const { page, limit } = result.data;
    const { products, total } = await productService.list(
      { category: category.slug },
      page,
      limit
    );

    return successResponse(products, 200, getPaginationMeta(total, page, limit));
  } catch (error) {
    return handleError(error);
  }
}
