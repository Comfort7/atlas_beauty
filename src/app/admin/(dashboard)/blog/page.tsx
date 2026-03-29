import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeletePostButton from "./DeletePostButton";

async function getPosts() {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true, email: true } },
    },
  });
}

const statusColors: Record<string, string> = {
  PUBLISHED: "bg-primary-container/30 text-primary",
  DRAFT: "bg-surface-container text-on-surface-variant",
  ARCHIVED: "bg-error-container/30 text-error",
};

export default async function AdminBlogPage() {
  const posts = await getPosts();

  return (
    <>
      <header className="bg-surface border-b border-outline-variant/20 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="font-headline text-2xl text-on-surface">Blog Posts</h1>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-0.5">
            {posts.length} post{posts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-lg text-sm font-bold hover:brightness-110 transition-all"
        >
          <span className="material-symbols-outlined text-sm">edit_note</span>
          Write Post
        </Link>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        {posts.length === 0 ? (
          <div className="bg-surface rounded-xl border border-outline-variant/20 p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 block mb-4">
              article
            </span>
            <h2 className="font-headline text-2xl text-on-surface mb-2">No posts yet</h2>
            <p className="text-on-surface-variant text-sm mb-6">
              Write your first journal article to populate the blog.
            </p>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg text-sm font-bold hover:brightness-110 transition-all"
            >
              <span className="material-symbols-outlined text-sm">edit_note</span>
              Write First Post
            </Link>
          </div>
        ) : (
          <div className="bg-surface rounded-xl border border-outline-variant/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                    {["Title", "Author", "Tags", "Status", "Date", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-sm font-bold text-on-surface truncate">{post.title}</p>
                        {post.excerpt && (
                          <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                            {post.excerpt}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">
                        {post.author.name || post.author.email}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 text-[10px] bg-surface-container rounded text-on-surface-variant"
                            >
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-[10px] text-on-surface-variant">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                            statusColors[post.status] ?? "bg-surface-container text-on-surface-variant"
                          }`}
                        >
                          {post.status.charAt(0) + post.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant whitespace-nowrap">
                        {new Date(post.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {post.status === "PUBLISHED" && (
                            <Link
                              href={`/journal/${post.slug}`}
                              className="text-on-surface-variant hover:text-primary transition-colors"
                              title="View live"
                              target="_blank"
                            >
                              <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </Link>
                          )}
                          <DeletePostButton postId={post.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
