import { prisma } from "@/lib/prisma";
import ReviewModerationCard from "./ReviewModerationCard";

async function getPendingReviews() {
  return prisma.review.findMany({
    where: { status: "PENDING" },
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminReviewsPage() {
  const reviews = await getPendingReviews();

  return (
    <>
      <header className="bg-surface border-b border-outline-variant/20 px-8 py-4 sticky top-0 z-20">
        <h1 className="font-headline text-2xl text-on-surface">Reviews</h1>
        <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-0.5">
          {reviews.length} awaiting moderation
        </p>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        {reviews.length === 0 ? (
          <div className="bg-surface rounded-xl border border-outline-variant/20 p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 block mb-4">
              rate_review
            </span>
            <h2 className="font-headline text-xl text-on-surface mb-2">All caught up</h2>
            <p className="text-on-surface-variant text-sm">
              No reviews are waiting for moderation right now.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl space-y-4">
            {reviews.map((review) => (
              <ReviewModerationCard
                key={review.id}
                review={{
                  id: review.id,
                  rating: review.rating,
                  title: review.title,
                  body: review.body,
                  verifiedPurchase: review.verifiedPurchase,
                  createdAt: review.createdAt.toISOString(),
                  userName: review.user.name,
                  userEmail: review.user.email,
                  productName: review.product.name,
                  productSlug: review.product.slug,
                }}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
