import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminStorefrontBar from "@/components/AdminStorefrontBar";
import { productService } from "@/services/product.service";
import { NotFoundError } from "@/lib/errors";

export const dynamic = "force-dynamic";

function toUsd(value: unknown): string {
  const n =
    typeof value === "object" && value !== null && "toNumber" in value
      ? (value as { toNumber: () => number }).toNumber()
      : Number(value);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number.isFinite(n) ? n : 0
  );
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { slug } = await params;
  const { from } = await searchParams;
  const adminBack = from === "admin";

  let product: Awaited<ReturnType<typeof productService.getByIdOrSlug>>;
  try {
    product = await productService.getByIdOrSlug(slug);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }

  const images = [...product.images].sort((a, b) => a.position - b.position);
  const main = images[0];
  const thumbs = images.slice(1, 3);
  const primaryVariant = product.variants[0];
  const displayPrice = primaryVariant?.price ?? product.basePrice;
  const compareAt = primaryVariant?.compareAtPrice ?? product.compareAtPrice;
  const categoryName = product.category?.name ?? "Skincare";

  return (
    <>
      <Navbar />
      {adminBack && <AdminStorefrontBar backHref="/admin/products" backLabel="Back to products" />}
      <main className={`pb-20 ${adminBack ? "pt-40" : "pt-24"}`}>
        <div className="max-w-7xl mx-auto px-8 mb-8">
          <nav className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
            <Link href="/skincare" className="hover:text-primary transition-colors">
              Shop
            </Link>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <Link href="/skincare" className="hover:text-primary transition-colors">
              {categoryName}
            </Link>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-primary line-clamp-1">{product.name}</span>
          </nav>
        </div>

        <section className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-7 flex flex-col space-y-4">
            <div className="bg-surface-container-low aspect-[4/5] overflow-hidden relative">
              {main ? (
                <Image
                  src={main.url}
                  alt={main.altText || product.name}
                  fill
                  unoptimized
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high via-surface-container to-primary-container/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-on-surface-variant/40">image</span>
                </div>
              )}
            </div>
            {thumbs.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {thumbs.map((img) => (
                  <div key={img.id} className="bg-surface-container-low aspect-square relative overflow-hidden">
                    <Image
                      src={img.url}
                      alt={img.altText || product.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-5 flex flex-col justify-start pt-4">
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] mb-4">
              {product.brand?.name ?? "Atlas Beauty"}
            </span>
            <h1 className="font-headline text-5xl md:text-6xl text-on-surface leading-tight tracking-tighter mb-4">
              {product.name}
            </h1>
            {product.shortDescription && (
              <p className="font-headline italic text-on-surface-variant text-xl mb-8">{product.shortDescription}</p>
            )}
            <div className="flex items-baseline space-x-4 mb-10">
              <span className="text-2xl font-body font-light text-on-surface">{toUsd(displayPrice)}</span>
              {compareAt != null && Number(compareAt) > Number(displayPrice) && (
                <span className="text-sm text-on-surface-variant line-through">{toUsd(compareAt)}</span>
              )}
            </div>

            <div className="space-y-8 mb-12">
              <div className="border-b-2 border-primary/10 pb-4">
                <h3 className="font-bold text-xs uppercase tracking-widest mb-2">About</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>

              {product.variants.length > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-2">
                      Options
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v, i) => (
                        <span
                          key={v.id}
                          className={`px-4 py-2 border-2 text-xs font-bold ${
                            i === 0 ? "border-primary text-primary" : "border-outline-variant text-on-surface-variant"
                          }`}
                        >
                          {v.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-4">
              <button
                type="button"
                className="w-full bg-primary text-on-primary py-5 rounded-lg font-bold text-sm tracking-widest uppercase hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/10"
              >
                Add to Collection
              </button>
              <button
                type="button"
                className="w-full bg-primary-container text-on-primary-container py-5 rounded-lg font-bold text-sm tracking-widest uppercase hover:brightness-105 transition-all"
              >
                Buy Now
              </button>
            </div>

            {product.ingredients && (
              <div className="mt-12 border-t border-outline-variant/30 pt-8">
                <h3 className="font-bold text-xs uppercase tracking-widest mb-2">Ingredients</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{product.ingredients}</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
