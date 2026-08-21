import { prisma } from "@/lib/prisma";
import CategoryForm from "../CategoryForm";

export default async function NewCategoryPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return <CategoryForm parentOptions={categories} />;
}
