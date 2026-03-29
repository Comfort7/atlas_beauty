import { NextRequest } from "next/server";
import { inventoryService } from "@/services/inventory.service";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { z } from "zod";

const updateStockSchema = z.object({
  quantity: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).optional(),
});

// PATCH /api/v1/admin/inventory/:variantId
export const PATCH = withAdmin(async (request, context) => {
  try {
    const { variantId } = await context.params;
    const result = await validateBody(request, updateStockSchema);
    if ("error" in result) return result.error;

    const inventory = await inventoryService.updateStock(
      variantId,
      result.data.quantity
    );

    return successResponse(inventory);
  } catch (error) {
    return handleError(error);
  }
});
