import slugify from "slugify";
import { prisma } from "@/lib/prisma";

export function createSlug(text: string): string {
  return slugify(text, { lower: true, strict: true, trim: true });
}

export async function createUniqueSlug(
  text: string,
  model: "product" | "category" | "brand"
): Promise<string> {
  const baseSlug = createSlug(text);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    let existing: unknown;
    if (model === "product") {
      existing = await prisma.product.findUnique({ where: { slug } });
    } else if (model === "category") {
      existing = await prisma.category.findUnique({ where: { slug } });
    } else {
      existing = await prisma.brand.findUnique({ where: { slug } });
    }

    if (!existing) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
