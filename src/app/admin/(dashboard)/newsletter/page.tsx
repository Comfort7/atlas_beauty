import { prisma } from "@/lib/prisma";

async function getSubscribers() {
  return prisma.newsletterSubscriber.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminNewsletterPage() {
  const subscribers = await getSubscribers();

  return (
    <>
      <header className="bg-surface border-b border-outline-variant/20 px-8 py-4 sticky top-0 z-20">
        <h1 className="font-headline text-2xl text-on-surface">Newsletter</h1>
        <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-0.5">
          {subscribers.length} active subscriber{subscribers.length !== 1 ? "s" : ""}
        </p>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        {subscribers.length === 0 ? (
          <div className="bg-surface rounded-xl border border-outline-variant/20 p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 block mb-4">
              mail
            </span>
            <h2 className="font-headline text-xl text-on-surface mb-2">No subscribers yet</h2>
            <p className="text-on-surface-variant text-sm">
              Signups from the homepage newsletter form will appear here.
            </p>
          </div>
        ) : (
          <div className="bg-surface rounded-xl border border-outline-variant/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                    {["Email", "Subscribed"].map((h) => (
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
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-on-surface">{sub.email}</td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant whitespace-nowrap">
                        {new Date(sub.createdAt).toLocaleDateString("en-GB", {
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
