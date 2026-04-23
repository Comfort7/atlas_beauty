import { prisma } from "@/lib/prisma";
import { PromoBannerPlacement } from "@prisma/client";
import { cache } from "react";

type HomepageLayoutRow = {
  id: string;
  featured_product_ids: string[] | null;
  category_route_map: Record<string, string> | null;
  banner_zone_map: Record<string, string> | null;
};

export const ADMIN_CATEGORY_ROUTE_OPTIONS = [
  "/bodycare",
  "/fragrance",
  "/skincare",
  "/shop",
] as const;

export type CategoryRouteOption = (typeof ADMIN_CATEGORY_ROUTE_OPTIONS)[number];

export const ADMIN_BANNER_ZONE_IDS = [
  "home.top",
  "home.after_products",
  "cart.top",
  "cart.coupon",
  "cart.bottom",
  "category.top",
  "category.bottom",
  "product.top",
  "product.bottom",
] as const;

export type BannerZoneId = (typeof ADMIN_BANNER_ZONE_IDS)[number];

export const ADMIN_BANNER_ZONE_SOURCE_OPTIONS = [
  "HOME",
  "CART",
  "COUPON",
  "NONE",
] as const;

export type BannerZoneSourceOption = (typeof ADMIN_BANNER_ZONE_SOURCE_OPTIONS)[number];

export const ADMIN_BANNER_ZONE_LABELS: Record<BannerZoneId, string> = {
  "home.top": "Homepage - Top (below hero/nav)",
  "home.after_products": "Homepage - After products grid",
  "cart.top": "Cart - Top",
  "cart.coupon": "Cart - Coupon / promo area",
  "cart.bottom": "Cart - Bottom",
  "category.top": "Category pages - Top",
  "category.bottom": "Category pages - Bottom",
  "product.top": "Product page - Top",
  "product.bottom": "Product page - Bottom",
};

const DEFAULT_BANNER_ZONE_MAP: Record<BannerZoneId, BannerZoneSourceOption> = {
  "home.top": "NONE",
  "home.after_products": "NONE",
  "cart.top": "CART",
  "cart.coupon": "COUPON",
  "cart.bottom": "NONE",
  "category.top": "NONE",
  "category.bottom": "NONE",
  "product.top": "NONE",
  "product.bottom": "NONE",
};

type HomepageLayoutConfig = {
  featuredProductIds: string[];
  categoryRouteMap: Record<string, CategoryRouteOption>;
  bannerZoneMap: Record<BannerZoneId, BannerZoneSourceOption>;
};

function sanitizeCategoryRouteMap(
  input: Record<string, string> | null | undefined
): Record<string, CategoryRouteOption> {
  const clean: Record<string, CategoryRouteOption> = {};
  if (!input) return clean;
  for (const [slug, route] of Object.entries(input)) {
    const normalizedSlug = slug.trim();
    if (!normalizedSlug) continue;
    if ((ADMIN_CATEGORY_ROUTE_OPTIONS as readonly string[]).includes(route)) {
      clean[normalizedSlug] = route as CategoryRouteOption;
    }
  }
  return clean;
}

function sanitizeBannerZoneMap(
  input: Record<string, string> | null | undefined
): Record<BannerZoneId, BannerZoneSourceOption> {
  const clean: Record<BannerZoneId, BannerZoneSourceOption> = { ...DEFAULT_BANNER_ZONE_MAP };
  if (!input) return clean;
  for (const [zoneId, source] of Object.entries(input)) {
    if (!(ADMIN_BANNER_ZONE_IDS as readonly string[]).includes(zoneId)) continue;
    if (!(ADMIN_BANNER_ZONE_SOURCE_OPTIONS as readonly string[]).includes(source)) continue;
    clean[zoneId as BannerZoneId] = source as BannerZoneSourceOption;
  }
  return clean;
}

async function ensureHomepageLayoutTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS homepage_layout (
      id TEXT PRIMARY KEY,
      featured_product_ids TEXT[] NOT NULL DEFAULT '{}',
      category_route_map JSONB NOT NULL DEFAULT '{}',
      banner_zone_map JSONB NOT NULL DEFAULT '{}',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
  await prisma.$executeRawUnsafe(`
    ALTER TABLE homepage_layout
    ADD COLUMN IF NOT EXISTS category_route_map JSONB NOT NULL DEFAULT '{}'
  `);
  await prisma.$executeRawUnsafe(`
    ALTER TABLE homepage_layout
    ADD COLUMN IF NOT EXISTS banner_zone_map JSONB NOT NULL DEFAULT '{}'
  `);
}

