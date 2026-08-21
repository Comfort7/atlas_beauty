import { prisma } from "@/lib/prisma";
import StaffTable from "./StaffTable";

async function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: [{ role: "asc" }, { createdAt: "desc" }],
  });
}

export default async function AdminStaffPage() {
  const users = await getUsers();
  const admins = users.filter((u) => u.role === "ADMIN");
  const customers = users.filter((u) => u.role !== "ADMIN");

  return (
    <>
      <header className="bg-surface border-b border-outline-variant/20 px-8 py-4 sticky top-0 z-20">
        <h1 className="font-headline text-2xl text-on-surface">Staff Access</h1>
        <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-0.5">
          {admins.length} admin{admins.length !== 1 ? "s" : ""} · manage who can access this
          dashboard
        </p>
      </header>

      <main className="flex-1 p-8 overflow-y-auto space-y-8">
        <section>
          <h2 className="font-headline text-lg text-on-surface mb-4">Admins</h2>
          <StaffTable
            users={admins.map((u) => ({
              id: u.id,
              name: u.name,
              email: u.email,
              role: u.role,
              orderCount: u._count.orders,
              createdAt: u.createdAt.toISOString(),
            }))}
            emptyLabel="No admin users yet."
          />
        </section>

        <section>
          <h2 className="font-headline text-lg text-on-surface mb-4">
            Promote a customer to admin
          </h2>
          <StaffTable
            users={customers.map((u) => ({
              id: u.id,
              name: u.name,
              email: u.email,
              role: u.role,
              orderCount: u._count.orders,
              createdAt: u.createdAt.toISOString(),
            }))}
            emptyLabel="No other users yet."
            limit={50}
          />
        </section>
      </main>
    </>
  );
}
