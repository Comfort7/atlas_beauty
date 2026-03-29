import { NextRequest } from "next/server";
import { orderService } from "@/services/order.service";
import { validateQuery } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAuth } from "@/helpers/auth-guard";
import { getPaginationMeta } from "@/helpers/pagination";
import { orderQuerySchema } from "./schema";

// GET /api/v1/orders - List my orders
export const GET = withAuth(async (request, _context, session) => {
  try {
    const result = validateQuery(request, orderQuerySchema);
    if ("error" in result) return result.error;

    const { page, limit } = result.data;
    const { orders, total } = await orderService.listByUser(
      session.user.id,
      page,
      limit
    );

    return successResponse(orders, 200, getPaginationMeta(total, page, limit));
  } catch (error) {
    return handleError(error);
  }
});
