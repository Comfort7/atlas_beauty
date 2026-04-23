import { z } from "zod";
import { withAdmin } from "@/helpers/auth-guard";
import { prisma } from "@/lib/prisma";
import { errorResponse, handleError, successResponse } from "@/helpers/api-response";
import {
  ADMIN_BANNER_ZONE_IDS,
  ADMIN_BANNER_ZONE_LABELS,
  ADMIN_BANNER_ZONE_SOURCE_OPTIONS,
  ADMIN_CATEGORY_ROUTE_OPTIONS,
  getHomepageLayoutConfig,
  saveHomepageLayoutConfig,
} from "@/lib/homepage-layout";

const updateSchema = z.object({
  featuredProductIds: z.array(z.string().min(1)).max(8),
  categoryRouteMap: z.record(z.string(), z.enum(ADMIN_CATEGORY_ROUTE_OPTIONS)).default({}),
  bannerZoneMap: z.record(z.string(), z.enum(ADMIN_BANNER_ZONE_SOURCE_OPTIONS)).default({}),
});

export const GET = withAdmin(async (_request, _context) => {
  try {
    const [layout, products, categories] = await Promise.all([
      getHomepageLayoutConfig(),
      prisma.product.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { name: true, slug: true } },
          images: { orderBy: { position: "asc" }, take: 1 },
          variants: {
            where: { isActive: true },
            orderBy: { createdAt: "asc" },
            take: 1,
          },
        },
      }),
      prisma.category.findMany({
        where: { products: { some: { isActive: true } } },
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true },
      }),
    ]);

    return successResponse({
      featuredProductIds: layout.featuredProductIds,
      categoryRouteMap: layout.categoryRouteMap,
      bannerZoneMap: layout.bannerZoneMap,
      products,
      categories,
      routeOptions: ADMIN_CATEGORY_ROUTE_OPTIONS,
      bannerZoneSourceOptions: ADMIN_BANNER_ZONE_SOURCE_OPTIONS,
      bannerZones: ADMIN_BANNER_ZONE_IDS.map((id) => ({
        id,
        label: ADMIN_BANNER_ZONE_LABELS[id],
      })),
    });
  } catch (error) {
    return handleError(error);
  }
});

export const PUT = withAdmin(async (request, _context) => {
  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(
        parsed.error.issues.map((i) => i.message).join(", "),
        400,
        "VALIDATION_ERROR"
      );
    }

    const ids = parsed.data.featuredProductIds;
    const categoryRouteMap = parsed.data.categoryRouteMap;
    const bannerZoneMap = parsed.data.bannerZoneMap;
    const uniqueIds = [...new Set(ids)];
    if (uniqueIds.length !== ids.length) {
      return errorResponse("Duplicate products are not allowed", 400, "VALIDATION_ERROR");
    }

    const count = await prisma.product.count({
      where: { id: { in: uniqueIds }, isActive: true },
    });
    if (count !== uniqueIds.length) {
      return errorResponse("One or more selected products are invalid or inactive", 400, "VALIDATION_ERROR");
    }

    await saveHomepageLayoutConfig(uniqueIds, categoryRouteMap, bannerZoneMap);

    return successResponse({
      featuredProductIds: uniqueIds,
      categoryRouteMap,
      bannerZoneMap,
    });
  } catch (error) {
    return handleError(error);
  }
});
