import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { orderService } from "@/services/order.service";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return Response.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return Response.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Idempotency check
  const existingEvent = await prisma.processedEvent.findUnique({
    where: { id: event.id },
  });

  if (existingEvent) {
    return Response.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Update order with payment intent ID
        if (session.metadata?.orderId) {
          await prisma.order.update({
            where: { id: session.metadata.orderId },
            data: {
              stripePaymentIntentId: session.payment_intent as string,
            },
          });
        }

        if (session.id) {
          await orderService.confirmPayment(session.id);
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.id) {
          await orderService.handleExpiredSession(session.id);
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string;

        if (paymentIntentId) {
          const order = await prisma.order.findUnique({
            where: { stripePaymentIntentId: paymentIntentId },
          });

          if (order) {
            const isFullRefund = charge.amount_refunded === charge.amount;
            await prisma.order.update({
              where: { id: order.id },
              data: {
                paymentStatus: isFullRefund ? "REFUNDED" : "PARTIALLY_REFUNDED",
                status: isFullRefund ? "REFUNDED" : order.status,
              },
            });
          }
        }
        break;
      }

      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute;
        const charge = dispute.charge as string;

        console.error(`Payment dispute created for charge: ${charge}`);
        // In production, notify admin via email or Slack
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Mark event as processed
    await prisma.processedEvent.create({
      data: { id: event.id, type: event.type },
    });
  } catch (error) {
    console.error(`Error processing webhook ${event.type}:`, error);
    return Response.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }

  return Response.json({ received: true });
}
