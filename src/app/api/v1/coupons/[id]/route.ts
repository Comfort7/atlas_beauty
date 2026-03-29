import { NextRequest } from "next/server";
import { couponService } from "@/services/coupon.service";
import { prisma } from "@/lib/prisma";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError, errorResponse } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { updateCouponSchema } from "../schema";

// GET /api/v1/coupons/:id
export const GET = withAdmin(async (_request, context) => {
  try {
    const { id } = await context.params;
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) return errorResponse("Coupon not found", 404, "NOT_FOUND");
    return successResponse(coupon);
  } catch (error) {
    return handleError(error);
  }
});

// PATCH /api/v1/coupons/:id
export const PATCH = withAdmin(async (request, context) => {
  try {
    const { id } = await context.params;
    const result = await validateBody(request, updateCouponSchema);
    if ("error" in result) return result.error;

    const coupon = await couponService.update(id, result.data);
    return successResponse(coupon);
  } catch (error) {
    return handleError(error);
  }
});

// DELETE /api/v1/coupons/:id
export const DELETE = withAdmin(async (_request, context) => {
  try {
    const { id } = await context.params;
    await couponService.delete(id);
    return successResponse({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
});
