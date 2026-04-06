import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductEditForm, { type EditProductInitial } from "./ProductEditForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: { orderBy: { createdAt: "asc" }, include: { inventory: true } },
      images: { orderBy: { position: "asc" } },
    },
  });

  if (!product) notFound();

  const primary = product.variants[0];
  const sortedIm = [...product.images].sort((a, b) => a.position - b.position);
  const firstImg = sortedIm[0];

  const initial: EditProductInitial = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    basePrice: Number(product.basePrice),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    categoryId: product.categoryId,
    ingredients: product.ingredients,
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    tags: product.tags,
    variantName: primary?.name ?? "",
    variantSku: primary?.sku ?? "",
    variantPrice: primary ? Number(primary.price) : Number(product.basePrice),
    initialStock: primary?.inventory?.quantity ?? 0,
    mainImageUrl: firstImg?.url ?? "",
    mainImageAlt: firstImg?.altText ?? "",
    images: product.images.map((im) => ({
      id: im.id,
      position: im.position,
      url: im.url,
    })),
  };

  return <ProductEditForm initial={initial} />;
}
