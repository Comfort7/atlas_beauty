import { NextRequest } from "next/server";
import { productService } from "@/services/product.service";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { updateProductSchema } from "../schema";

// GET /api/v1/products/:idOrSlug
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await params;
    const product = await productService.getByIdOrSlug(idOrSlug);
    return successResponse(product);
  } catch (error) {
    return handleError(error);
  }
}

// PATCH /api/v1/products/:idOrSlug - Admin only
export const PATCH = withAdmin(async (request, context) => {
  try {
    const { idOrSlug } = await context.params;
    const result = await validateBody(request, updateProductSchema);
    if ("error" in result) return result.error;

    const product = await productService.update(idOrSlug, result.data);
    return successResponse(product);
  } catch (error) {
    return handleError(error);
  }
});

// DELETE /api/v1/products/:idOrSlug - Admin only
export const DELETE = withAdmin(async (_request, context) => {
  try {
    const { idOrSlug } = await context.params;
    await productService.delete(idOrSlug);
    return successResponse({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
});
