import { NextRequest } from "next/server";
import { inventoryService } from "@/services/inventory.service";
import { validateQuery } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { getPaginationMeta } from "@/helpers/pagination";
import { z } from "zod";

const inventoryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  lowStock: z.coerce.boolean().default(false),
});

// GET /api/v1/admin/inventory
export const GET = withAdmin(async (request) => {
  try {
    const result = validateQuery(request, inventoryQuerySchema);
    if ("error" in result) return result.error;

    const { page, limit, lowStock } = result.data;
    const { inventories, total } = await inventoryService.listAll(
      page,
      limit,
      lowStock
    );

    return successResponse(inventories, 200, getPaginationMeta(total, page, limit));
  } catch (error) {
    return handleError(error);
  }
});
