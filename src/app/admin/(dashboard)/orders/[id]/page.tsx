import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import OrderActions from "./OrderActions";

async function getOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      address: true,
      coupon: true,
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  });
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) notFound();

  return (
    <>
      <header className="bg-surface border-b border-outline-variant/20 px-8 py-4 flex items-center gap-4 sticky top-0 z-20">
        <Link
          href="/admin/orders"
          className="text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline text-2xl text-on-surface">Order #{order.orderNumber}</h1>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-0.5">
            Placed{" "}
            {new Date(order.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-surface rounded-xl border border-outline-variant/20 overflow-hidden">
              <div className="p-6 border-b border-outline-variant/20">
                <h2 className="font-headline text-lg text-on-surface">Items</h2>
              </div>
              <div className="divide-y divide-outline-variant/10">
                {order.items.map((item) => (
                  <div key={item.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-on-surface truncate">
                        {item.productName}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {item.variantName} · SKU {item.sku}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-on-surface">
                        {item.quantity} × ${Number(item.price).toFixed(2)}
                      </p>
                      <p className="text-sm font-bold text-on-surface">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-outline-variant/20 space-y-1.5 bg-surface-container-low">
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>${Number(order.subtotal).toFixed(2)}</span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between text-sm text-primary">
                    <span>Discount{order.coupon ? ` (${order.coupon.code})` : ""}</span>
                    <span>-${Number(order.discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Shipping</span>
                  <span>${Number(order.shippingCost).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Tax</span>
                  <span>${Number(order.tax).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-on-surface pt-1.5 border-t border-outline-variant/20">
                  <span>Total</span>
                  <span>${Number(order.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-surface rounded-xl border border-outline-variant/20 p-6">
              <h2 className="font-headline text-lg text-on-surface mb-4">Shipping Address</h2>
              <p className="text-sm text-on-surface">{order.address.fullName}</p>
              <p className="text-sm text-on-surface-variant">{order.address.line1}</p>
              {order.address.line2 && (
                <p className="text-sm text-on-surface-variant">{order.address.line2}</p>
              )}
              <p className="text-sm text-on-surface-variant">
                {order.address.city}, {order.address.state} {order.address.postalCode}
              </p>
              <p className="text-sm text-on-surface-variant">{order.address.country}</p>
              {order.address.phone && (
                <p className="text-sm text-on-surface-variant mt-2">{order.address.phone}</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Customer */}
            <div className="bg-surface rounded-xl border border-outline-variant/20 p-6">
              <h2 className="font-headline text-lg text-on-surface mb-4">Customer</h2>
              <p className="text-sm font-bold text-on-surface">{order.user.name || "—"}</p>
              <p className="text-sm text-on-surface-variant">{order.user.email}</p>
              {order.user.phone && (
                <p className="text-sm text-on-surface-variant">{order.user.phone}</p>
              )}
            </div>

            <OrderActions
              orderId={order.id}
              status={order.status}
              paymentStatus={order.paymentStatus}
              trackingNumber={order.trackingNumber}
              trackingUrl={order.trackingUrl}
            />
          </div>
        </div>
      </main>
    </>
  );
}
