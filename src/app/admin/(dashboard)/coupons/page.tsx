import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getCoupons() {
  return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
}

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();

  return (
    <>
      <header className="bg-surface border-b border-outline-variant/20 px-8 py-4 sticky top-0 z-20">
        <h1 className="font-headline text-2xl text-on-surface">Coupons</h1>
        <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-0.5">
          {coupons.length} coupon{coupons.length !== 1 ? "s" : ""}
        </p>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        {coupons.length === 0 ? (
          <div className="bg-surface rounded-xl border border-outline-variant/20 p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 block mb-4">
              local_offer
            </span>
            <h2 className="font-headline text-xl text-on-surface mb-2">No coupons yet</h2>
            <p className="text-on-surface-variant text-sm">
              Coupons can be created via the API. Use{" "}
              <code className="font-mono text-primary">POST /api/v1/coupons</code> to add one.
            </p>
          </div>
        ) : (
          <div className="bg-surface rounded-xl border border-outline-variant/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                    {["Code", "Type", "Value", "Uses", "Expires", "Status"].map((h) => (
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
                      <td className="px-6 py-4 text-sm font-bold font-mono text-primary">
                        {coupon.code}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant capitalize">
                        {coupon.type.toLowerCase().replace("_", " ")}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-on-surface">
                        {coupon.type === "PERCENTAGE"
                          ? `${Number(coupon.value)}%`
                          : coupon.type === "FREE_SHIPPING"
                          ? "Free Shipping"
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
