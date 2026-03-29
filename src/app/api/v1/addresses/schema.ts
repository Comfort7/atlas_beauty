import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().max(50).optional(),
  fullName: z.string().min(2).max(100),
  line1: z.string().min(1).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(20),
  country: z.string().length(2).default("US"),
  phone: z.string().max(20).optional(),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = addressSchema.partial();
