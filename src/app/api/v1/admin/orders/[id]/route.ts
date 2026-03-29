import { NextRequest } from "next/server";
import { orderService } from "@/services/order.service";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { z } from "zod";

const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
});

// PATCH /api/v1/admin/orders/:id - Update order status
export const PATCH = withAdmin(async (request, context) => {
  try {
    const { id } = await context.params;
    const result = await validateBody(request, updateOrderStatusSchema);
    if ("error" in result) return result.error;

    const order = await orderService.updateStatus(id, result.data.status);
    return successResponse(order);
  } catch (error) {
    return handleError(error);
  }
});
