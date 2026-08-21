import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { cartService } from "@/services/cart.service";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, errorResponse, handleError } from "@/helpers/api-response";
import { updateItemSchema } from "../../schema";
import { CART_SESSION_COOKIE } from "@/lib/constants";

async function resolveCartId(request: NextRequest) {
  const session = await auth();
  const sessionId =
    request.cookies.get(CART_SESSION_COOKIE)?.value ||
    request.headers.get("x-cart-session") ||
    undefined;

  if (!session?.user?.id && !sessionId) return null;

  const cart = await cartService.getCart(session?.user?.id, sessionId);
  return cart?.id ?? null;
}

// PATCH /api/v1/cart/items/:itemId - Update quantity
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const result = await validateBody(request, updateItemSchema);
    if ("error" in result) return result.error;

    const cartId = await resolveCartId(request);
    if (!cartId) return errorResponse("Cart not found", 404, "NOT_FOUND");

    const item = await cartService.updateItemQuantity(cartId, itemId, result.data.quantity);
    return successResponse(item);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/v1/cart/items/:itemId - Remove item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;

    const cartId = await resolveCartId(request);
    if (!cartId) return errorResponse("Cart not found", 404, "NOT_FOUND");

    await cartService.removeItem(cartId, itemId);
    return successResponse({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
