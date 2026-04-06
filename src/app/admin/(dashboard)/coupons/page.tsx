import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteCouponButton from "./DeleteCouponButton";
import DeleteBannerButton from "./DeleteBannerButton";

async function getData() {
  const [coupons, banners] = await Promise.all([
    prisma.coupon.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.promoBanner.findMany({ orderBy: [{ placement: "asc" }, { sortOrder: "asc" }] }),
  ]);
  return { coupons, banners };
}

const placementLabel: Record<string, string> = {
  HOME: "Homepage",
  CART: "Cart",
  COUPON: "Coupon / promo",
};

export default async function AdminCouponsPage() {
  const { coupons, banners } = await getData();

  return (
    <>
      <header className="bg-surface border-b border-outline-variant/20 px-8 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sticky top-0 z-20">
        <div>
          <h1 className="font-headline text-2xl text-on-surface">Coupons &amp; promotions</h1>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-0.5">
            Discount codes and promotional banners
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/coupons/new"
            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-lg text-sm font-bold hover:brightness-110 transition-all"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add coupon
          </Link>
          <Link
            href="/admin/coupons/banners/new"
            className="flex items-center gap-2 border border-outline-variant text-on-surface px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-surface-container transition-all"
          >
            <span className="material-symbols-outlined text-sm">campaign</span>
            Add banner
          </Link>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto space-y-12">
        {/* Banners */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline text-lg text-on-surface">Promotional banners</h2>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest max-w-md text-right">
              Multiple slides with the same placement rotate automatically (autoplay). One slide = static.
            </p>
          </div>
          {banners.length === 0 ? (
            <div className="bg-surface rounded-xl border border-outline-variant/20 p-10 text-center">
              <p className="text-on-surface-variant text-sm mb-4">No banners yet. Add slides for homepage, cart, or the coupon section.</p>
              <Link
                href="/admin/coupons/banners/new"
                className="inline-flex items-center gap-2 text-primary font-bold text-sm tracking-wide"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Create banner
              </Link>
            </div>
          ) : (
            <div className="bg-surface rounded-xl border border-outline-variant/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                      {["Title", "Placement", "Order", "Autoplay", "Status", "Actions"].map((h) => (
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
                    {banners.map((b) => (
                      <tr key={b.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-on-surface">{b.title}</p>
                          {b.subtitle && (
                            <p className="text-[11px] text-on-surface-variant mt-0.5 line-clamp-1">{b.subtitle}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">
                          {placementLabel[b.placement] ?? b.placement}
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-on-surface-variant">{b.sortOrder}</td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">
                          {b.autoplayMs === 0 ? "Manual" : `${b.autoplayMs} ms`}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                              b.isActive
                                ? "bg-primary-container/30 text-primary"
                                : "bg-surface-container text-on-surface-variant"
                            }`}
                          >
                            {b.isActive ? "Active" : "Off"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/coupons/banners/${b.id}/edit`}
                              className="text-on-surface-variant hover:text-primary transition-colors"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </Link>
                            <DeleteBannerButton bannerId={b.id} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Coupons */}
        <section>
          <h2 className="font-headline text-lg text-on-surface mb-4">Discount codes</h2>
          {coupons.length === 0 ? (
            <div className="bg-surface rounded-xl border border-outline-variant/20 p-16 text-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 block mb-4">local_offer</span>
              <h3 className="font-headline text-xl text-on-surface mb-2">No coupons yet</h3>
              <p className="text-on-surface-variant text-sm mb-6">Create a code customers can apply at checkout.</p>
              <Link
                href="/admin/coupons/new"
                className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg text-sm font-bold hover:brightness-110 transition-all"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add coupon
              </Link>
            </div>
          ) : (
            <div className="bg-surface rounded-xl border border-outline-variant/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                      {["Code", "Type", "Value", "Uses", "Expires", "Status", "Actions"].map((h) => (
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
                    {coupons.map((coupon) => (
                      <tr key={coupon.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold font-mono text-primary">{coupon.code}</td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant capitalize">
                          {coupon.type.toLowerCase().replace("_", " ")}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-on-surface">
                          {coupon.type === "PERCENTAGE"
                            ? `${Number(coupon.value)}%`
                            : coupon.type === "FREE_SHIPPING"
                            ? "Free shipping"
                            : `$${Number(coupon.value).toFixed(2)}`}
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">
                          {coupon.usedCount}
                          {coupon.maxUses && ` / ${coupon.maxUses}`}
                        </td>
                        <td className="px-6 py-4 text-xs text-on-surface-variant">
                          {coupon.expiresAt
                            ? new Date(coupon.expiresAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Never"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                              coupon.isActive
                                ? "bg-primary-container/30 text-primary"
                                : "bg-surface-container text-on-surface-variant"
                            }`}
                          >
                            {coupon.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/coupons/${coupon.id}/edit`}
                              className="text-on-surface-variant hover:text-primary transition-colors"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </Link>
                            <DeleteCouponButton couponId={coupon.id} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
