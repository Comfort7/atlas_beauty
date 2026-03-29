import { NextRequest } from "next/server";
import { searchService } from "@/services/search.service";
import { validateQuery } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { getPaginationMeta } from "@/helpers/pagination";
import { z } from "zod";

const searchQuerySchema = z.object({
  q: z.string().min(1).max(200),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "rating"]).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const result = validateQuery(request, searchQuerySchema);
    if ("error" in result) return result.error;

    const { q, page, limit, ...filters } = result.data;
    const { products, total } = await searchService.search(q, filters, page, limit);

    return successResponse(products, 200, getPaginationMeta(total, page, limit));
  } catch (error) {
    return handleError(error);
  }
}
