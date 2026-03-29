import { prisma } from "@/lib/prisma";
import { Prisma, OrderStatus } from "@prisma/client";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { generateOrderNumber } from "@/helpers/order-number";
import { TAX_RATE, SHIPPING_METHODS } from "@/lib/constants";
import { couponService } from "./coupon.service";
import { inventoryService } from "./inventory.service";
import { emailService } from "./email.service";

const orderInclude = {
  items: {
    include: {
      variant: {
        include: {
          product: {
            select: {
              id: true,
              slug: true,
              images: { take: 1, orderBy: { position: "asc" as const } },
            },
          },
        },
      },
    },
  },
  address: true,
  coupon: true,
  user: { select: { id: true, email: true, name: true } },
};

export const orderService = {
  async createFromCart(
    userId: string,
    addressId: string,
    shippingMethod: string
  ) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
                inventory: true,
              },
            },
          },
        },
        coupon: true,
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new ValidationError("Cart is empty");
    }

    // Validate address
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });
    if (!address) throw new NotFoundError("Address");

    // Validate shipping method
    const shipping = Object.values(SHIPPING_METHODS).find(
      (m) => m.id === shippingMethod
    );
    if (!shipping) throw new ValidationError("Invalid shipping method");

    // Calculate totals
    let subtotal = new Prisma.Decimal(0);
    const orderItems: {
      variantId: string;
      productName: string;
      variantName: string;
      sku: string;
      price: Prisma.Decimal;
      quantity: number;
    }[] = [];

    for (const item of cart.items) {
      const available =
        (item.variant.inventory?.quantity ?? 0) -
        (item.variant.inventory?.reservedQuantity ?? 0);

      if (available < item.quantity) {
        throw new ValidationError(
          `Insufficient stock for ${item.variant.product.name} - ${item.variant.name}`
        );
      }

      subtotal = subtotal.add(item.variant.price.mul(item.quantity));
      orderItems.push({
        variantId: item.variantId,
        productName: item.variant.product.name,
        variantName: item.variant.name,
        sku: item.variant.sku,
        price: item.variant.price,
        quantity: item.quantity,
      });
    }

    // Calculate discount
    let discount = new Prisma.Decimal(0);
    if (cart.coupon) {
      discount = couponService.calculateDiscount(cart.coupon, subtotal);
    }

    // Calculate shipping
    const subtotalAfterDiscount = subtotal.sub(discount);
    let shippingCost = new Prisma.Decimal(shipping.baseRate);
    if (
      shipping.freeThreshold &&
      subtotalAfterDiscount.gte(shipping.freeThreshold)
    ) {
      shippingCost = new Prisma.Decimal(0);
    }
    if (cart.coupon?.type === "FREE_SHIPPING") {
      shippingCost = new Prisma.Decimal(0);
    }

    // Calculate tax
    const tax = subtotalAfterDiscount.mul(TAX_RATE);
    const total = subtotalAfterDiscount.add(shippingCost).add(tax);

    // Create order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Reserve inventory
      for (const item of cart.items) {
        await tx.inventory.update({
          where: { variantId: item.variantId },
          data: { reservedQuantity: { increment: item.quantity } },
        });
      }

      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId,
          addressId,
          subtotal,
          discount,
          shippingCost,
          tax,
          total,
          shippingMethod: shipping.id,
          couponId: cart.coupon?.id,
          items: { create: orderItems },
        },
        include: orderInclude,
      });

      // Increment coupon usage
      if (cart.coupon) {
        await tx.coupon.update({
          where: { id: cart.coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      await tx.cart.update({
        where: { id: cart.id },
        data: { couponId: null },
      });

      return newOrder;
    });

    return order;
  },

  async getById(orderId: string, userId?: string) {
    const where: Prisma.OrderWhereInput = { id: orderId };
    if (userId) where.userId = userId;

    const order = await prisma.order.findFirst({
      where,
      include: orderInclude,
    });

    if (!order) throw new NotFoundError("Order");
    return order;
  },

  async listByUser(userId: string, page: number, limit: number) {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: orderInclude,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return { orders, total };
  },

  async listAll(
    page: number,
    limit: number,
    filters?: { status?: string; paymentStatus?: string }
  ) {
    const where: Prisma.OrderWhereInput = {};
    if (filters?.status) where.status = filters.status as OrderStatus;
    if (filters?.paymentStatus)
      where.paymentStatus = filters.paymentStatus as Prisma.EnumPaymentStatusFilter["equals"];

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: orderInclude,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total };
  },

  async updateStatus(orderId: string, status: OrderStatus) {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: orderInclude,
    });

    if (status === "SHIPPED") {
      await emailService.sendShippingUpdate(
        order.user.email,
        order.orderNumber,
        order.trackingNumber,
        order.trackingUrl
      );
    }

    return order;
  },

  async addTracking(
    orderId: string,
    trackingNumber: string,
    trackingUrl?: string
  ) {
    return prisma.order.update({
      where: { id: orderId },
      data: { trackingNumber, trackingUrl, status: "SHIPPED" },
      include: orderInclude,
    });
  },

  async cancelOrder(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true },
    });

    if (!order) throw new NotFoundError("Order");

    if (!["PENDING", "CONFIRMED"].includes(order.status)) {
      throw new ValidationError("Order cannot be cancelled at this stage");
    }

    await prisma.$transaction(async (tx) => {
      // Release reserved inventory
      for (const item of order.items) {
        await tx.inventory.update({
          where: { variantId: item.variantId },
          data: { reservedQuantity: { decrement: item.quantity } },
        });
      }

      await tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });
    });
  },

  async confirmPayment(stripeSessionId: string) {
    const order = await prisma.order.findUnique({
      where: { stripeSessionId },
      include: { items: true, user: { select: { email: true, name: true } } },
    });

    if (!order) throw new NotFoundError("Order");

    await prisma.$transaction(async (tx) => {
      // Finalize inventory: decrement quantity, release reservation
      for (const item of order.items) {
        await inventoryService.finalizeReservation(
          item.variantId,
          item.quantity,
          tx
        );
      }

      await tx.order.update({
        where: { id: order.id },
        data: { status: "CONFIRMED", paymentStatus: "PAID" },
      });
    });

    await emailService.sendOrderConfirmation(
      order.user.email,
      order.orderNumber,
      order.total.toString()
    );

    return order;
  },

  async handleExpiredSession(stripeSessionId: string) {
    const order = await prisma.order.findUnique({
      where: { stripeSessionId },
      include: { items: true },
    });

    if (!order || order.status !== "PENDING") return;

    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.inventory.update({
          where: { variantId: item.variantId },
          data: { reservedQuantity: { decrement: item.quantity } },
        });
      }

      await tx.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED", paymentStatus: "FAILED" },
      });
    });
  },
};
