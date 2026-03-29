import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  shortDescription: z.string().max(300).optional(),
  categoryId: z.string().min(1),
  brandId: z.string().optional(),
  basePrice: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  tags: z.array(z.string()).optional(),
  ingredients: z.string().optional(),
  isFeatured: z.boolean().optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  metaKeywords: z.array(z.string()).optional(),
});

export const updateProductSchema = createProductSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "rating", "bestselling"]).optional(),
  tags: z.string().optional(), // comma-separated
  featured: z.coerce.boolean().optional(),
});

export const createVariantSchema = z.object({
  sku: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  options: z.record(z.string(), z.string()),
  weight: z.number().positive().optional(),
  quantity: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(10),
});

export const updateVariantSchema = createVariantSchema.partial().extend({
  isActive: z.boolean().optional(),
});
