import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicPromoBannerZone from "@/components/DynamicPromoBannerZone";
import { prisma } from "@/lib/prisma";
import { getCategorySlugsForRoute } from "@/lib/homepage-layout";

export const dynamic = "force-dynamic";

type SortKey = "newest" | "price_asc" | "price_desc";
type FilterKey = "all" | "floral" | "fruity" | "vanilla";

function productPrice(product: {
  variants: Array<{ price: number | string }>;
  basePrice: number | string;
}) {
  return Number(product.variants[0]?.price ?? product.basePrice);
}

function productMatchesFilter(product: { name: string; shortDescription: string | null }, filter: FilterKey) {
  const text = `${product.name} ${product.shortDescription ?? ""}`.toLowerCase();
  if (filter === "floral") return /rose|floral|hibiscus/.test(text);
  if (filter === "fruity") return /berry|watermelon|coco|citrus|fruit/.test(text);
  if (filter === "vanilla") return /vanilla/.test(text);
  return true;
}

function listingHref(base: string, filter: FilterKey, sort: SortKey) {
  const q = new URLSearchParams();
  if (filter !== "all") q.set("filter", filter);
  if (sort !== "newest") q.set("sort", sort);
  const suffix = q.toString();
  return suffix ? `${base}?${suffix}` : base;
}

export default async function FragrancePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const activeFilter: FilterKey =
    params.filter === "floral" || params.filter === "fruity" || params.filter === "vanilla"
      ? params.filter
      : "all";
  const activeSort: SortKey =
    params.sort === "price_asc" || params.sort === "price_desc" ? params.sort : "newest";

  const mappedCategorySlugs = await getCategorySlugsForRoute("/fragrance");

  const fragranceProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      category:
        mappedCategorySlugs.length > 0
          ? { slug: { in: mappedCategorySlugs } }
          : {
              OR: [
                { slug: { contains: "frag" } },
                { name: { contains: "frag", mode: "insensitive" } },
              ],
            },
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

  const filters: { key: FilterKey; label: string; count: number; href: string; active?: boolean }[] = [
    {
      key: "all",
      label: "All fragrance",
      count: fragranceProducts.length,
      active: activeFilter === "all",
      href: listingHref("/fragrance", "all", activeSort),
    },
    {
      key: "floral",
      label: "Floral",
      count: fragranceProducts.filter((p) => /rose|floral|hibiscus/i.test(`${p.name} ${p.shortDescription ?? ""}`)).length,
      active: activeFilter === "floral",
      href: listingHref("/fragrance", "floral", activeSort),
    },
    {
      key: "fruity",
      label: "Fruity",
      count: fragranceProducts.filter((p) => /berry|watermelon|coco|citrus|fruit/i.test(`${p.name} ${p.shortDescription ?? ""}`)).length,
      active: activeFilter === "fruity",
      href: listingHref("/fragrance", "fruity", activeSort),
    },
    {
      key: "vanilla",
      label: "Vanilla",
      count: fragranceProducts.filter((p) => /vanilla/i.test(`${p.name} ${p.shortDescription ?? ""}`)).length,
      active: activeFilter === "vanilla",
      href: listingHref("/fragrance", "vanilla", activeSort),
    },
  ];

  const filteredProducts = fragranceProducts.filter((p) => productMatchesFilter(p, activeFilter));
  const visibleProducts = [...filteredProducts].sort((a, b) => {
    if (activeSort === "price_asc") return productPrice(a) - productPrice(b);
    if (activeSort === "price_desc") return productPrice(b) - productPrice(a);
    return 0;
  });

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-8">
            <DynamicPromoBannerZone zone="category.top" />
          </div>
          <header className="mb-20">
            <span className="font-label text-xs uppercase tracking-[0.2em] text-primary font-bold">
              Curated Collection
            </span>
            <h1 className="font-headline text-5xl md:text-7xl text-on-surface tracking-tighter leading-tight mt-4">
              Fragrance.
            </h1>
            <p className="mt-6 text-on-surface-variant font-body text-lg leading-relaxed max-w-xl">
              Scent-forward picks based on active products in the fragrance category.
            </p>
            <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-widest text-on-surface-variant">
              <span>Showing {visibleProducts.length} products</span>
              <span>·</span>
              <Link
                href={listingHref("/fragrance", activeFilter, "newest")}
                className={`font-bold ${activeSort === "newest" ? "text-primary" : "text-on-surface-variant"}`}
              >
                Newest
              </Link>
              <span>·</span>
              <Link
                href={listingHref("/fragrance", activeFilter, "price_asc")}
                className={`font-bold ${activeSort === "price_asc" ? "text-primary" : "text-on-surface-variant"}`}
              >
                Price Low
              </Link>
              <span>·</span>
              <Link
                href={listingHref("/fragrance", activeFilter, "price_desc")}
                className={`font-bold ${activeSort === "price_desc" ? "text-primary" : "text-on-surface-variant"}`}
              >
                Price High
              </Link>
            </div>
          </header>

          <div className="flex flex-col md:flex-row gap-12">
            <aside className="w-full md:w-64 flex-shrink-0">
              <h3 className="font-headline text-lg mb-5 text-on-surface">Filter</h3>
              <ul className="space-y-4 text-sm">
                {filters.map((filter) => (
                  <li key={filter.key} className="flex justify-between items-center">
                    <Link href={filter.href} className="flex w-full justify-between items-center">
                      <span className={filter.active ? "text-primary font-bold" : "text-on-surface-variant"}>
                        {filter.label}
                      </span>
                      <span className="text-xs text-on-surface-variant opacity-60">{filter.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {visibleProducts.map((product) => (
                <Link href={`/products/${product.slug}`} key={product.id} className="group block">
                  <div className="relative aspect-[3/4] bg-surface-container-low overflow-hidden mb-4 rounded-xl border border-outline-variant/30">
                    <Image
                      src={product.images[0]?.url || "/products/treehut-pink-champagne.jpg"}
                      alt={product.images[0]?.altText || product.name}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
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
          <div className="mt-12">
            <DynamicPromoBannerZone zone="category.bottom" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
