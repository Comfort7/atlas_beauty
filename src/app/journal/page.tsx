import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function estimateReadMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function JournalPage() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 12,
    include: { author: { select: { name: true } } },
  });

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 max-w-7xl mx-auto px-8">
        <header className="mb-20 text-center">
          <span className="font-label text-xs uppercase tracking-[0.3em] text-primary font-bold">Reflections</span>
          <h1 className="font-headline text-5xl md:text-7xl mt-4 text-on-surface tracking-tighter">The Atlas Journal</h1>
          <p className="mt-6 text-on-surface-variant font-body text-lg max-w-xl mx-auto leading-relaxed">
            Science, ritual, and the architecture of modern beauty. Curated perspectives from our research collective.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="text-center text-on-surface-variant font-body">
            New stories are on the way. Check back soon, or browse{" "}
            <Link href="/skincare" className="text-primary underline underline-offset-4">
              the shop
            </Link>
            .
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {posts.map((post, i) => {
              const tag = post.tags[0] ?? "Journal";
              const read = estimateReadMinutes(post.content);
              return (
                <Link key={post.id} href={`/journal/${post.slug}`} className="group block">
                  <div
                    className="relative overflow-hidden mb-6 bg-surface-container-low"
                    style={{ aspectRatio: i === 0 ? "16/10" : "4/5" }}
                  >
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high to-primary-container/20" />
                    )}
                  </div>
                  <span className="font-label text-[10px] uppercase tracking-widest text-primary font-bold mb-3 block">
                    {tag} · {read} min read
                  </span>
                  <h2 className="font-headline text-2xl md:text-3xl leading-tight group-hover:text-primary transition-colors mb-3">
                    {post.title}
                  </h2>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    {post.excerpt ?? post.content.slice(0, 180).replace(/\n/g, " ") + (post.content.length > 180 ? "…" : "")}
                  </p>
                  <span className="mt-6 inline-block font-bold text-xs uppercase border-b border-primary text-primary pb-1">
                    Read Article
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
