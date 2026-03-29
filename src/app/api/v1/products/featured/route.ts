import { NextRequest } from "next/server";
import { productService } from "@/services/product.service";
import { successResponse, handleError } from "@/helpers/api-response";
import { z } from "zod";

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export async function GET(request: NextRequest) {
  try {
    const limitParam = request.nextUrl.searchParams.get("limit");
    const parsed = querySchema.safeParse({ limit: limitParam || 12 });
    const limit = parsed.success ? parsed.data.limit : 12;

    const products = await productService.getFeatured(limit);
    return successResponse(products);
  } catch (error) {
    return handleError(error);
  }
}
