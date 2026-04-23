"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { resolveProductImageUrl } from "@/lib/product-image";

type CartItem = {
  id: string;
  quantity: number;
  variant: {
    id: string;
    name: string;
    price: number | string;
    product: {
      name: string;
      slug: string;
      category?: { slug?: string | null } | null;
      images: Array<{ url?: string | null }>;
    };
  };
};

type CartPayload = {
  id?: string;
  items: CartItem[];
  coupon?: { code: string } | null;
};

export default function CartClient() {
  const [cart, setCart] = useState<CartPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/v1/cart", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error("Failed to load cart");
        if (mounted) setCart((json.data as CartPayload) || { items: [] });
      } catch {
        if (mounted) setError("Could not load cart");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const cartItems = cart?.items ?? [];
  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + Number(item.variant.price || 0) * Number(item.quantity || 0),
        0
      ),
    [cartItems]
  );

  async function reloadCart() {
    const res = await fetch("/api/v1/cart", { cache: "no-store" });
    const json = await res.json();
    if (res.ok && json.success) setCart(json.data as CartPayload);
  }

  async function updateQty(itemId: string, quantity: number) {
    await fetch(`/api/v1/cart/items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    await reloadCart();
  }

  async function removeItem(itemId: string) {
    await fetch(`/api/v1/cart/items/${itemId}`, { method: "DELETE" });
    await reloadCart();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
      <div className="lg:col-span-7 space-y-12">
        <header className="space-y-2">
          <h1 className="font-headline text-5xl md:text-6xl tracking-tight text-on-surface">
            Shopping Bag
          </h1>
          <p className="text-on-surface-variant font-body text-sm uppercase tracking-widest">
            {loading ? "Loading..." : `${cartItems.length} Items`}
          </p>
        </header>

        {error && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!loading && cartItems.length === 0 && (
          <div className="rounded-lg border border-outline-variant/20 p-8 text-on-surface-variant">
            Your cart is empty.
          </div>
        )}

        <div className="space-y-10">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-8 group">
              <div className="w-32 h-44 bg-surface-container-low flex-shrink-0 relative">
                <Image
                  src={resolveProductImageUrl({
                    images: item.variant.product.images,
                    category: item.variant.product.category,
                  })}
                  alt={item.variant.product.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-between py-1 w-full">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-headline text-2xl text-on-surface">
                      {item.variant.product.name}
                    </h3>
                    <span className="font-body text-lg text-on-surface">
                      ${(Number(item.variant.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-sm mt-1">{item.variant.name}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center border-b border-primary py-1">
                    <button
                      onClick={() => updateQty(item.id, Math.max(0, item.quantity - 1))}
                      className="text-primary p-1"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="px-4 font-body text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="text-primary p-1"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-on-surface-variant hover:text-error transition-colors text-xs uppercase tracking-widest font-bold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="bg-surface-container-low p-10 space-y-8 sticky top-32">
          <h2 className="font-headline text-3xl text-on-surface">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between font-body text-on-surface-variant">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-body text-on-surface-variant">
              <span>Shipping</span>
              <span className="text-primary font-bold uppercase text-xs tracking-widest">
                Complimentary
              </span>
            </div>
            <div className="flex justify-between font-body text-on-surface-variant">
              <span>Tax (Calculated at checkout)</span>
              <span>$0.00</span>
            </div>
          </div>
          <div className="pt-8 space-y-6">
            <div className="flex justify-between items-baseline">
              <span className="font-headline text-4xl text-on-surface">Total</span>
              <span className="font-body text-2xl font-bold text-on-surface">
                ${subtotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
