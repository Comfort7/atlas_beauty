import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NotFoundError } from "@/lib/errors";
import { emailService } from "./email.service";

type TransactionClient = Omit<
  typeof prisma,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export const inventoryService = {
  async getByVariant(variantId: string) {
    const inventory = await prisma.inventory.findUnique({
      where: { variantId },
      include: {
        variant: {
          include: {
            product: { select: { name: true, slug: true } },
          },
        },
      },
    });

    if (!inventory) throw new NotFoundError("Inventory");
    return inventory;
  },

  async updateStock(variantId: string, quantity: number) {
    const inventory = await prisma.inventory.upsert({
      where: { variantId },
      create: { variantId, quantity },
      update: { quantity },
      include: {
        variant: {
          include: {
            product: { select: { name: true } },
          },
        },
      },
    });

    // Low stock alert
    if (quantity <= inventory.lowStockThreshold) {
      await emailService.sendLowStockAlert(
        inventory.variant.product.name,
        inventory.variant.name,
        quantity
      );
    }

    return inventory;
  },

  async listAll(
    page: number,
    limit: number,
    lowStockOnly: boolean = false
  ) {
    const where: Prisma.InventoryWhereInput = lowStockOnly
      ? { quantity: { lte: prisma.inventory.fields?.lowStockThreshold ? 10 : 10 } }
      : {};

    // For low stock, use raw query approach
    if (lowStockOnly) {
      const inventories = await prisma.$queryRaw<Array<{ id: string }>>`
        SELECT id FROM inventory WHERE quantity <= "lowStockThreshold"
        ORDER BY quantity ASC
        LIMIT ${limit} OFFSET ${(page - 1) * limit}
      `;

      const ids = inventories.map((i) => i.id);
      const items = await prisma.inventory.findMany({
        where: { id: { in: ids } },
        include: {
          variant: {
            include: {
              product: { select: { id: true, name: true, slug: true } },
            },
          },
        },
        orderBy: { quantity: "asc" },
      });

      const total = await prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count FROM inventory WHERE quantity <= "lowStockThreshold"
      `;

      return { inventories: items, total: Number(total[0].count) };
    }

    const [inventories, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        include: {
          variant: {
            include: {
              product: { select: { id: true, name: true, slug: true } },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { quantity: "asc" },
      }),
      prisma.inventory.count({ where }),
    ]);

    return { inventories, total };
  },

  async finalizeReservation(
    variantId: string,
    quantity: number,
    tx: TransactionClient
  ) {
    await tx.inventory.update({
      where: { variantId },
      data: {
        quantity: { decrement: quantity },
        reservedQuantity: { decrement: quantity },
      },
    });
  },

  async releaseReservation(
    variantId: string,
    quantity: number,
    tx?: TransactionClient
  ) {
    const client = tx || prisma;
    await client.inventory.update({
      where: { variantId },
      data: { reservedQuantity: { decrement: quantity } },
    });
  },
};
