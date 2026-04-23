import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopByBrand from "@/components/ShopByBrand";
import DynamicPromoBannerZone from "@/components/DynamicPromoBannerZone";
import { prisma } from "@/lib/prisma";
import { getCategorySlugsForRoute } from "@/lib/homepage-layout";

export const dynamic = "force-dynamic";

const concerns = ["Lip Care", "Tone Care", "Hydration", "Repair", "Daily Use"];

type SortKey = "newest" | "price_asc" | "price_desc";
type FilterKey = "all" | "treatments" | "lip-care" | "moisturizers";

function productPrice(product: {
  variants: Array<{ price: number | string }>;
  basePrice: number | string;
}) {
  return Number(product.variants[0]?.price ?? product.basePrice);
}

function productMatchesFilter(
  product: { name: string; shortDescription: string | null },
  filter: FilterKey
) {
  const text = `${product.name} ${product.shortDescription ?? ""}`.toLowerCase();
  if (filter === "treatments") return /correct|treat|repair|serum/.test(text);
  if (filter === "lip-care") return /lip|balm/.test(text);
  if (filter === "moisturizers") return /cream|moistur|lotion/.test(text);
  return true;
}

function listingHref(base: string, filter: FilterKey, sort: SortKey) {
  const q = new URLSearchParams();
  if (filter !== "all") q.set("filter", filter);
  if (sort !== "newest") q.set("sort", sort);
  const suffix = q.toString();
  return suffix ? `${base}?${suffix}` : base;
}

