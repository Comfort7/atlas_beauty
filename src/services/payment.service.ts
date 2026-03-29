import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { AppError, NotFoundError } from "@/lib/errors";

export const paymentService = {
  async createCheckoutSession(orderId: string) {
    if (!stripe) {
      throw new AppError(
        503,
        "Payments are not configured (missing STRIPE_SECRET_KEY)",
        "PAYMENT_UNAVAILABLE"
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    images: { take: 1, orderBy: { position: "asc" as const } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) throw new NotFoundError("Order");

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${item.productName} - ${item.variantName}`,
          images: item.variant.product.images[0]
            ? [item.variant.product.images[0].url]
            : [],
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item
    if (Number(order.shippingCost) > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
            images: [],
          },
          unit_amount: Math.round(Number(order.shippingCost) * 100),
        },
        quantity: 1,
      });
    }

    // Add tax as a line item
    if (Number(order.tax) > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Tax",
            images: [],
          },
          unit_amount: Math.round(Number(order.tax) * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      metadata: { orderId: order.id },
      success_url: `${process.env.APP_URL}/orders/${order.id}?success=true`,
      cancel_url: `${process.env.APP_URL}/orders/${order.id}?cancelled=true`,
      expires_at: Math.floor(Date.now() / 1000) + 1800, // 30 minutes
    });

    // Store stripe session ID on the order
    await prisma.order.update({
      where: { id: orderId },
      data: { stripeSessionId: session.id },
    });

    return { sessionId: session.id, url: session.url };
  },

  async issueRefund(orderId: string, reason?: string) {
    if (!stripe) {
      throw new AppError(
        503,
        "Payments are not configured (missing STRIPE_SECRET_KEY)",
        "PAYMENT_UNAVAILABLE"
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new NotFoundError("Order");
    if (!order.stripePaymentIntentId) {
      throw new Error("No payment found for this order");
    }

    const refund = await stripe.refunds.create({
      payment_intent: order.stripePaymentIntentId,
      reason: "requested_by_customer",
      metadata: { orderId, reason: reason || "" },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "REFUNDED", paymentStatus: "REFUNDED" },
    });

    return refund;
  },
};
