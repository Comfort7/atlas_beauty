import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { couponService } from "@/services/coupon.service";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { validateCouponSchema } from "../schema";

// POST /api/v1/coupons/validate
export async function POST(request: NextRequest) {
  try {
    const result = await validateBody(request, validateCouponSchema);
    if ("error" in result) return result.error;

    const session = await auth();
    const coupon = await couponService.validate(
      result.data.code,
      undefined,
      session?.user?.id
    );

    return successResponse({
      valid: true,
      type: coupon.type,
      value: coupon.value,
      description: coupon.description,
    });
  } catch (error) {
    return handleError(error);
  }
}
