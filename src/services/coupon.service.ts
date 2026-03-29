import { prisma } from "@/lib/prisma";
import { Coupon, Prisma } from "@prisma/client";
import { NotFoundError, ValidationError } from "@/lib/errors";

export const couponService = {
  async validate(code: string, subtotal?: number, userId?: string) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) throw new NotFoundError("Coupon");

    if (!coupon.isActive) {
      throw new ValidationError("This coupon is no longer active");
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new ValidationError("This coupon has expired");
    }

    if (coupon.startsAt > new Date()) {
      throw new ValidationError("This coupon is not yet active");
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw new ValidationError("This coupon has reached its usage limit");
    }

    if (coupon.minOrderAmount && subtotal) {
      if (new Prisma.Decimal(subtotal).lt(coupon.minOrderAmount)) {
        throw new ValidationError(
          `Minimum order amount of $${coupon.minOrderAmount} required`
        );
      }
    }

    // Check per-user usage
    if (userId && coupon.maxUsesPerUser) {
      const userUsage = await prisma.order.count({
        where: { userId, couponId: coupon.id, paymentStatus: "PAID" },
      });
      if (userUsage >= coupon.maxUsesPerUser) {
        throw new ValidationError("You have already used this coupon");
      }
    }

    return coupon;
  },

  calculateDiscount(coupon: Coupon, subtotal: Prisma.Decimal): Prisma.Decimal {
    switch (coupon.type) {
      case "PERCENTAGE":
        return subtotal.mul(coupon.value).div(100);
      case "FIXED":
        return Prisma.Decimal.min(coupon.value, subtotal);
      case "FREE_SHIPPING":
        return new Prisma.Decimal(0); // Handled in shipping calculation
      default:
        return new Prisma.Decimal(0);
    }
  },

  async create(data: {
    code: string;
    description?: string;
    type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
    value: number;
    minOrderAmount?: number;
    maxUses?: number;
    maxUsesPerUser?: number;
    startsAt?: Date;
    expiresAt?: Date;
  }) {
    return prisma.coupon.create({
      data: {
        ...data,
        code: data.code.toUpperCase(),
        value: new Prisma.Decimal(data.value),
        minOrderAmount: data.minOrderAmount
          ? new Prisma.Decimal(data.minOrderAmount)
          : null,
      },
    });
  },

  async update(
    id: string,
    data: Partial<{
      description: string;
      type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
      value: number;
      minOrderAmount: number;
      maxUses: number;
      maxUsesPerUser: number;
      isActive: boolean;
      startsAt: Date;
      expiresAt: Date;
    }>
  ) {
    const updateData: Prisma.CouponUpdateInput = { ...data };
    if (data.value !== undefined) {
      updateData.value = new Prisma.Decimal(data.value);
    }
    if (data.minOrderAmount !== undefined) {
      updateData.minOrderAmount = new Prisma.Decimal(data.minOrderAmount);
    }

    return prisma.coupon.update({ where: { id }, data: updateData });
  },

  async delete(id: string) {
    await prisma.coupon.delete({ where: { id } });
  },

  async list(page: number, limit: number) {
    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.coupon.count(),
    ]);

    return { coupons, total };
  },
};
