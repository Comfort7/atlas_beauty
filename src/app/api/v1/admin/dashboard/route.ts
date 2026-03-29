import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";

// GET /api/v1/admin/dashboard
export const GET = withAdmin(async () => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      recentOrders,
      monthlyRevenue,
      pendingOrders,
      lowStockCount,
    ] = await Promise.all([
      // Total revenue (paid orders)
      prisma.order.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { total: true },
      }),
      // Total orders
      prisma.order.count(),
      // Total customers
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      // Total active products
      prisma.product.count({ where: { isActive: true } }),
      // Recent orders
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          total: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
          user: { select: { name: true, email: true } },
        },
      }),
      // Monthly revenue for current year
      prisma.$queryRaw<
        Array<{ month: number; revenue: number }>
      >`
        SELECT
          EXTRACT(MONTH FROM "createdAt") as month,
          COALESCE(SUM(CAST(total AS DECIMAL)), 0) as revenue
        FROM orders
        WHERE "paymentStatus" = 'PAID'
          AND "createdAt" >= ${startOfYear}
        GROUP BY EXTRACT(MONTH FROM "createdAt")
        ORDER BY month
      `,
      // Pending orders count
      prisma.order.count({ where: { status: "PENDING" } }),
      // Low stock items
      prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count FROM inventory
        WHERE quantity <= "lowStockThreshold"
      `,
    ]);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const revenueByMonth = monthNames.map((name, i) => {
      const found = monthlyRevenue.find((m) => Number(m.month) === i + 1);
      return { month: name, revenue: found ? Number(found.revenue) : 0 };
    });

    // Top selling products
    const topProducts = await prisma.orderItem.groupBy({
      by: ["variantId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    const topProductDetails = await Promise.all(
      topProducts.map(async (tp) => {
        const variant = await prisma.productVariant.findUnique({
          where: { id: tp.variantId },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: { take: 1, orderBy: { position: "asc" } },
              },
            },
          },
        });
        return {
          product: variant?.product,
          variant: variant?.name,
          totalSold: tp._sum.quantity,
        };
      })
    );

    return successResponse({
      totalRevenue: Number(totalRevenue._sum.total || 0),
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      lowStockCount: Number(lowStockCount[0]?.count || 0),
      revenueByMonth,
      topProducts: topProductDetails,
      recentOrders,
    });
  } catch (error) {
    return handleError(error);
  }
});
