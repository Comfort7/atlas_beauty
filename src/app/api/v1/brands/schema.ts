import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  logo: z.string().url().optional(),
});

export const updateBrandSchema = brandSchema.partial();
