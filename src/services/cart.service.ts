import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError } from "@/lib/errors";

const cartInclude = {
  items: {
    include: {
      variant: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: { take: 1, orderBy: { position: "asc" as const } },
            },
          },
          inventory: true,
        },
      },
    },
  },
  coupon: true,
};

export const cartService = {
  async getOrCreateCart(userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
      throw new ValidationError("User ID or session ID required");
    }

    let cart;
    if (userId) {
      cart = await prisma.cart.findUnique({
        where: { userId },
        include: cartInclude,
      });
    } else {
      cart = await prisma.cart.findUnique({
        where: { sessionId },
        include: cartInclude,
      });
    }

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId, sessionId },
        include: cartInclude,
      });
    }

    return cart;
  },

  async getCart(userId?: string, sessionId?: string) {
    if (userId) {
      return prisma.cart.findUnique({
        where: { userId },
        include: cartInclude,
      });
    }
    if (sessionId) {
      return prisma.cart.findUnique({
        where: { sessionId },
        include: cartInclude,
      });
    }
    return null;
  },

  async addItem(
    cartId: string,
    variantId: string,
    quantity: number
  ) {
    // Check inventory
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { inventory: true, product: { select: { isActive: true } } },
    });

    if (!variant || !variant.isActive || !variant.product.isActive) {
      throw new NotFoundError("Product variant");
    }

    const available = (variant.inventory?.quantity ?? 0) - (variant.inventory?.reservedQuantity ?? 0);
    if (available < quantity) {
      throw new ValidationError(`Only ${available} items available in stock`);
    }

    // Upsert cart item
    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_variantId: { cartId, variantId } },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > available) {
        throw new ValidationError(`Only ${available} items available in stock`);
      }
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    }

    return prisma.cartItem.create({
      data: { cartId, variantId, quantity },
    });
  },

  async updateItemQuantity(itemId: string, quantity: number) {
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { variant: { include: { inventory: true } } },
    });

    if (!item) throw new NotFoundError("Cart item");

    const available = (item.variant.inventory?.quantity ?? 0) - (item.variant.inventory?.reservedQuantity ?? 0);
    if (quantity > available) {
      throw new ValidationError(`Only ${available} items available in stock`);
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
      return null;
    }

    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  },

  async removeItem(itemId: string) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  },

  async clearCart(cartId: string) {
    await prisma.cartItem.deleteMany({ where: { cartId } });
    await prisma.cart.update({
      where: { id: cartId },
      data: { couponId: null },
    });
  },

  async mergeGuestCart(userId: string, sessionId: string) {
    const guestCart = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (!guestCart || guestCart.items.length === 0) return;

    const userCart = await this.getOrCreateCart(userId);

    for (const item of guestCart.items) {
      const existingItem = userCart.items.find(
        (i) => i.variantId === item.variantId
      );

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + item.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            variantId: item.variantId,
            quantity: item.quantity,
          },
        });
      }
    }

    // Delete guest cart
    await prisma.cart.delete({ where: { id: guestCart.id } });
  },

  async applyCoupon(cartId: string, couponId: string) {
    return prisma.cart.update({
      where: { id: cartId },
      data: { couponId },
      include: cartInclude,
    });
  },

  async removeCoupon(cartId: string) {
    return prisma.cart.update({
      where: { id: cartId },
      data: { couponId: null },
      include: cartInclude,
    });
  },
};
