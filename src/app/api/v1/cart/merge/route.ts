import { NextRequest } from "next/server";
import { cartService } from "@/services/cart.service";
import { successResponse, handleError, errorResponse } from "@/helpers/api-response";
import { withAuth } from "@/helpers/auth-guard";
import { CART_SESSION_COOKIE } from "@/lib/constants";

// POST /api/v1/cart/merge - Merge guest cart into user cart
export const POST = withAuth(async (request, _context, session) => {
  try {
    const sessionId =
      request.cookies.get(CART_SESSION_COOKIE)?.value ||
      request.headers.get("x-cart-session");

    if (!sessionId) {
      return errorResponse("No guest cart session found", 400, "NO_SESSION");
    }

    await cartService.mergeGuestCart(session.user.id, sessionId);
    const cart = await cartService.getCart(session.user.id);

    return successResponse(cart);
  } catch (error) {
    return handleError(error);
  }
});
