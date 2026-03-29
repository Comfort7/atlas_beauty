import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getFromCache, setInCache } from "@/helpers/cache";
import { CACHE_TTL } from "@/lib/constants";

export const searchService = {
  async search(
    query: string,
    filters: {
      category?: string;
      brand?: string;
      minPrice?: number;
      maxPrice?: number;
      rating?: number;
      sort?: string;
    },
    page: number,
    limit: number
  ) {
    const cacheKey = `search:${JSON.stringify({ query, filters, page, limit })}`;
    const cached = await getFromCache<{ products: unknown[]; total: number }>(cacheKey);
    if (cached) return cached;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    // Full-text search
    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { hasSome: [query.toLowerCase()] } },
      ];
    }

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
        orderBy = { createdAt: "desc" };
        break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          shortDescription: true,
          basePrice: true,
          compareAtPrice: true,
          averageRating: true,
          reviewCount: true,
          images: { take: 1, orderBy: { position: "asc" } },
          brand: { select: { name: true, slug: true } },
          category: { select: { name: true, slug: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    const result = { products, total };
    await setInCache(cacheKey, result, CACHE_TTL.SEARCH);

    return result;
  },
};
