import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { cartService } from "@/services/cart.service";
import { successResponse, handleError } from "@/helpers/api-response";
import { CART_SESSION_COOKIE } from "@/lib/constants";

function getSessionId(request: NextRequest): string | undefined {
  return (
    request.cookies.get(CART_SESSION_COOKIE)?.value ||
    request.headers.get("x-cart-session") ||
    undefined
  );
}

// GET /api/v1/cart
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const sessionId = getSessionId(request);

    const cart = await cartService.getCart(session?.user?.id, sessionId);

    if (!cart) {
      return successResponse({ items: [], coupon: null });
    }

    return successResponse(cart);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/v1/cart - Clear cart
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    const sessionId = getSessionId(request);

    const cart = await cartService.getCart(session?.user?.id, sessionId);
    if (cart) {
      await cartService.clearCart(cart.id);
    }

    return successResponse({ cleared: true });
  } catch (error) {
    return handleError(error);
  }
}
