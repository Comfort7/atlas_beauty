import { prisma } from "@/lib/prisma";
import { ReviewStatus } from "@prisma/client";
import { NotFoundError, ValidationError, ConflictError } from "@/lib/errors";

export const reviewService = {
  async listByProduct(
    productId: string,
    page: number,
    limit: number
  ) {
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId, status: "APPROVED" },
        select: {
          id: true,
          rating: true,
          title: true,
          body: true,
          verifiedPurchase: true,
          createdAt: true,
          user: { select: { name: true, image: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({ where: { productId, status: "APPROVED" } }),
    ]);

    return { reviews, total };
  },

  async create(data: {
    productId: string;
    userId: string;
    rating: number;
    title?: string;
    body: string;
  }) {
    // Check for existing review
    const existing = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId: data.productId,
          userId: data.userId,
        },
      },
    });

    if (existing) {
      throw new ConflictError("You have already reviewed this product");
    }

    // Check verified purchase
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        order: { userId: data.userId, paymentStatus: "PAID" },
        variant: { productId: data.productId },
      },
    });

    const review = await prisma.review.create({
      data: {
        ...data,
        verifiedPurchase: !!hasPurchased,
      },
    });

    return review;
  },

  async update(
    reviewId: string,
    userId: string,
    data: { rating?: number; title?: string; body?: string }
  ) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) throw new NotFoundError("Review");
    if (review.userId !== userId) {
      throw new ValidationError("You can only edit your own reviews");
    }

    return prisma.review.update({
      where: { id: reviewId },
      data: { ...data, status: "PENDING" }, // Re-queue for moderation
    });
  },

  async delete(reviewId: string, userId: string, isAdmin: boolean = false) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) throw new NotFoundError("Review");
    if (!isAdmin && review.userId !== userId) {
      throw new ValidationError("You can only delete your own reviews");
    }

    await prisma.review.delete({ where: { id: reviewId } });
    await this.updateProductRating(review.productId);
  },

  async moderate(reviewId: string, status: ReviewStatus) {
    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { status },
    });

    if (status === "APPROVED") {
      await this.updateProductRating(review.productId);
    }

    return review;
  },

  async listPending(page: number, limit: number) {
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { status: "PENDING" },
        include: {
          user: { select: { name: true, email: true } },
          product: { select: { name: true, slug: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({ where: { status: "PENDING" } }),
    ]);

    return { reviews, total };
  },

  async updateProductRating(productId: string) {
    const result = await prisma.review.aggregate({
      where: { productId, status: "APPROVED" },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        averageRating: result._avg.rating || 0,
        reviewCount: result._count.rating,
      },
    });
  },
};
