import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BrandForm from "../../BrandForm";

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brand = await prisma.brand.findUnique({ where: { id } });

  if (!brand) notFound();

  return (
    <BrandForm
      initial={{
        id: brand.id,
        name: brand.name,
        description: brand.description,
        logo: brand.logo,
      }}
    />
  );
}
