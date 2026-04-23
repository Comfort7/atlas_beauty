import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminStorefrontBar from "@/components/AdminStorefrontBar";
import { prisma } from "@/lib/prisma";
import { brandJournalEntries, getBrandJournalBySlug } from "@/lib/brand-content";

export const dynamic = "force-dynamic";

function estimateReadMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function JournalArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { slug } = await params;
  const { from } = await searchParams;
  const adminBack = from === "admin";

  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { author: { select: { name: true, image: true } } },
  });
  const brandPost = !post ? getBrandJournalBySlug(slug) : null;

  if (!post && !brandPost) notFound();

  const read = estimateReadMinutes(post?.content ?? brandPost?.content ?? "");

  const relatedDb = await prisma.post.findMany({
    where: { status: "PUBLISHED", ...(post ? { id: { not: post.id } } : {}) },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 3,
  });
  const relatedBrand = brandJournalEntries
    .filter((entry) => entry.slug !== slug)
    .slice(0, 3)
    .map((entry) => ({
      id: `brand-${entry.slug}`,
      slug: entry.slug,
      title: entry.title,
      coverImage: entry.coverImage,
      tags: entry.tags,
    }));

  const related = post
    ? [
        ...relatedDb.map((item) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          coverImage: item.coverImage,
          tags: item.tags,
        })),
        ...relatedBrand,
      ].slice(0, 3)
    : relatedBrand;

  const active = post
    ? {
        title: post.title,
        excerpt: post.excerpt,
        tags: post.tags,
        coverImage: post.coverImage,
        content: post.content,
        author: post.author,
      }
    : {
        title: brandPost!.title,
        excerpt: brandPost!.excerpt,
        tags: brandPost!.tags,
        coverImage: brandPost!.coverImage,
        content: brandPost!.content,
        author: { name: `${brandPost!.brand} Editorial`, image: null },
      };

  return (
    <>
      <Navbar />
      {adminBack && <AdminStorefrontBar backHref="/admin/blog" backLabel="Back to blog" />}
      <main className={`pb-20 ${adminBack ? "pt-40 lg:pt-44" : "pt-24 lg:pt-32"}`}>
        <header className="max-w-7xl mx-auto px-8 mb-16 lg:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <div className="mb-8">
                <span className="font-label text-xs uppercase tracking-[0.3em] text-primary font-bold">
                  {active.tags[0] ?? "Journal"}
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl leading-tight font-headline text-on-background mb-6">{active.title}</h1>
            </div>
            <div className="lg:col-span-4 pb-4">
              {active.excerpt && (
                <p className="font-body text-lg text-on-surface-variant leading-relaxed max-w-md lg:ml-auto lg:text-right">
                  {active.excerpt}
                </p>
              )}
            </div>
          </div>
        </header>

        {active.coverImage && (
          <section className="w-full h-[min(60vh,600px)] relative overflow-hidden bg-primary-container">
            <Image
              src={active.coverImage}
              alt={active.title}
              fill
              unoptimized
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent pointer-events-none" />
          </section>
        )}

        <article className="max-w-7xl mx-auto px-8 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <aside className="lg:col-span-3 order-2 lg:order-1">
            <div className="lg:sticky lg:top-32 space-y-12">
              <div className="space-y-4">
                <h4 className="font-label text-xs uppercase tracking-widest text-primary font-bold">Author</h4>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high relative flex-shrink-0">
                    {active.author.image ? (
                      <Image src={active.author.image} alt="" fill unoptimized className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-on-surface-variant">
                        {active.author.name?.slice(0, 1) ?? "?"}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-headline font-bold text-sm">{active.author.name ?? "Atlas"}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-label text-xs uppercase tracking-widest text-primary font-bold">Reading time</h4>
                <p className="font-body text-sm">
                  {read} min{read !== 1 ? "s" : ""}
                </p>
              </div>
              {active.tags.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-label text-xs uppercase tracking-widest text-primary font-bold">Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {active.tags.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 bg-surface-container text-[10px] uppercase font-bold tracking-wider rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          <div
            className="lg:col-span-7 space-y-4 order-1 lg:order-2 font-body text-lg leading-[1.85] text-on-surface-variant
            [&_h1]:font-headline [&_h1]:text-4xl [&_h1]:text-on-surface [&_h1]:mb-4
            [&_h2]:font-headline [&_h2]:text-3xl [&_h2]:text-on-surface [&_h2]:mt-10 [&_h2]:mb-4
            [&_h3]:font-headline [&_h3]:text-2xl [&_h3]:text-on-surface [&_h3]:mt-8 [&_h3]:mb-3
            [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6
            [&_a]:text-primary [&_a]:underline [&_strong]:text-on-surface"
          >
            <ReactMarkdown>{active.content}</ReactMarkdown>
          </div>
        </article>

        {related.length > 0 && (
          <section className="bg-surface-container-low py-24">
            <div className="max-w-7xl mx-auto px-8">
              <div className="flex justify-between items-end mb-16">
                <div>
                  <h4 className="font-label text-xs uppercase tracking-widest text-primary font-bold mb-4">
                    More from the journal
                  </h4>
                  <h2 className="text-5xl font-headline">Related</h2>
                </div>
                <Link
                  href="/journal"
                  className="font-label text-sm font-bold uppercase tracking-widest border-b-2 border-primary pb-2 hover:text-primary transition-colors"
                >
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {related.map((r) => (
                  <Link key={r.id} href={`/journal/${r.slug}`} className="group block">
                    <div className="aspect-[4/5] overflow-hidden mb-6 bg-surface-container-high relative">
                      {r.coverImage ? (
                        <Image
                          src={r.coverImage}
                          alt={r.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-surface-container to-primary-container/20" />
                      )}
                    </div>
                    <span className="font-label text-[10px] uppercase tracking-widest text-primary mb-3 block">
                      {r.tags[0] ?? "Journal"}
                    </span>
                    <h3 className="text-2xl font-headline leading-tight group-hover:text-primary transition-colors">
                      {r.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
