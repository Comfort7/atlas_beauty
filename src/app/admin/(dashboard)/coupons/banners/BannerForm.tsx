"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { PromoBannerPlacement } from "@prisma/client";

export type BannerInitial = {
  id?: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  linkLabel: string;
  sortOrder: number;
  isActive: boolean;
  autoplayMs: number;
  placement: PromoBannerPlacement;
};

export default function BannerForm({ initial, backHref }: { initial: BannerInitial; backHref: string }) {
  const router = useRouter();
  const isEdit = Boolean(initial.id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const get = (n: string) => (form.elements.namedItem(n) as HTMLInputElement).value;

    const payload = {
      title: get("title"),
      subtitle: get("subtitle") || null,
      imageUrl: get("imageUrl") || null,
      linkUrl: get("linkUrl") || null,
      linkLabel: get("linkLabel") || null,
      sortOrder: parseInt(get("sortOrder") || "0", 10),
      isActive: (form.elements.namedItem("isActive") as HTMLInputElement).checked,
      autoplayMs: parseInt(get("autoplayMs") || "6000", 10),
      placement: get("placement") as PromoBannerPlacement,
    };

    try {
      const url = isEdit ? `/api/v1/admin/promo-banners/${initial.id}` : "/api/v1/admin/promo-banners";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to save banner");
      router.push(backHref);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <>
      <header className="bg-surface border-b border-outline-variant/20 px-8 py-4 flex items-center gap-4 sticky top-0 z-20">
        <Link href={backHref} className="text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline text-2xl text-on-surface">{isEdit ? "Edit banner" : "Add banner"}</h1>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-0.5">
            Static or carousel slide (multiple active slides rotate)
          </p>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          {error && (
            <div className="flex items-center gap-3 bg-error-container text-on-error-container px-4 py-3 rounded-lg text-sm">
              <span className="material-symbols-outlined text-sm flex-shrink-0">error</span>
              {error}
            </div>
          )}

          <div className="bg-surface rounded-xl border border-outline-variant/20 p-6 space-y-5">
            <h2 className="font-headline text-lg text-on-surface border-b border-outline-variant/20 pb-3">Content</h2>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Title *</label>
              <input
                name="title"
                required
                defaultValue={initial.title}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Subtitle</label>
              <textarea
                name="subtitle"
                rows={3}
                defaultValue={initial.subtitle}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Image URL</label>
              <input
                name="imageUrl"
                type="url"
                defaultValue={initial.imageUrl}
                placeholder="https://…"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-mono text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Link URL</label>
                <input
                  name="linkUrl"
                  type="url"
                  defaultValue={initial.linkUrl}
                  placeholder="Optional"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Link label</label>
                <input
                  name="linkLabel"
                  defaultValue={initial.linkLabel}
                  placeholder="e.g. Shop the sale"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-outline-variant/20 p-6 space-y-5">
            <h2 className="font-headline text-lg text-on-surface border-b border-outline-variant/20 pb-3">Placement & behavior</h2>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Where it appears</label>
              <select
                name="placement"
                defaultValue={initial.placement}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              >
                <option value="HOME">Homepage (below hero)</option>
                <option value="CART">Cart / bag page</option>
                <option value="COUPON">Cart — promotion area (coupon section)</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
                  Sort order (lower first)
                </label>
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={initial.sortOrder}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
                  Autoplay (ms, 0 = manual only)
                </label>
                <input
                  name="autoplayMs"
                  type="number"
                  min={0}
                  max={600000}
                  defaultValue={initial.autoplayMs}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" name="isActive" defaultChecked={initial.isActive} className="w-4 h-4 accent-primary" />
              <span className="text-sm text-on-surface">Visible on storefront</span>
            </label>
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              Add multiple banners with the same placement to build a carousel. One banner alone appears as a static strip.
            </p>
          </div>

          <div className="flex items-center justify-between pb-8">
            <Link href={backHref} className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
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
                  {isEdit ? "Save banner" : "Create banner"}
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
