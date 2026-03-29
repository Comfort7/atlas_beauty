import { prisma } from "@/lib/prisma";

async function getCustomers() {
  return prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orders: true, reviews: true } },
      orders: {
        select: { total: true, paymentStatus: true },
        where: { paymentStatus: "PAID" },
      },
    },
  });
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <>
      <header className="bg-surface border-b border-outline-variant/20 px-8 py-4 sticky top-0 z-20">
        <h1 className="font-headline text-2xl text-on-surface">Customers</h1>
        <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-0.5">
          {customers.length} registered customer{customers.length !== 1 ? "s" : ""}
        </p>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        {customers.length === 0 ? (
          <div className="bg-surface rounded-xl border border-outline-variant/20 p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 block mb-4">
              group
            </span>
            <h2 className="font-headline text-xl text-on-surface mb-2">No customers yet</h2>
            <p className="text-on-surface-variant text-sm">
              Customers will appear here once they register on the site.
            </p>
          </div>
        ) : (
          <div className="bg-surface rounded-xl border border-outline-variant/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                    {["Customer", "Email", "Orders", "Total Spent", "Reviews", "Joined"].map((h) => (
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
                  {customers.map((customer) => {
                    const totalSpent = customer.orders.reduce(
                      (sum, o) => sum + Number(o.total),
                      0
                    );
                    return (
                      <tr
                        key={customer.id}
                        className="hover:bg-surface-container-low/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-on-primary-container">
                                {(customer.name || customer.email).charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm font-bold text-on-surface">
                              {customer.name || "—"}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">
                          {customer.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface font-bold">
                          {customer._count.orders}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-primary">
                          ${totalSpent.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">
                          {customer._count.reviews}
                        </td>
                        <td className="px-6 py-4 text-xs text-on-surface-variant whitespace-nowrap">
                          {new Date(customer.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
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
