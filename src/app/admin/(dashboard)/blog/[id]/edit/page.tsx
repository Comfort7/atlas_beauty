import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditPostForm, { type EditPostInitial } from "./EditPostForm";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) notFound();

  const initial: EditPostInitial = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    tags: post.tags,
    status: post.status,
  };

  return <EditPostForm initial={initial} />;
}
