import { z } from "zod";

export const addItemSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

export const updateItemSchema = z.object({
  quantity: z.number().int().min(0).max(99),
});

export const applyCouponSchema = z.object({
  code: z.string().min(1).max(50),
});
