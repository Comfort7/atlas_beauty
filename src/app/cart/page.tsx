"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PromoBannerStrip from "@/components/PromoBannerStrip";
import { PromoBannerPlacement } from "@prisma/client";

const cartItems = [
  {
    id: 1,
    name: "Cerulean Dew Serum",
    variant: "Volume: 50ml",
    price: 124,
    qty: 1,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBtKc4T5UmuppPR142fB96ehOAGTZMVuXU3RoUUFnIewK1AsY2SI2oONkqIwIja-4kKgYncYJy87TDKlSKscYy--dA8-FoKyLYxIrAHNpRSDDMvKDLpEpZ8xEbgmSiY7mImELBxE6bGAuCuI00mfAMPYZgL3sC2XKJyd2me_TbolXSpABEa6fgMcyMPDHrsd-FEkZ_P3g3q3PWVKwujXfKxtMctx9pdl_CT9tKU-6_Bdu_hG-mBBUgXFcqugAEDLBsoPu93t80KqxaE",
    alt: "Cerulean Dew Serum bottle on marble",
  },
  {
    id: 2,
    name: "Architectural Hydrating Balm",
    variant: "Refillable Glass Vessel",
    price: 88,
    qty: 2,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrZ33cXnb_YdveVl6QRGU1uGmTN_3meqVHBHT6hMquIaRwV0eumy-QZeiOnCQpniCY1xPUrIvu7JrCeqvj5GI_a-JCRXRHT_gWJrmprBHcq0MVWoymW_6hXXoasQvnssBy7Qx77ES30IY0UB59mJKGP0l2kPk6ZR8EzU5vvIyhwC2Ke1Rlx64l98UtIJXaJE7aiU6smW01KaAY4A7rLZhL9yryikZIQ74qIBn9hNMBr3jTSWrYjzdx7yQDd9G8B4HpK1SpOUCtjy5G",
    alt: "Architectural Hydrating Balm in glass vessel",
  },
];

export default function CartPage() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto min-h-screen">
        <div className="mb-10 space-y-8">
          <PromoBannerStrip placement={PromoBannerPlacement.CART} />
          <PromoBannerStrip placement={PromoBannerPlacement.COUPON} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Items */}
          <div className="lg:col-span-7 space-y-12">
            <header className="space-y-2">
              <h1 className="font-headline text-5xl md:text-6xl tracking-tight text-on-surface">
                Shopping Bag
              </h1>
              <p className="text-on-surface-variant font-body text-sm uppercase tracking-widest">
                {cartItems.length} Items — Curator Selection
              </p>
            </header>

            <div className="space-y-10">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-8 group">
                  <div className="w-32 h-44 bg-surface-container-low flex-shrink-0 relative">
                    <Image src={item.image} alt={item.alt} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col justify-between py-1 w-full">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-headline text-2xl text-on-surface">{item.name}</h3>
                        <span className="font-body text-lg text-on-surface">
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-on-surface-variant text-sm mt-1">{item.variant}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center border-b border-primary py-1">
                        <button className="text-primary p-1">
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="px-4 font-body text-sm font-semibold">{item.qty}</span>
                        <button className="text-primary p-1">
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                      <button className="text-on-surface-variant hover:text-error transition-colors text-xs uppercase tracking-widest font-bold">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bento Accents */}
            <div className="pt-12 grid grid-cols-2 gap-4">
              <div className="bg-primary-container p-8 h-48 flex flex-col justify-end">
                <span className="material-symbols-outlined text-on-primary-container mb-4 text-3xl">
                  auto_awesome
                </span>
                <h4 className="font-headline text-xl text-on-primary-container">
                  Complimentary Samples
                </h4>
                <p className="text-on-primary-container/80 text-xs uppercase tracking-widest mt-2">
                  Added to every order
                </p>
              </div>
              <div className="bg-surface-container-low p-8 h-48 flex flex-col justify-end">
                <span className="material-symbols-outlined text-primary mb-4 text-3xl">
                  local_shipping
                </span>
                <h4 className="font-headline text-xl text-on-surface">Carbon Neutral Delivery</h4>
                <p className="text-on-surface-variant text-xs uppercase tracking-widest mt-2">
                  Included for members
                </p>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
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
                <div className="space-y-3">
                  <button className="w-full bg-primary text-on-primary py-5 rounded-lg font-body font-bold uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-3">
                    Proceed to Checkout
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                  <button className="w-full bg-surface-container-lowest text-primary py-5 rounded-lg font-body font-bold uppercase tracking-widest hover:bg-white transition-all border border-outline-variant">
                    Checkout with ShopPay
                  </button>
                </div>
              </div>

              <div className="pt-10">
                <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-4 font-bold">
                  Promotion Code
                </p>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="w-full bg-surface-container-high border-b-2 border-primary border-t-0 border-x-0 focus:ring-0 focus:border-primary px-0 py-3 text-sm placeholder:text-outline-variant font-body"
                  />
                  <button className="absolute right-0 top-1/2 -translate-y-1/2 text-primary font-bold text-xs uppercase tracking-widest">
                    Apply
                  </button>
                </div>
              </div>

              <div className="pt-6 flex items-center gap-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-lg">lock</span>
                <p className="text-xs uppercase tracking-tighter">
                  Secure Checkout &amp; Encrypted Transaction
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
