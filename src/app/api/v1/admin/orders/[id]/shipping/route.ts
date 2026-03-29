import { NextRequest } from "next/server";
import { orderService } from "@/services/order.service";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { z } from "zod";

const addTrackingSchema = z.object({
  trackingNumber: z.string().min(1).max(100),
  trackingUrl: z.string().url().optional(),
});

// PATCH /api/v1/admin/orders/:id/shipping
export const PATCH = withAdmin(async (request, context) => {
  try {
    const { id } = await context.params;
    const result = await validateBody(request, addTrackingSchema);
    if ("error" in result) return result.error;

    const order = await orderService.addTracking(
      id,
      result.data.trackingNumber,
      result.data.trackingUrl
    );

    return successResponse(order);
  } catch (error) {
    return handleError(error);
  }
});
