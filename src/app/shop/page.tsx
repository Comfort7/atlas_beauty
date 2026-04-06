import { Suspense } from "react";
import ShopClient from "./ShopClient";

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 px-8 text-on-surface-variant text-sm">Loading shop…</div>
      }
    >
      <ShopClient />
    </Suspense>
  );
}
