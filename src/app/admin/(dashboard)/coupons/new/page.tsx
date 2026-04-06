"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewCouponPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState<"PERCENTAGE" | "FIXED" | "FREE_SHIPPING">("PERCENTAGE");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const get = (n: string) => (form.elements.namedItem(n) as HTMLInputElement).value;

    const value =
      type === "FREE_SHIPPING" ? 0 : parseFloat(get("value") || "0");

    const payload = {
      code: get("code").toUpperCase().trim(),
      description: get("description") || undefined,
      type,
      value,
      minOrderAmount: get("minOrderAmount") ? parseFloat(get("minOrderAmount")) : undefined,
      maxUses: get("maxUses") ? parseInt(get("maxUses"), 10) : undefined,
      maxUsesPerUser: parseInt(get("maxUsesPerUser") || "1", 10),
      startsAt: get("startsAt") ? new Date(get("startsAt")).toISOString() : undefined,
      expiresAt: get("expiresAt") ? new Date(get("expiresAt")).toISOString() : undefined,
    };

    try {
      const res = await fetch("/api/v1/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to create coupon");
      router.push("/admin/coupons");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <>
      <header className="bg-surface border-b border-outline-variant/20 px-8 py-4 flex items-center gap-4 sticky top-0 z-20">
        <Link href="/admin/coupons" className="text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline text-2xl text-on-surface">Add Coupon</h1>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-0.5">Create a discount code</p>
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
            <h2 className="font-headline text-lg text-on-surface border-b border-outline-variant/20 pb-3">Code</h2>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
                Code *
              </label>
              <input
                name="code"
                required
                minLength={3}
                maxLength={30}
                placeholder="e.g. WELCOME20"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-mono uppercase text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
                Description (internal)
              </label>
              <input
                name="description"
                maxLength={200}
                placeholder="Optional note for your team"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-outline-variant/20 p-6 space-y-5">
            <h2 className="font-headline text-lg text-on-surface border-b border-outline-variant/20 pb-3">Discount</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(["PERCENTAGE", "FIXED", "FREE_SHIPPING"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2.5 rounded-lg text-xs font-bold border transition-all ${
                    type === t
                      ? "border-primary bg-primary text-on-primary"
                      : "border-outline-variant text-on-surface-variant hover:border-primary"
                  }`}
                >
                  {t === "FREE_SHIPPING" ? "Free shipping" : t === "PERCENTAGE" ? "% Off" : "Fixed $"}
                </button>
              ))}
            </div>
            {type !== "FREE_SHIPPING" && (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
                  {type === "PERCENTAGE" ? "Percent off *" : "Amount (USD) *"}
                </label>
                <input
                  name="value"
                  type="number"
                  step={type === "PERCENTAGE" ? "1" : "0.01"}
                  min={type === "PERCENTAGE" ? 1 : 0}
                  max={type === "PERCENTAGE" ? 100 : undefined}
                  required
                  defaultValue={type === "PERCENTAGE" ? 10 : 5}
                  className="w-full max-w-xs bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            )}
          </div>

          <div className="bg-surface rounded-xl border border-outline-variant/20 p-6 space-y-5">
            <h2 className="font-headline text-lg text-on-surface border-b border-outline-variant/20 pb-3">Rules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
                  Minimum order (USD)
                </label>
                <input
                  name="minOrderAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="None"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
                  Max total uses
                </label>
                <input
                  name="maxUses"
                  type="number"
                  min="1"
                  placeholder="Unlimited"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
                  Max uses per customer *
                </label>
                <input
                  name="maxUsesPerUser"
                  type="number"
                  min="1"
                  defaultValue={1}
                  required
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
                  Starts (local)
                </label>
                <input
                  name="startsAt"
                  type="datetime-local"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
                  Expires (local)
                </label>
                <input
                  name="expiresAt"
                  type="datetime-local"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pb-8">
            <Link href="/admin/coupons" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
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
                  Creating…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">add</span>
                  Create coupon
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
