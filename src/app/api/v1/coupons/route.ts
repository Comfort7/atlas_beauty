import { NextRequest } from "next/server";
import { couponService } from "@/services/coupon.service";
import { validateBody, validateQuery } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { paginationSchema, getPaginationMeta } from "@/helpers/pagination";
import { createCouponSchema } from "./schema";

// GET /api/v1/coupons - Admin: list all
export const GET = withAdmin(async (request) => {
  try {
    const result = validateQuery(request, paginationSchema);
    if ("error" in result) return result.error;

    const { page, limit } = result.data;
    const { coupons, total } = await couponService.list(page, limit);

    return successResponse(coupons, 200, getPaginationMeta(total, page, limit));
  } catch (error) {
    return handleError(error);
  }
});

// POST /api/v1/coupons - Admin: create
export const POST = withAdmin(async (request) => {
  try {
    const result = await validateBody(request, createCouponSchema);
    if ("error" in result) return result.error;

    const coupon = await couponService.create(result.data);
    return successResponse(coupon, 201);
  } catch (error) {
    return handleError(error);
  }
});