const getHomepageLayoutConfigCached = cache(async (): Promise<HomepageLayoutConfig> => {
  await ensureHomepageLayoutTable();
  const rows = await prisma.$queryRawUnsafe<HomepageLayoutRow[]>(
    `SELECT id, featured_product_ids, category_route_map, banner_zone_map FROM homepage_layout WHERE id = 'main' LIMIT 1`
  );
  return {
    featuredProductIds: rows[0]?.featured_product_ids ?? [],
    categoryRouteMap: sanitizeCategoryRouteMap(rows[0]?.category_route_map),
    bannerZoneMap: sanitizeBannerZoneMap(rows[0]?.banner_zone_map),
  };
});

export async function getHomepageLayoutConfig(): Promise<HomepageLayoutConfig> {
  return getHomepageLayoutConfigCached();
}

export async function saveHomepageLayoutConfig(
  featuredProductIds: string[],
  categoryRouteMap: Record<string, CategoryRouteOption>,
  bannerZoneMap: Record<BannerZoneId, BannerZoneSourceOption>
) {
  await ensureHomepageLayoutTable();
  await prisma.$executeRawUnsafe(
    `
      INSERT INTO homepage_layout (id, featured_product_ids, category_route_map, banner_zone_map, created_at, updated_at)
      VALUES ('main', $1::text[], $2::jsonb, $3::jsonb, NOW(), NOW())
      ON CONFLICT (id)
      DO UPDATE SET
        featured_product_ids = EXCLUDED.featured_product_ids,
        category_route_map = EXCLUDED.category_route_map,
        banner_zone_map = EXCLUDED.banner_zone_map,
        updated_at = NOW()
    `,
    featuredProductIds,
    JSON.stringify(sanitizeCategoryRouteMap(categoryRouteMap)),
    JSON.stringify(sanitizeBannerZoneMap(bannerZoneMap))
  );
}

export async function getHomepageFeaturedProducts(limit: number = 8) {
  const { featuredProductIds: selectedIds } = await getHomepageLayoutConfig();

  const selectedProducts =
    selectedIds.length > 0
      ? await prisma.product.findMany({
          where: {
            id: { in: selectedIds },
            isActive: true,
          },
          include: {
            category: { select: { name: true, slug: true } },
            images: { orderBy: { position: "asc" }, take: 1 },
            variants: {
              where: { isActive: true },
              orderBy: { createdAt: "asc" },
              take: 1,
            },
          },
        })
      : [];

  const selectedById = new Map(selectedProducts.map((p) => [p.id, p]));
  const orderedSelected = selectedIds
    .map((id) => selectedById.get(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, limit);

  if (orderedSelected.length >= limit) {
    return orderedSelected;
  }

  const fallback = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { notIn: orderedSelected.map((p) => p.id) },
    },
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { position: "asc" }, take: 1 },
      variants: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: limit - orderedSelected.length,
  });

  return [...orderedSelected, ...fallback];
}

export async function getRouteForCategorySlug(categorySlug?: string) {
  if (!categorySlug) return "/shop";
  const { categoryRouteMap } = await getHomepageLayoutConfig();
  return resolveCategoryRoute(categorySlug, categoryRouteMap);
}

export async function getCategorySlugsForRoute(route: CategoryRouteOption) {
  const { categoryRouteMap } = await getHomepageLayoutConfig();
  return Object.entries(categoryRouteMap)
    .filter(([, mappedRoute]) => mappedRoute === route)
    .map(([slug]) => slug);
}

export async function getBannerPlacementForZone(
  zone: BannerZoneId
): Promise<PromoBannerPlacement | null> {
  const { bannerZoneMap } = await getHomepageLayoutConfig();
  const source = bannerZoneMap[zone] ?? DEFAULT_BANNER_ZONE_MAP[zone];
  if (source === "NONE") return null;
  return source as PromoBannerPlacement;
}

export function resolveCategoryRoute(
  categorySlug: string | undefined,
  categoryRouteMap: Record<string, CategoryRouteOption>
) {
  if (!categorySlug) return "/shop";
  const mapped = categoryRouteMap[categorySlug];
  if (mapped) return mapped;
  if (categorySlug.includes("body")) return "/bodycare";
  if (categorySlug.includes("frag")) return "/fragrance";
  if (categorySlug.includes("skin")) return "/skincare";
  if (categorySlug.includes("lip")) return "/skincare";
  return `/shop?category=${encodeURIComponent(categorySlug)}`;
}
