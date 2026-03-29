import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NotFoundError } from "@/lib/errors";
import { createUniqueSlug } from "@/helpers/slug";
import { invalidateCache } from "@/helpers/cache";
import type { ProductFilters } from "@/types";

const productSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  shortDescription: true,
  basePrice: true,
  compareAtPrice: true,
  isActive: true,
  isFeatured: true,
  tags: true,
  ingredients: true,
  averageRating: true,
  reviewCount: true,
  metaTitle: true,
  metaDescription: true,
  metaKeywords: true,
  createdAt: true,
  updatedAt: true,
  brand: { select: { id: true, name: true, slug: true } },
  category: { select: { id: true, name: true, slug: true } },
  images: { orderBy: { position: "asc" as const } },
  variants: {
    where: { isActive: true },
    include: { inventory: true },
  },
};

export const productService = {
  async list(
    filters: ProductFilters,
    page: number,
    limit: number
  ) {
    const where: Prisma.ProductWhereInput = { isActive: true };

    if (filters.category) {
      where.category = { slug: filters.category };
    }
    if (filters.brand) {
      where.brand = { slug: filters.brand };
    }
    if (filters.minPrice || filters.maxPrice) {
      where.basePrice = {};
      if (filters.minPrice) where.basePrice.gte = filters.minPrice;
      if (filters.maxPrice) where.basePrice.lte = filters.maxPrice;
    }
    if (filters.rating) {
      where.averageRating = { gte: filters.rating };
    }
    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }
    if (filters.tags && filters.tags.length > 0) {
      where.tags = { hasSome: filters.tags };
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    switch (filters.sort) {
      case "price_asc":
        orderBy = { basePrice: "asc" };
        break;
      case "price_desc":
        orderBy = { basePrice: "desc" };
        break;
      case "rating":
        orderBy = { averageRating: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: productSelect,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  },

  async getByIdOrSlug(idOrSlug: string) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      select: {
        ...productSelect,
        reviews: {
          where: { status: "APPROVED" },
          select: {
            id: true,
            rating: true,
            title: true,
            body: true,
            verifiedPurchase: true,
            createdAt: true,
            user: { select: { name: true, image: true } },
          },
          take: 10,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) throw new NotFoundError("Product");
    return product;
  },

  async create(data: {
    name: string;
    description: string;
    shortDescription?: string;
    categoryId: string;
    brandId?: string;
    basePrice: number;
    compareAtPrice?: number;
    tags?: string[];
    ingredients?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    isFeatured?: boolean;
  }) {
    const slug = await createUniqueSlug(data.name, "product");

    const product = await prisma.product.create({
      data: {
        ...data,
        slug,
        basePrice: new Prisma.Decimal(data.basePrice),
        compareAtPrice: data.compareAtPrice
          ? new Prisma.Decimal(data.compareAtPrice)
          : null,
      },
      select: productSelect,
    });

    await invalidateCache("products:*");
    return product;
  },

  async update(
    idOrSlug: string,
    data: Partial<{
      name: string;
      description: string;
      shortDescription: string;
      categoryId: string;
      brandId: string;
      basePrice: number;
      compareAtPrice: number;
      tags: string[];
      ingredients: string;
      isActive: boolean;
      isFeatured: boolean;
      metaTitle: string;
      metaDescription: string;
      metaKeywords: string[];
    }>
  ) {
    const existing = await prisma.product.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    });
    if (!existing) throw new NotFoundError("Product");

    const updateData: Prisma.ProductUpdateInput = { ...data };
    if (data.name && data.name !== existing.name) {
      updateData.slug = await createUniqueSlug(data.name, "product");
    }
    if (data.basePrice !== undefined) {
      updateData.basePrice = new Prisma.Decimal(data.basePrice);
    }
    if (data.compareAtPrice !== undefined) {
      updateData.compareAtPrice = new Prisma.Decimal(data.compareAtPrice);
    }

    const product = await prisma.product.update({
      where: { id: existing.id },
      data: updateData,
      select: productSelect,
    });

    await invalidateCache("products:*");
    return product;
  },

  async delete(idOrSlug: string) {
    const existing = await prisma.product.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    });
    if (!existing) throw new NotFoundError("Product");

    await prisma.product.delete({ where: { id: existing.id } });
    await invalidateCache("products:*");
  },

  async getFeatured(limit: number = 12) {
    return prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      select: productSelect,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  },

  async addImage(
    productId: string,
    data: { url: string; publicId: string; altText?: string; position?: number }
  ) {
    return prisma.productImage.create({
      data: { productId, ...data },
    });
  },

  async removeImage(imageId: string) {
    return prisma.productImage.delete({ where: { id: imageId } });
  },
};
