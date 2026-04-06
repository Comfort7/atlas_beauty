"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  basePrice: string | number;
  images: { url: string; altText: string | null }[];
  brand: { name: string; slug: string } | null;
};

export default function ShopClient() {
  const searchParams = useSearchParams();
  const brand = searchParams.get("brand") || "";
  const category = searchParams.get("category") || "";

  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Shop");

  const query = useMemo(() => {
    const p = new URLSearchParams();
    p.set("limit", "48");
    if (brand) p.set("brand", brand);
    if (category) p.set("category", category);
    return p.toString();
  }, [brand, category]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/products?${query}`);
        const json = await res.json();
        if (!cancelled && json.success && Array.isArray(json.data)) {
          setProducts(json.data);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query]);

  useEffect(() => {
    if (brand) setTitle(brand.replace(/-/g, " "));
    else if (category) setTitle(category.replace(/-/g, " "));
    else setTitle("Shop");
  }, [brand, category]);

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 max-w-7xl mx-auto px-8">
        <header className="mb-12">
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label mb-2">
            Atlas Beauty
          </p>
          <h1 className="font-headline text-4xl md:text-5xl text-on-surface tracking-tighter capitalize">
            {brand ? `Brand · ${title}` : category ? `Category · ${title}` : "Shop"}
          </h1>
          <p className="mt-4 text-on-surface-variant font-body text-sm max-w-xl">
            Live results from the catalog (API). Category and brand slugs must exist in your database for
            filters to return products.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link href="/skincare" className="text-primary font-bold hover:underline">
              Skincare
            </Link>
            <span className="text-on-surface-variant">·</span>
            <Link href="/bodycare" className="text-primary font-bold hover:underline">
              Body care
            </Link>
            <span className="text-on-surface-variant">·</span>
            <Link href="/fragrance" className="text-primary font-bold hover:underline">
              Fragrance
            </Link>
          </div>
        </header>

        {loading ? (
          <p className="text-on-surface-variant text-sm">Loading…</p>
        ) : products.length === 0 ? (
          <div className="bg-surface-container-low rounded-xl p-12 text-center">
            <p className="text-on-surface-variant">No products match this filter yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {products.map((p) => {
              const img = p.images[0];
              const price =
                typeof p.basePrice === "number"
                  ? p.basePrice
                  : parseFloat(String(p.basePrice));
              return (
                <Link href={`/products/${p.slug}`} key={p.id} className="group block">
                  <div className="relative aspect-[3/4] bg-surface-container-low overflow-hidden mb-3">
                    {img ? (
                      <Image
                        src={img.url}
                        alt={img.altText || p.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant text-sm">
                        No image
                      </div>
                    )}
                  </div>
                  {p.brand && (
                    <p className="text-[10px] uppercase tracking-widest text-primary mb-1">{p.brand.name}</p>
                  )}
                  <h2 className="font-headline text-lg text-on-surface mb-1">{p.name}</h2>
                  {p.shortDescription && (
                    <p className="text-on-surface-variant text-sm line-clamp-2 mb-2">{p.shortDescription}</p>
                  )}
                  <span className="text-primary font-bold">${price.toFixed(2)}</span>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
