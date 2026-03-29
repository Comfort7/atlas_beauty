import { NextRequest } from "next/server";
import { paymentService } from "@/services/payment.service";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { z } from "zod";

const refundSchema = z.object({
  reason: z.string().max(500).optional(),
});

// POST /api/v1/admin/orders/:id/refund
export const POST = withAdmin(async (request, context) => {
  try {
    const { id } = await context.params;
    const result = await validateBody(request, refundSchema);
    if ("error" in result) return result.error;

    const refund = await paymentService.issueRefund(id, result.data.reason);
    return successResponse({ refundId: refund.id, status: refund.status });
  } catch (error) {
    return handleError(error);
  }
});
