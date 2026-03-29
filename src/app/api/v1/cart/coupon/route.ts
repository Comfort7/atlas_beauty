import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { cartService } from "@/services/cart.service";
import { couponService } from "@/services/coupon.service";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError, errorResponse } from "@/helpers/api-response";
import { applyCouponSchema } from "../schema";
import { CART_SESSION_COOKIE } from "@/lib/constants";

// POST /api/v1/cart/coupon - Apply coupon
export async function POST(request: NextRequest) {
  try {
    const result = await validateBody(request, applyCouponSchema);
    if ("error" in result) return result.error;

    const session = await auth();
    const sessionId =
      request.cookies.get(CART_SESSION_COOKIE)?.value ||
      request.headers.get("x-cart-session") ||
      undefined;

    const cart = await cartService.getCart(session?.user?.id, sessionId);
    if (!cart) return errorResponse("Cart not found", 404, "NOT_FOUND");

    const coupon = await couponService.validate(
      result.data.code,
      undefined,
      session?.user?.id
    );

    const updatedCart = await cartService.applyCoupon(cart.id, coupon.id);
    return successResponse(updatedCart);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/v1/cart/coupon - Remove coupon
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    const sessionId =
      request.cookies.get(CART_SESSION_COOKIE)?.value ||
      request.headers.get("x-cart-session") ||
      undefined;

    const cart = await cartService.getCart(session?.user?.id, sessionId);
    if (!cart) return errorResponse("Cart not found", 404, "NOT_FOUND");

    const updatedCart = await cartService.removeCoupon(cart.id);
    return successResponse(updatedCart);
  } catch (error) {
    return handleError(error);
  }
}
