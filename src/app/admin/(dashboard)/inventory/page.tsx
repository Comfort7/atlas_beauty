import { prisma } from "@/lib/prisma";
import Link from "next/link";
import UpdateStockForm from "./UpdateStockForm";

async function getInventory() {
  return prisma.inventory.findMany({
    orderBy: { quantity: "asc" },
    include: {
      variant: {
        include: {
          product: {
            select: { name: true, slug: true, category: { select: { name: true } } },
          },
        },
      },
    },
  });
}

export default async function InventoryPage() {
  const items = await getInventory();

  const outOfStock = items.filter((i) => i.quantity === 0).length;
  const lowStock = items.filter((i) => i.quantity > 0 && i.quantity <= i.lowStockThreshold).length;
  const healthy = items.filter((i) => i.quantity > i.lowStockThreshold).length;

  return (
    <>
      <header className="bg-surface border-b border-outline-variant/20 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="font-headline text-2xl text-on-surface">Inventory</h1>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-0.5">
            {items.length} variants tracked
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-lg text-sm font-bold hover:brightness-110 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Product
        </Link>
      </header>

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Out of Stock", value: outOfStock, color: "text-error", bg: "bg-error-container/20 border-error/20" },
            { label: "Low Stock", value: lowStock, color: "text-tertiary", bg: "bg-tertiary-container/20 border-tertiary/20" },
            { label: "Healthy Stock", value: healthy, color: "text-primary", bg: "bg-primary-container/20 border-primary/20" },
          ].map((card) => (
            <div key={card.label} className={`rounded-xl border p-5 ${card.bg}`}>
              <p className={`font-headline text-3xl ${card.color}`}>{card.value}</p>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1 font-label">
                {card.label}
              </p>
            </div>
          ))}
        </div>

        {/* Inventory Table */}
        {items.length === 0 ? (
          <div className="bg-surface rounded-xl border border-outline-variant/20 p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 block mb-4">
              warehouse
            </span>
            <h2 className="font-headline text-xl text-on-surface mb-2">No inventory tracked yet</h2>
            <p className="text-on-surface-variant text-sm">Add products with variants to track inventory.</p>
          </div>
        ) : (
          <div className="bg-surface rounded-xl border border-outline-variant/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                    {["Product", "Category", "SKU", "Stock", "Reserved", "Available", "Threshold", "Status", "Update"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {items.map((item) => {
                    const available = item.quantity - item.reservedQuantity;
                    const isOut = item.quantity === 0;
                    const isLow = item.quantity > 0 && item.quantity <= item.lowStockThreshold;

                    return (
                      <tr key={item.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-5 py-3">
                          <Link
                            href={`/products/${item.variant.product.slug}`}
                            className="text-sm font-bold text-on-surface hover:text-primary transition-colors"
                            target="_blank"
                          >
                            {item.variant.product.name}
                          </Link>
                          <p className="text-[10px] text-on-surface-variant mt-0.5">{item.variant.name}</p>
                        </td>
                        <td className="px-5 py-3 text-sm text-on-surface-variant">
                          {item.variant.product.category.name}
                        </td>
                        <td className="px-5 py-3 text-xs font-mono text-on-surface-variant">
                          {item.variant.sku}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-sm font-bold ${isOut ? "text-error" : isLow ? "text-tertiary" : "text-on-surface"}`}>
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-on-surface-variant">{item.reservedQuantity}</td>
                        <td className="px-5 py-3">
                          <span className={`text-sm font-bold ${available <= 0 ? "text-error" : "text-primary"}`}>
                            {available}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-on-surface-variant">{item.lowStockThreshold}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                            isOut
                              ? "bg-error-container text-on-error-container"
                              : isLow
                              ? "bg-tertiary-container text-on-tertiary-container"
                              : "bg-primary-container/30 text-primary"
                          }`}>
                            {isOut ? "Out" : isLow ? "Low" : "OK"}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <UpdateStockForm variantId={item.variantId} currentQty={item.quantity} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
