import { NextRequest } from "next/server";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAuth } from "@/helpers/auth-guard";
import { checkoutSchema } from "./schema";

// POST /api/v1/checkout - Create order and Stripe checkout session
export const POST = withAuth(async (request, _context, session) => {
  try {
    const result = await validateBody(request, checkoutSchema);
    if ("error" in result) return result.error;

    // Create order from cart
    const order = await orderService.createFromCart(
      session.user.id,
      result.data.addressId,
      result.data.shippingMethod
    );

    // Create Stripe checkout session
    const checkout = await paymentService.createCheckoutSession(order.id);

    return successResponse({
      orderId: order.id,
      orderNumber: order.orderNumber,
      checkoutUrl: checkout.url,
      sessionId: checkout.sessionId,
    });
  } catch (error) {
    return handleError(error);
  }
});
