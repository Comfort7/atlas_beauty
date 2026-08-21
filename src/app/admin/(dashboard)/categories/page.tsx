import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteCategoryButton from "./DeleteCategoryButton";

async function getCategories() {
  return prisma.category.findMany({
    include: {
      parent: { select: { name: true } },
      _count: { select: { products: true, children: true } },
    },
    orderBy: [{ parentId: "asc" }, { name: "asc" }],
  });
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <header className="bg-surface border-b border-outline-variant/20 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="font-headline text-2xl text-on-surface">Categories</h1>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-0.5">
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-bold hover:brightness-110 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Category
        </Link>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        {categories.length === 0 ? (
          <div className="bg-surface rounded-xl border border-outline-variant/20 p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 block mb-4">
              category
            </span>
            <h2 className="font-headline text-xl text-on-surface mb-2">No categories yet</h2>
            <p className="text-on-surface-variant text-sm">
              Categories organize the storefront's product listings.
            </p>
          </div>
        ) : (
          <div className="bg-surface rounded-xl border border-outline-variant/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                    {["Name", "Slug", "Parent", "Products", "Actions"].map((h) => (
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
                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      className="hover:bg-surface-container-low/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-bold text-on-surface">
                        {category.parentId && (
                          <span className="text-on-surface-variant mr-1">└</span>
                        )}
                        {category.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant font-mono">
                        {category.slug}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">
                        {category.parent?.name ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">
                        {category._count.products}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/categories/${category.id}/edit`}
                            className="text-on-surface-variant hover:text-primary transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </Link>
                          <DeleteCategoryButton
                            categoryId={category.id}
                            hasChildren={category._count.children > 0}
                            hasProducts={category._count.products > 0}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
