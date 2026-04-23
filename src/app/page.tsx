import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import DynamicPromoBannerZone from "@/components/DynamicPromoBannerZone";
import { getHomepageFeaturedProducts } from "@/lib/homepage-layout";
import { resolveProductImageUrl } from "@/lib/product-image";
import { brandJournalEntries, featuredBrands } from "@/lib/brand-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featuredProducts = await getHomepageFeaturedProducts(8);
  const journalHighlights = brandJournalEntries.slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="pt-24">
        <section className="relative overflow-hidden px-6 py-20 md:py-28">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_45%,rgba(227,239,251,0.85)_0%,rgba(246,250,255,1)_72%)]" />
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-body text-xs uppercase tracking-[0.32em] text-outline">
              Atlas Beauty
            </p>
            <h1 className="mt-5 font-headline text-5xl leading-tight text-on-surface md:text-7xl">
              Curated care for everyday rituals.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-on-surface-variant md:text-lg">
              A cleaner and product-first storefront inspired by your reference. This
              landing now highlights real image assets while routing into your existing
              shopping flow.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/shop"
                className="rounded-full bg-secondary px-8 py-3 font-body text-xs font-semibold uppercase tracking-[0.2em] text-on-secondary transition hover:bg-secondary/90"
              >
                Shop collection
              </Link>
              <Link
                href="/bodycare"
                className="rounded-full border border-outline-variant/50 px-8 py-3 font-body text-xs font-semibold uppercase tracking-[0.2em] text-on-surface transition hover:bg-surface-container-low"
              >
                Body care
              </Link>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 md:px-12 mb-10">
          <DynamicPromoBannerZone zone="home.top" />
        </div>

        <section className="bg-surface px-6 py-24 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 flex items-end justify-between gap-6">
              <div>
                <p className="font-body text-xs uppercase tracking-[0.3em] text-outline">
                  Selected essentials
                </p>
                <h2 className="mt-2 font-headline text-4xl text-on-surface">
                  The Seasonal Edit
                </h2>
              </div>
              <Link
                href="/shop"
                className="border-b border-outline-variant pb-1 font-body text-xs uppercase tracking-[0.22em] text-on-surface-variant transition hover:text-secondary"
              >
                View all
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group block rounded-2xl border border-outline-variant/35 bg-surface-container-lowest p-2 shadow-sm transition hover:border-secondary/45"
                >
                  <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-xl border border-outline-variant/45 bg-surface-container-low">
                    <Image
                      src={resolveProductImageUrl(product)}
                      alt={product.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 45vw, (max-width: 1200px) 25vw, 22vw"
                    />
                    <div className="absolute inset-0 bg-secondary/10 opacity-0 transition group-hover:opacity-100" />
                  </div>
                  <h3 className="px-1 font-body text-sm font-semibold text-on-surface">
                    {product.name}
                  </h3>
                  <p className="mt-1 px-1 font-body text-[11px] uppercase tracking-[0.15em] text-outline">
                    {product.category?.name || "General"}
                  </p>
                  <p className="mt-1 px-1 pb-2 font-body text-xs text-on-surface-variant">
                    ${Number(product.variants[0]?.price ?? product.basePrice).toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 md:px-12 mb-10">
          <DynamicPromoBannerZone zone="home.after_products" />
        </div>

        <section className="bg-white py-10">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <p className="mb-5 font-body text-xs uppercase tracking-[0.28em] text-outline">
              Featured Brands
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredBrands.map((brand) => (
                <Link
                  key={brand.slug}
                  href={brand.href}
                  className="group overflow-hidden rounded-2xl border border-outline-variant/35 bg-surface-container-lowest"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 44vw, 22vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-headline text-xl text-on-surface">{brand.name}</h3>
                    <p className="mt-2 text-sm text-on-surface-variant">{brand.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-16 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="font-body text-xs uppercase tracking-[0.28em] text-outline">Journal</p>
                <h2 className="mt-2 font-headline text-3xl text-on-surface md:text-4xl">
                  Brand stories and care guides
                </h2>
              </div>
              <Link href="/journal" className="text-xs uppercase tracking-[0.2em] text-primary border-b border-primary pb-1">
                View journal
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {journalHighlights.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/journal/${entry.slug}`}
                  className="group overflow-hidden rounded-2xl border border-outline-variant/35 bg-surface-container-lowest"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={entry.coverImage}
                      alt={entry.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 90vw, 30vw"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">
                      {entry.brand}
                    </p>
                    <h3 className="mt-2 font-headline text-2xl text-on-surface">{entry.title}</h3>
                    <p className="mt-2 text-sm text-on-surface-variant">{entry.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low px-6 py-24 md:px-12">
          <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.3em] text-outline">
                Explore Atlas
              </p>
              <h2 className="mt-3 font-headline text-4xl text-on-surface md:text-5xl">
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

        <section className="bg-white px-6 py-24 md:px-12">
          <div className="mx-auto max-w-5xl text-center">
            <p className="font-body text-xs uppercase tracking-[0.32em] text-outline">
              Join the atelier
            </p>
            <h2 className="mt-4 font-headline text-4xl text-on-surface md:text-5xl">
              Receive launches and ritual updates.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-on-surface-variant">
              We kept the homepage CTA focused and direct, while preserving your existing
              cart and catalog navigation.
            </p>
            <div className="mt-9">
              <Link
                href="/shop"
                className="inline-flex rounded-full bg-secondary px-10 py-4 font-body text-xs font-semibold uppercase tracking-[0.2em] text-on-secondary transition hover:bg-secondary/90"
              >
                Start shopping
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
