import { NextRequest } from "next/server";
import { cartService } from "@/services/cart.service";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { updateItemSchema } from "../../schema";

// PATCH /api/v1/cart/items/:itemId - Update quantity
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const result = await validateBody(request, updateItemSchema);
    if ("error" in result) return result.error;

    const item = await cartService.updateItemQuantity(itemId, result.data.quantity);
    return successResponse(item);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/v1/cart/items/:itemId - Remove item
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    await cartService.removeItem(itemId);
    return successResponse({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
