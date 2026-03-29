import { NextRequest } from "next/server";
import { orderService } from "@/services/order.service";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAuth } from "@/helpers/auth-guard";

// GET /api/v1/orders/:id
export const GET = withAuth(async (_request, context, session) => {
  try {
    const { id } = await context.params;
    const userId = session.user.role === "ADMIN" ? undefined : session.user.id;
    const order = await orderService.getById(id, userId);
    return successResponse(order);
  } catch (error) {
    return handleError(error);
  }
});
