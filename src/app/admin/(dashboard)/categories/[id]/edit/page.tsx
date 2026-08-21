import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CategoryForm from "../../CategoryForm";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [category, categories] = await Promise.all([
    prisma.category.findUnique({ where: { id } }),
    prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  if (!category) notFound();

  return (
    <CategoryForm
      initial={{
        id: category.id,
        name: category.name,
        description: category.description,
        image: category.image,
        parentId: category.parentId,
      }}
      parentOptions={categories}
    />
  );
}
