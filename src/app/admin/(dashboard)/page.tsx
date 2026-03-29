import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

const statusColors: Record<string, string> = {
  PENDING: "bg-tertiary-container text-on-tertiary-container",
  CONFIRMED: "bg-secondary-container text-on-secondary-container",
  PROCESSING: "bg-secondary-container text-on-secondary-container",
  SHIPPED: "bg-secondary-container text-on-secondary-container",
  DELIVERED: "bg-primary-container text-on-primary-container",
  CANCELLED: "bg-error-container text-on-error-container",
  REFUNDED: "bg-error-container text-on-error-container",
};

const statusLabel: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

async function getDashboardData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const [
    totalRevenue,
    lastMonthRevenue,
    ordersToday,
    ordersYesterday,
    activeProducts,
    totalCustomers,
    newCustomersThisMonth,
    recentOrders,
    lowStockItems,
    totalPosts,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: PaymentStatus.PAID },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        paymentStatus: PaymentStatus.PAID,
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
    }),
    prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(startOfDay.getTime() - 86400000),
          lt: startOfDay,
        },
      },
    }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.count({
      where: { role: "CUSTOMER", createdAt: { gte: startOfMonth } },
    }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { items: true } },
      },
    }),
    prisma.inventory.findMany({
      where: { quantity: { lte: 10 } },
      take: 5,
      orderBy: { quantity: "asc" },
      include: {
        variant: {
          include: {
            product: { select: { name: true } },
          },
        },
      },
    }),
    prisma.post.count(),
  ]);

  return {
    totalRevenue: Number(totalRevenue._sum.total ?? 0),
    lastMonthRevenue: Number(lastMonthRevenue._sum.total ?? 0),
    ordersToday,
    ordersYesterday,
    activeProducts,
    totalCustomers,
    newCustomersThisMonth,
    recentOrders,
    lowStockItems,
    totalPosts,
  };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  const revenueDiff =
    data.lastMonthRevenue > 0
      ? (((data.totalRevenue - data.lastMonthRevenue) / data.lastMonthRevenue) * 100).toFixed(1)
      : null;

  const ordersDiff = data.ordersToday - data.ordersYesterday;

  const stats = [
    {
      label: "Total Revenue",
      value: `$${data.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: revenueDiff ? `${revenueDiff}% vs last month` : "No prior data",
      up: revenueDiff ? Number(revenueDiff) >= 0 : true,
      icon: "payments",
    },
    {
      label: "Orders Today",
      value: String(data.ordersToday),
      change:
        ordersDiff === 0
          ? "Same as yesterday"
          : `${ordersDiff > 0 ? "+" : ""}${ordersDiff} from yesterday`,
      up: ordersDiff >= 0,
      icon: "receipt_long",
    },
    {
      label: "Active Products",
      value: String(data.activeProducts),
      change: `${data.lowStockItems.length} low stock`,
      up: data.lowStockItems.length === 0,
      icon: "inventory_2",
    },
    {
      label: "Total Customers",
      value: String(data.totalCustomers),
      change: `+${data.newCustomersThisMonth} this month`,
      up: true,
      icon: "group",
    },
  ];

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* Top Bar */}
      <header className="bg-surface border-b border-outline-variant/20 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="font-headline text-2xl text-on-surface">Dashboard</h1>
          <p className="text-xs text-on-surface-variant font-label uppercase tracking-widest mt-0.5">
            {today}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-bold hover:brightness-110 transition-all"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Product
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-surface rounded-xl p-6 border border-outline-variant/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-container/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-sm">
                    {stat.icon}
                  </span>
                </div>
                <span
                  className={`text-xs font-bold font-label px-2 py-1 rounded-full ${
                    stat.up
                      ? "bg-primary-container/20 text-primary"
                      : "bg-error-container text-on-error-container"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="font-headline text-3xl text-on-surface">{stat.value}</p>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest font-label mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="xl:col-span-2 bg-surface rounded-xl border border-outline-variant/20 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
              <h2 className="font-headline text-xl text-on-surface">Recent Orders</h2>
              <Link
                href="/admin/orders"
                className="text-xs text-primary font-bold font-label uppercase tracking-widest hover:underline"
              >
                View All
              </Link>
            </div>
            {data.recentOrders.length === 0 ? (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 block mb-3">
                  receipt_long
                </span>
                <p className="text-on-surface-variant text-sm">No orders yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-outline-variant/20">
                      {["Order", "Customer", "Items", "Total", "Status", "Date"].map((h) => (
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
                    {data.recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-surface-container-low transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-primary font-body">
                          <Link href={`/admin/orders`} className="hover:underline">
                            #{order.orderNumber}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface font-body">
                          {order.user.name || order.user.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">
                          {order._count.items}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-on-surface">
                          ${Number(order.total).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                              statusColors[order.status] ?? "bg-surface-container text-on-surface"
                            }`}
                          >
                            {statusLabel[order.status] ?? order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-on-surface-variant">
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
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Low Stock Alert */}
            <div className="bg-surface rounded-xl border border-outline-variant/20 overflow-hidden">
              <div className="flex items-center gap-3 p-6 border-b border-outline-variant/20">
                <span className="material-symbols-outlined text-error text-sm">warning</span>
                <h2 className="font-headline text-lg text-on-surface">Low Stock Alert</h2>
              </div>
              {data.lowStockItems.length === 0 ? (
                <div className="p-8 text-center">
                  <span className="material-symbols-outlined text-3xl text-primary/40 block mb-2">
                    check_circle
                  </span>
                  <p className="text-sm text-on-surface-variant">All stock levels look good.</p>
                </div>
              ) : (
                <div className="divide-y divide-outline-variant/10">
                  {data.lowStockItems.map((item) => {
                    const pct = Math.min(
                      100,
                      Math.round((item.quantity / item.lowStockThreshold) * 100)
                    );
                    return (
                      <div key={item.id} className="px-6 py-4">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-bold text-on-surface leading-tight">
                            {item.variant.product.name}
                          </p>
                          <span className="text-[10px] font-bold text-error ml-2 flex-shrink-0">
                            {item.quantity} left
                          </span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">
                          {item.variant.sku}
                        </p>
                        <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                          <div
                            className="h-full bg-error rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="p-4 border-t border-outline-variant/10">
                <Link
                  href="/admin/inventory"
                  className="w-full flex justify-center text-xs text-primary font-bold font-label uppercase tracking-widest hover:underline"
                >
                  Manage Inventory →
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-surface rounded-xl border border-outline-variant/20 p-6">
              <h2 className="font-headline text-lg text-on-surface mb-5">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    icon: "add_box",
                    label: "Add Product",
                    color: "bg-primary text-on-primary",
                    href: "/admin/products/new",
                  },
                  {
                    icon: "edit_note",
                    label: "New Post",
                    color: "bg-primary-container text-on-primary-container",
                    href: "/admin/blog/new",
                  },
                  {
                    icon: "warehouse",
                    label: "Inventory",
                    color: "bg-surface-container text-on-surface",
                    href: "/admin/inventory",
                  },
                  {
                    icon: "receipt_long",
                    label: "Orders",
                    color: "bg-surface-container text-on-surface",
                    href: "/admin/orders",
                  },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={`${action.color} p-4 rounded-lg flex flex-col items-center gap-2 hover:opacity-90 transition-opacity`}
                  >
                    <span className="material-symbols-outlined text-sm">{action.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest font-label text-center">
                      {action.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Content Summary */}
            <div className="bg-primary rounded-xl p-6 text-on-primary">
              <p className="text-[10px] uppercase tracking-widest opacity-70 font-label mb-2">
                Content Overview
              </p>
              <div className="space-y-3">
                {[
                  { label: "Active Products", value: data.activeProducts, icon: "inventory_2" },
                  { label: "Blog Posts", value: data.totalPosts, icon: "article" },
                  { label: "Total Customers", value: data.totalCustomers, icon: "group" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm opacity-70">
                        {item.icon}
                      </span>
                      <span className="text-sm opacity-80">{item.label}</span>
                    </div>
                    <span className="font-headline text-xl">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