export default async function SkincareePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const activeFilter: FilterKey =
    params.filter === "treatments" ||
    params.filter === "lip-care" ||
    params.filter === "moisturizers"
      ? params.filter
      : "all";
  const activeSort: SortKey =
    params.sort === "price_asc" || params.sort === "price_desc" ? params.sort : "newest";

  const mappedCategorySlugs = await getCategorySlugsForRoute("/skincare");

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(mappedCategorySlugs.length > 0
        ? { category: { slug: { in: mappedCategorySlugs } } }
        : {
            OR: [
              { category: { slug: { contains: "skin" } } },
              { category: { name: { contains: "skin", mode: "insensitive" } } },
              { category: { slug: { contains: "lip" } } },
              { category: { name: { contains: "lip", mode: "insensitive" } } },
            ],
          }),
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      variants: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
        take: 1,
      },
      category: { select: { name: true } },
    },
  });

  const categories: {
    key: FilterKey;
    label: string;
    count: number;
    href?: string;
    active?: boolean;
  }[] = [
    {
      key: "all",
      label: "All Products",
      count: products.length,
      active: activeFilter === "all",
      href: listingHref("/skincare", "all", activeSort),
    },
    {
      key: "treatments",
      label: "Treatments",
      count: products.filter((p) => /correct|treat|repair|serum/i.test(p.name)).length,
      active: activeFilter === "treatments",
      href: listingHref("/skincare", "treatments", activeSort),
    },
    {
      key: "lip-care",
      label: "Lip Care",
      count: products.filter((p) => /lip|balm/i.test(p.name)).length,
      active: activeFilter === "lip-care",
      href: listingHref("/skincare", "lip-care", activeSort),
    },
    {
      key: "moisturizers",
      label: "Moisturizers",
      count: products.filter((p) => /cream|moistur|lotion/i.test(p.name)).length,
      active: activeFilter === "moisturizers",
      href: listingHref("/skincare", "moisturizers", activeSort),
    },
  ];

  const filteredProducts = products.filter((p) => productMatchesFilter(p, activeFilter));
  const visibleProducts = [...filteredProducts].sort((a, b) => {
    if (activeSort === "price_asc") return productPrice(a) - productPrice(b);
    if (activeSort === "price_desc") return productPrice(b) - productPrice(a);
    return 0;
  });

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 max-w-7xl mx-auto px-8">
        <div className="mb-8">
          <DynamicPromoBannerZone zone="category.top" />
        </div>
        {/* Hero Header */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="font-headline text-4xl md:text-5xl text-on-surface tracking-tight leading-tight">
                Skin Care
              </h1>
              <p className="mt-4 text-on-surface-variant font-body text-base leading-relaxed">
                Simple, effective essentials curated for daily skin health.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-label uppercase tracking-widest text-on-surface-variant">
              <span>Showing {visibleProducts.length} products</span>
              <div className="h-px w-12 bg-outline-variant" />
              <div className="flex items-center gap-2">
                <Link
                  href={listingHref("/skincare", activeFilter, "newest")}
                  className={`font-bold ${activeSort === "newest" ? "text-primary" : "text-on-surface-variant"}`}
                >
                  Newest
                </Link>
                <span>·</span>
                <Link
                  href={listingHref("/skincare", activeFilter, "price_asc")}
                  className={`font-bold ${activeSort === "price_asc" ? "text-primary" : "text-on-surface-variant"}`}
                >
                  Price Low
                </Link>
                <span>·</span>
                <Link
                  href={listingHref("/skincare", activeFilter, "price_desc")}
                  className={`font-bold ${activeSort === "price_desc" ? "text-primary" : "text-on-surface-variant"}`}
                >
                  Price High
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0 space-y-12">
            {/* Category */}
            <div>
              <h3 className="font-headline text-lg mb-6 text-on-surface">Category</h3>
              <ul className="space-y-4 text-sm">
                {categories.map((cat) => {
                  const inner = (
                    <>
                      <span className={cat.active ? "text-primary font-bold" : "text-on-surface-variant"}>
                        {cat.label}
                      </span>
                      <span className="text-xs text-on-surface-variant opacity-50">{cat.count}</span>
                    </>
                  );
                  return (
                    <li key={cat.label} className="flex justify-between items-center hover:text-primary transition-colors">
                      {cat.href ? (
                        <Link href={cat.href} className="flex w-full justify-between items-center">
                          {inner}
                        </Link>
                      ) : (
                        <div className="flex w-full justify-between items-center cursor-pointer">{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <ShopByBrand />

            {/* Skin Concern */}
            <div>
              <h3 className="font-headline text-lg mb-6 text-on-surface">Skin Concern</h3>
              <div className="flex flex-wrap gap-2">
                {concerns.map((concern, i) => (
                  <span
                    key={concern}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-colors ${
                      i === 0
                        ? "bg-primary-container text-on-primary-container"
                        : "bg-secondary-container text-on-secondary-container hover:bg-primary-container hover:text-on-primary-container"
                    }`}
                  >
                    {concern}
                  </span>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-headline text-lg mb-6 text-on-surface">Price Range</h3>
              <div className="px-2">
                <div className="h-1 bg-surface-container-high relative rounded-full mb-6">
                  <div className="absolute left-0 right-1/4 h-full bg-primary rounded-full" />
                  <div className="absolute left-0 -top-1 w-3 h-3 bg-primary rounded-full shadow-sm cursor-pointer" />
                  <div className="absolute right-1/4 -top-1 w-3 h-3 bg-primary rounded-full shadow-sm cursor-pointer" />
                </div>
                <div className="flex justify-between text-xs font-medium text-on-surface-variant">
                  <span>$20</span>
                  <span>$250+</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {visibleProducts.map((product) => (
                <Link href={`/products/${product.slug}`} key={product.id} className="group block">
                  <div className="relative aspect-[3/4] bg-surface-container-low overflow-hidden mb-4">
                    <Image
                      src={product.images[0]?.url || "/products/burts-bees-lip-balm.jpg"}
                      alt={product.images[0]?.altText || product.name}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {product.isFeatured && (
                      <div className="absolute top-4 left-4 px-3 py-1 text-[10px] font-bold tracking-widest uppercase bg-primary text-on-primary">
                        Featured
                      </div>
                    )}
                    <span className="absolute bottom-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <span className="material-symbols-outlined text-primary text-sm">add_shopping_cart</span>
                    </span>
                  </div>
                  <h4 className="font-headline text-xl text-on-surface mb-1">{product.name}</h4>
                  <p className="text-on-surface-variant text-sm mb-3">
                    {product.shortDescription || product.category.name}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-bold">
                      ${Number(product.variants[0]?.price ?? product.basePrice).toFixed(2)}
                    </span>
                    <span className="h-px w-4 bg-outline-variant" />
                    <span className="text-[10px] uppercase tracking-tighter text-on-surface-variant font-bold">
                      {product.variants[0]?.name || "Standard"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </div>
        <div className="mt-12">
          <DynamicPromoBannerZone zone="category.bottom" />
        </div>
      </main>
      <Footer />
    </>
  );
}
