import { NextRequest } from "next/server";
import { orderService } from "@/services/order.service";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAuth } from "@/helpers/auth-guard";

// POST /api/v1/orders/:id/cancel
export const POST = withAuth(async (_request, context, session) => {
  try {
    const { id } = await context.params;
    await orderService.cancelOrder(id, session.user.id);
    return successResponse({ message: "Order cancellation requested" });
  } catch (error) {
    return handleError(error);
  }
});
