type ProductImageInput = {
  images?: Array<{ url?: string | null }>;
  category?: { slug?: string | null } | null;
};

const fallbackByCategory: Record<string, string> = {
  skincare: "/products/burts-bees-lip-balm.jpg",
  bodycare: "/products/dove-vanilla-sugar.jpg",
  fragrance: "/products/treehut-pink-champagne.jpg",
  makeup: "/products/carmex-spf-15-lip-balm.jpg",
  haircare: "/products/hempz-original.jpg",
};

const defaultFallback = "/products/dove-vanilla-sugar.jpg";

export function resolveProductImageUrl(product: ProductImageInput) {
  const first = product.images?.[0]?.url?.trim();
  if (first) return first;

  const slug = product.category?.slug?.toLowerCase() ?? "";
  if (slug.includes("skin") || slug.includes("lip")) return fallbackByCategory.skincare;
  if (slug.includes("body")) return fallbackByCategory.bodycare;
  if (slug.includes("frag")) return fallbackByCategory.fragrance;
  if (slug.includes("make")) return fallbackByCategory.makeup;
  if (slug.includes("hair")) return fallbackByCategory.haircare;
  return fallbackByCategory[slug] || defaultFallback;
}
