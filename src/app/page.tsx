import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import NewsletterSection from "@/components/NewsletterSection";
import DynamicPromoBannerZone from "@/components/DynamicPromoBannerZone";
import { getHomepageFeaturedProducts } from "@/lib/homepage-layout";
import { resolveProductImageUrl } from "@/lib/product-image";
import { brandJournalEntries, featuredBrands } from "@/lib/brand-content";

export const dynamic = "force-dynamic";

function displayProductPrice(product: {
  variants: Array<{ price: unknown }>;
  basePrice: unknown;
}) {
  const value = product.variants[0]?.price ?? product.basePrice;
  if (value && typeof value === "object" && "toNumber" in value && typeof (value as { toNumber: () => number }).toNumber === "function") {
    return (value as { toNumber: () => number }).toNumber().toFixed(2);
  }
  return Number(value ?? 0).toFixed(2);
}

export default async function Home() {
  const featuredProducts = await getHomepageFeaturedProducts(10);
  const journalHighlights = brandJournalEntries.slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="min-w-0 overflow-x-hidden pt-20 sm:pt-24">
        <section className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-20 md:py-28">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_45%,rgba(227,239,251,0.85)_0%,rgba(246,250,255,1)_72%)]" />
          <div className="mx-auto max-w-3xl px-1 text-center">
            <p className="font-body text-xs uppercase tracking-[0.32em] text-outline">
              Atlas Beauty
            </p>
            <h1 className="mt-4 font-headline text-3xl leading-tight text-on-surface sm:text-4xl sm:mt-5 md:text-6xl lg:text-7xl">
              Curated care for everyday rituals.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-on-surface-variant sm:mt-6 sm:text-base md:text-lg">
              A cleaner and product-first storefront inspired by your reference. This
              landing now highlights real image assets while routing into your existing
              shopping flow.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link
                href="/shop"
                className="rounded-full bg-secondary px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-[0.2em] text-on-secondary transition hover:bg-secondary/90 sm:px-8"
              >
                Shop collection
              </Link>
              <Link
                href="/bodycare"
                className="rounded-full border border-outline-variant/50 px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-[0.2em] text-on-surface transition hover:bg-surface-container-low sm:px-8"
              >
                Body care
              </Link>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 md:px-12 md:mb-10">
          <DynamicPromoBannerZone zone="home.top" />
        </div>

        <section className="bg-surface px-4 py-16 sm:px-6 md:px-12 md:py-24">
          <div className="mx-auto max-w-7xl min-w-0">
            <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between md:mb-14">
              <div className="min-w-0">
                <p className="font-body text-xs uppercase tracking-[0.3em] text-outline">
                  Selected essentials
                </p>
                <h2 className="mt-2 font-headline text-2xl text-on-surface sm:text-3xl md:text-4xl">
                  The Seasonal Edit
                </h2>
              </div>
              <Link
                href="/shop"
                className="shrink-0 self-start border-b border-outline-variant pb-1 font-body text-xs uppercase tracking-[0.22em] text-on-surface-variant transition hover:text-secondary sm:self-auto"
              >
                View all
              </Link>
            </div>

            {/* Mobile: 2 cols; lg+: 5 cols = two rows of five */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-5 lg:gap-3">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group block min-w-0 rounded-xl border border-outline-variant/35 bg-surface-container-lowest p-1.5 shadow-sm transition hover:border-secondary/45 sm:rounded-2xl"
                >
                  <div className="relative mb-2 aspect-[4/5] overflow-hidden rounded-lg border border-outline-variant/45 bg-surface-container-low sm:mb-3 sm:rounded-xl">
                    <Image
                      src={resolveProductImageUrl(product)}
                      alt={product.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 46vw, 18vw"
                    />
                    <div className="absolute inset-0 bg-secondary/10 opacity-0 transition group-hover:opacity-100" />
                  </div>
                  <h3 className="line-clamp-2 px-0.5 font-body text-[11px] font-semibold leading-snug text-on-surface sm:text-xs md:text-sm">
                    {product.name}
                  </h3>
                  <p className="mt-0.5 line-clamp-1 px-0.5 font-body text-[9px] uppercase tracking-[0.12em] text-outline sm:text-[10px] sm:tracking-[0.15em]">
                    {product.category?.name || "General"}
                  </p>
                  <p className="mt-0.5 px-0.5 pb-0.5 font-body text-[10px] text-on-surface-variant sm:text-xs">
                    ${displayProductPrice(product)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 md:px-12 md:mb-10">
          <DynamicPromoBannerZone zone="home.after_products" />
        </div>

        <section className="bg-white py-8 sm:py-10">
          <div className="mx-auto max-w-7xl min-w-0 px-4 sm:px-6 md:px-12">
            <p className="mb-4 font-body text-xs uppercase tracking-[0.28em] text-outline sm:mb-5">
              Featured Brands
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredBrands.map((brand) => (
                <Link
                  key={brand.slug}
                  href={brand.href}
                  className="group min-w-0 overflow-hidden rounded-xl border border-outline-variant/35 bg-surface-container-lowest sm:rounded-2xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 46vw, (max-width: 1024px) 44vw, 22vw"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-headline text-base text-on-surface sm:text-lg md:text-xl">{brand.name}</h3>
                    <p className="mt-1 line-clamp-3 text-xs text-on-surface-variant sm:mt-2 sm:text-sm">{brand.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-12 sm:px-6 md:px-12 md:py-16">
          <div className="mx-auto max-w-7xl min-w-0">
            <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <p className="font-body text-xs uppercase tracking-[0.28em] text-outline">Journal</p>
                <h2 className="mt-2 font-headline text-xl text-on-surface sm:text-2xl md:text-3xl lg:text-4xl">
                  Brand stories and care guides
                </h2>
              </div>
              <Link
                href="/journal"
                className="shrink-0 self-start text-xs uppercase tracking-[0.2em] text-primary border-b border-primary pb-1 sm:self-auto"
              >
                View journal
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
              {journalHighlights.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/journal/${entry.slug}`}
                  className="group min-w-0 overflow-hidden rounded-xl border border-outline-variant/35 bg-surface-container-lowest sm:rounded-2xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={entry.coverImage}
                      alt={entry.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 30vw"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">
                      {entry.brand}
                    </p>
                    <h3 className="mt-1.5 font-headline text-lg leading-snug text-on-surface sm:mt-2 sm:text-xl md:text-2xl">
                      {entry.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-3 text-xs text-on-surface-variant sm:mt-2 sm:text-sm">{entry.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low px-4 py-16 sm:px-6 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-7xl min-w-0 gap-10 md:grid-cols-2 md:gap-12">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.3em] text-outline">
                Explore Atlas
              </p>
              <h2 className="mt-3 font-headline text-2xl text-on-surface sm:text-3xl md:text-4xl lg:text-5xl">
                Shop by ritual, skin need, and mood.
              </h2>
              <p className="mt-6 max-w-xl text-on-surface-variant">
                Every pathway below connects to active sections of your app, so users can
                jump straight from homepage discovery to category browsing.
              </p>
            </div>
            <div className="space-y-4">
              <Link
                href="/skincare"
                className="block rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6 transition hover:border-secondary/40 hover:bg-surface"
              >
                <p className="font-headline text-2xl">Skincare</p>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Serums, moisturizers, masks, and treatment-focused products.
                </p>
              </Link>
              <Link
                href="/bodycare"
                className="block rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6 transition hover:border-secondary/40 hover:bg-surface"
              >
                <p className="font-headline text-2xl">Body Care</p>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Exfoliators, washes, and lotions from your newly added product set.
                </p>
              </Link>
              <Link
                href="/fragrance"
                className="block rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6 transition hover:border-secondary/40 hover:bg-surface"
              >
                <p className="font-headline text-2xl">Fragrance</p>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Signature scents and layered fragrance discovery moments.
                </p>
              </Link>
              <Link
                href="/journal"
                className="block rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6 transition hover:border-secondary/40 hover:bg-surface"
              >
                <p className="font-headline text-2xl">Journal</p>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Educational content, rituals, and seasonal care notes.
                </p>
              </Link>
            </div>
          </div>
        </section>

        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
