import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteProductButton from "./DeleteProductButton";

async function getProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      brand: { select: { name: true } },
      variants: {
        include: { inventory: true },
      },
      _count: { select: { reviews: true } },
    },
  });
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <>
      <header className="bg-surface border-b border-outline-variant/20 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="font-headline text-2xl text-on-surface">Products</h1>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-0.5">
            {products.length} total products
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

      <main className="flex-1 p-8 overflow-y-auto">
        {products.length === 0 ? (
          <div className="bg-surface rounded-xl border border-outline-variant/20 p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 block mb-4">
              inventory_2
            </span>
            <h2 className="font-headline text-2xl text-on-surface mb-2">No products yet</h2>
            <p className="text-on-surface-variant text-sm mb-6">
              Add your first product to start selling.
            </p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg text-sm font-bold hover:brightness-110 transition-all"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add First Product
            </Link>
          </div>
        ) : (
          <div className="bg-surface rounded-xl border border-outline-variant/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                    {[
                      "Product",
                      "Category",
                      "Price",
                      "Stock",
                      "Reviews",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {products.map((product) => {
                    const totalStock = product.variants.reduce(
                      (sum, v) => sum + (v.inventory?.quantity ?? 0),
                      0
                    );
                    const isLowStock = totalStock <= 10 && product.variants.length > 0;

                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-surface-container-low/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-bold text-on-surface">{product.name}</p>
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
                              {product.brand?.name ?? "No brand"} · {product.variants.length} variant
                              {product.variants.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">
                          {product.category.name}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-on-surface">
                          ${Number(product.basePrice).toFixed(2)}
                          {product.compareAtPrice && (
                            <span className="ml-2 text-[10px] text-on-surface-variant line-through">
                              ${Number(product.compareAtPrice).toFixed(2)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-sm font-bold ${
                              totalStock === 0
                                ? "text-error"
                                : isLowStock
                                ? "text-tertiary"
                                : "text-primary"
                            }`}
                          >
                            {totalStock}
                          </span>
                          {isLowStock && (
                            <span className="ml-2 text-[10px] text-error">Low</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">
                          {product._count.reviews}
                          {product.averageRating > 0 && (
                            <span className="ml-1 text-[10px] text-primary">
                              ★ {product.averageRating.toFixed(1)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                              product.isActive
                                ? "bg-primary-container/30 text-primary"
                                : "bg-surface-container text-on-surface-variant"
                            }`}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                          {product.isFeatured && (
                            <span className="ml-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-secondary-container text-on-secondary-container">
                              Featured
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/products/${product.slug}?from=admin`}
                              className="text-on-surface-variant hover:text-primary transition-colors"
                              title="View storefront"
                            >
                              <span className="material-symbols-outlined text-sm">visibility</span>
                            </Link>
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="text-on-surface-variant hover:text-primary transition-colors"
                              title="Edit product"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </Link>
                            <Link
                              href="/admin/inventory"
                              className="text-on-surface-variant hover:text-primary transition-colors"
                              title="Inventory & stock"
                            >
                              <span className="material-symbols-outlined text-sm">warehouse</span>
                            </Link>
                            <DeleteProductButton productId={product.id} />
                          </div>
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
