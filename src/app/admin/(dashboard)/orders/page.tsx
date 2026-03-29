import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

const statusColors: Record<string, string> = {
  PENDING: "bg-tertiary-container text-on-tertiary-container",
  CONFIRMED: "bg-secondary-container text-on-secondary-container",
  PROCESSING: "bg-secondary-container text-on-secondary-container",
  SHIPPED: "bg-secondary-container/60 text-on-secondary-container",
  DELIVERED: "bg-primary-container/30 text-primary",
  CANCELLED: "bg-error-container text-on-error-container",
  REFUNDED: "bg-error-container/60 text-error",
};

async function getOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { items: true } },
    },
  });
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const byStatus = Object.values(OrderStatus).reduce(
    (acc, s) => ({ ...acc, [s]: orders.filter((o) => o.status === s).length }),
    {} as Record<string, number>
  );

  return (
    <>
      <header className="bg-surface border-b border-outline-variant/20 px-8 py-4 sticky top-0 z-20">
        <h1 className="font-headline text-2xl text-on-surface">Orders</h1>
        <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-0.5">
          {orders.length} total · ${totalRevenue.toFixed(2)} revenue
        </p>
      </header>

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Status Summary */}
        <div className="flex flex-wrap gap-3">
          {Object.entries(byStatus)
            .filter(([, count]) => count > 0)
            .map(([status, count]) => (
              <div
                key={status}
                className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 ${
                  statusColors[status] ?? "bg-surface-container text-on-surface-variant"
                }`}
              >
                <span>{status.charAt(0) + status.slice(1).toLowerCase()}</span>
                <span className="font-headline">{count}</span>
              </div>
            ))}
        </div>

        {orders.length === 0 ? (
          <div className="bg-surface rounded-xl border border-outline-variant/20 p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 block mb-4">
              receipt_long
            </span>
            <h2 className="font-headline text-xl text-on-surface mb-2">No orders yet</h2>
            <p className="text-on-surface-variant text-sm">Orders will appear here once customers start purchasing.</p>
          </div>
        ) : (
          <div className="bg-surface rounded-xl border border-outline-variant/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                    {["Order #", "Customer", "Items", "Total", "Payment", "Status", "Date"].map((h) => (
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
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-primary font-mono">
                        #{order.orderNumber}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-on-surface">{order.user.name || "—"}</p>
                        <p className="text-[11px] text-on-surface-variant">{order.user.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">
                        {order._count.items}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-on-surface">
                        ${Number(order.total).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                          order.paymentStatus === "PAID"
                            ? "bg-primary-container/30 text-primary"
                            : order.paymentStatus === "FAILED"
                            ? "bg-error-container text-on-error-container"
                            : "bg-surface-container text-on-surface-variant"
                        }`}>
                          {order.paymentStatus.charAt(0) + order.paymentStatus.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                          statusColors[order.status] ?? "bg-surface-container text-on-surface-variant"
                        }`}>
                          {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
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
