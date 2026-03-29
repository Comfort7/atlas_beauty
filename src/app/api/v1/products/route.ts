import { NextRequest } from "next/server";
import { productService } from "@/services/product.service";
import { validateBody, validateQuery } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { getPaginationMeta } from "@/helpers/pagination";
import { createProductSchema, productQuerySchema } from "./schema";

// GET /api/v1/products
export async function GET(request: NextRequest) {
  try {
    const result = validateQuery(request, productQuerySchema);
    if ("error" in result) return result.error;

    const { page, limit, tags, featured, ...filters } = result.data;
    const productFilters = {
      ...filters,
      tags: tags ? tags.split(",") : undefined,
      isFeatured: featured,
    };

    const { products, total } = await productService.list(productFilters, page, limit);
    return successResponse(products, 200, getPaginationMeta(total, page, limit));
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/v1/products - Admin only
export const POST = withAdmin(async (request) => {
  try {
    const result = await validateBody(request, createProductSchema);
    if ("error" in result) return result.error;

    const product = await productService.create(result.data);
    return successResponse(product, 201);
  } catch (error) {
    return handleError(error);
  }
});
