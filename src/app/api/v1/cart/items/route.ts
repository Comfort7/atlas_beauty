import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { cartService } from "@/services/cart.service";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { addItemSchema } from "../schema";
import { CART_SESSION_COOKIE, CART_SESSION_MAX_AGE } from "@/lib/constants";
import { v4 as uuid } from "uuid";

// POST /api/v1/cart/items - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const result = await validateBody(request, addItemSchema);
    if ("error" in result) return result.error;

    const session = await auth();
    let sessionId =
      request.cookies.get(CART_SESSION_COOKIE)?.value ||
      request.headers.get("x-cart-session") ||
      undefined;

    // Generate session ID for guests
    if (!session?.user?.id && !sessionId) {
      sessionId = uuid();
    }

    const cart = await cartService.getOrCreateCart(session?.user?.id, sessionId);
    const item = await cartService.addItem(
      cart.id,
      result.data.variantId,
      result.data.quantity
    );

    // Get updated cart
    const updatedCart = await cartService.getCart(session?.user?.id, sessionId);

    const response = NextResponse.json(
      { success: true, data: updatedCart },
      { status: 200 }
    );

    // Set session cookie for guests
    if (!session?.user?.id && sessionId) {
      response.cookies.set(CART_SESSION_COOKIE, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: CART_SESSION_MAX_AGE,
        path: "/",
      });
    }

    return response;
  } catch (error) {
    return handleError(error);
  }
}
