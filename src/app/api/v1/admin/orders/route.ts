import { NextRequest } from "next/server";
import { orderService } from "@/services/order.service";
import { validateQuery } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { getPaginationMeta } from "@/helpers/pagination";
import { z } from "zod";

const adminOrderQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.string().optional(),
  paymentStatus: z.string().optional(),
});

// GET /api/v1/admin/orders
export const GET = withAdmin(async (request) => {
  try {
    const result = validateQuery(request, adminOrderQuerySchema);
    if ("error" in result) return result.error;

    const { page, limit, ...filters } = result.data;
    const { orders, total } = await orderService.listAll(page, limit, filters);

    return successResponse(orders, 200, getPaginationMeta(total, page, limit));
  } catch (error) {
    return handleError(error);
  }
});
