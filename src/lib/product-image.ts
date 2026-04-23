type ProductImageInput = {
  images?: Array<{ url?: string | null }>;
  name?: string | null;
  slug?: string | null;
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

const fallbackByKeyword: Array<{ keywords: string[]; image: string }> = [
  { keywords: ["aquaphor"], image: "/products/aquaphor-lip-repair.jpg" },
  { keywords: ["burts", "bee"], image: "/products/burts-bees-lip-balm.jpg" },
  { keywords: ["carmex", "spf"], image: "/products/carmex-spf-15-lip-balm.jpg" },
  { keywords: ["carmex"], image: "/products/carmex-lip-balm.jpg" },
  { keywords: ["dr teal", "dr. teal"], image: "/products/dr-teal-lavender-body-wash.jpg" },
  { keywords: ["eos", "vanilla"], image: "/products/eos-vanilla-cashmere.jpg" },
  { keywords: ["hempz"], image: "/products/hempz-original.jpg" },
  { keywords: ["ogx"], image: "/products/ogx-coconut-coffee-scrub.jpg" },
  { keywords: ["olay"], image: "/products/olay-dark-spot-correcting.jpg" },
  { keywords: ["palmers"], image: "/products/palmers-vanilla-cream.jpg" },
  { keywords: ["tree hut", "treehut"], image: "/products/treehut-pink-champagne.jpg" },
  { keywords: ["dove"], image: "/products/dove-vanilla-sugar.jpg" },
];

export function resolveProductImageUrl(product: ProductImageInput) {
  const first = product.images?.[0]?.url?.trim();
  if (first) return first;

  const text = `${product.name ?? ""} ${product.slug ?? ""}`.toLowerCase();
  const keywordMatch = fallbackByKeyword.find((entry) =>
    entry.keywords.some((keyword) => text.includes(keyword))
  );
  if (keywordMatch) return keywordMatch.image;

  const slug = product.category?.slug?.toLowerCase() ?? "";
  if (slug.includes("skin") || slug.includes("lip")) return fallbackByCategory.skincare;
  if (slug.includes("body")) return fallbackByCategory.bodycare;
  if (slug.includes("frag")) return fallbackByCategory.fragrance;
  if (slug.includes("make")) return fallbackByCategory.makeup;
  if (slug.includes("hair")) return fallbackByCategory.haircare;
  return fallbackByCategory[slug] || defaultFallback;
}
