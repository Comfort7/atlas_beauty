"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductImageReorder from "../../ProductImageReorder";

export type EditProductInitial = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  basePrice: number;
  compareAtPrice: number | null;
  categoryId: string;
  ingredients: string | null;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  variantName: string;
  variantSku: string;
  variantPrice: number;
  initialStock: number;
  mainImageUrl: string;
  mainImageAlt: string;
  images: { id: string; position: number; url: string }[];
};

export default function ProductEditForm({ initial }: { initial: EditProductInitial }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const get = (n: string) => (form.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement).value;

    const payload = {
      name: get("name"),
      slug: get("slug"),
      description: get("description"),
      shortDescription: get("shortDescription") || null,
      basePrice: get("basePrice"),
      compareAtPrice: get("compareAtPrice") || null,
      categoryId: get("categoryId"),
      ingredients: get("ingredients") || null,
      isFeatured: (form.elements.namedItem("isFeatured") as HTMLInputElement).checked,
      isActive: (form.elements.namedItem("isActive") as HTMLInputElement).checked,
      tags: get("tags")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      variantName: get("variantName"),
      variantSku: get("variantSku"),
      variantPrice: get("variantPrice"),
      initialStock: parseInt(get("initialStock") || "0", 10),
      imageUrl: get("imageUrl") || null,
      imageAlt: get("imageAlt") || null,
    };

    try {
      const res = await fetch(`/api/v1/admin/products/${initial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error?.message || "Failed to update product");

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-primary block mb-4">check_circle</span>
          <h2 className="font-headline text-2xl text-on-surface mb-2">Product updated</h2>
          <p className="text-on-surface-variant text-sm">Redirecting…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="bg-surface border-b border-outline-variant/20 px-8 py-4 flex items-center gap-4 sticky top-0 z-20">
        <Link href="/admin/products" className="text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline text-2xl text-on-surface">Edit Product</h1>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-0.5">{initial.name}</p>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
          {error && (
            <div className="flex items-center gap-3 bg-error-container text-on-error-container px-4 py-3 rounded-lg text-sm">
              <span className="material-symbols-outlined text-sm flex-shrink-0">error</span>
              {error}
            </div>
          )}

          <div className="bg-surface rounded-xl border border-outline-variant/20 p-6 space-y-5">
            <h2 className="font-headline text-lg text-on-surface border-b border-outline-variant/20 pb-3">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
                  Product Name *
                </label>
                <input
                  name="name"
                  required
                  defaultValue={initial.name}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">URL Slug *</label>
                <input
                  name="slug"
                  required
                  defaultValue={initial.slug}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Short Description</label>
              <input
                name="shortDescription"
                defaultValue={initial.shortDescription ?? ""}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Full Description *</label>
              <textarea
                name="description"
                required
                rows={4}
                defaultValue={initial.description}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Category ID *</label>
              <input
                name="categoryId"
                required
                defaultValue={initial.categoryId}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors font-mono"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" name="isFeatured" defaultChecked={initial.isFeatured} className="w-4 h-4 accent-primary" />
              <span className="text-sm text-on-surface">Featured on homepage</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" name="isActive" defaultChecked={initial.isActive} className="w-4 h-4 accent-primary" />
              <span className="text-sm text-on-surface">Active on storefront</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-outline-variant/20">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
                  Main image URL (optional)
                </label>
                <input
                  name="imageUrl"
                  type="url"
                  defaultValue={initial.mainImageUrl}
                  placeholder="https://…"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors font-mono"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Image alt text</label>
                <input name="imageAlt" defaultValue={initial.mainImageAlt} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors" />
              </div>
            </div>

            <ProductImageReorder productId={initial.id} images={initial.images} />
          </div>

          <div className="bg-surface rounded-xl border border-outline-variant/20 p-6 space-y-5">
            <h2 className="font-headline text-lg text-on-surface border-b border-outline-variant/20 pb-3">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Base Price (USD) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                  <input
                    name="basePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    defaultValue={initial.basePrice}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-7 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Compare At Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                  <input
                    name="compareAtPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={initial.compareAtPrice ?? ""}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-7 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-outline-variant/20 p-6 space-y-5">
            <div className="border-b border-outline-variant/20 pb-3">
              <h2 className="font-headline text-lg text-on-surface">Primary variant & stock</h2>
              <p className="text-xs text-on-surface-variant mt-1">Updates the first variant created for this product.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Variant Name *</label>
                <input name="variantName" required defaultValue={initial.variantName} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">SKU *</label>
                <input name="variantSku" required defaultValue={initial.variantSku} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors font-mono" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Variant Price (USD) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                  <input
                    name="variantPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    defaultValue={initial.variantPrice}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-7 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1.5 max-w-xs">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Stock quantity *</label>
              <input
                name="initialStock"
                type="number"
                min="0"
                required
                defaultValue={initial.initialStock}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-outline-variant/20 p-6 space-y-5">
            <h2 className="font-headline text-lg text-on-surface border-b border-outline-variant/20 pb-3">Additional</h2>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Ingredients</label>
              <textarea
                name="ingredients"
                rows={3}
                defaultValue={initial.ingredients ?? ""}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Tags (comma separated)</label>
              <input name="tags" defaultValue={initial.tags.join(", ")} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors" />
            </div>
          </div>

          <div className="flex items-center justify-between pb-8">
            <Link href="/admin/products" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-lg font-bold text-sm tracking-wide hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  Saving…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">save</span>
                  Save changes
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
