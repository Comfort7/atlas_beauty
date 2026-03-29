import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function FragrancePage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-8">
          <header className="mb-20">
            <span className="font-label text-xs uppercase tracking-[0.2em] text-primary font-bold">
              Curated Collection
            </span>
            <h1 className="font-headline text-5xl md:text-7xl text-on-surface tracking-tighter leading-tight mt-4">
              Fragrance.
            </h1>
            <p className="mt-6 text-on-surface-variant font-body text-lg leading-relaxed max-w-xl">
              An olfactory atlas of rare botanical extracts, engineered into architectural scent profiles
              that evolve with the warmth of your skin.
            </p>
          </header>

          {/* Coming Soon State */}
          <div className="flex flex-col items-center justify-center py-32 text-center bg-surface-container-low rounded-lg">
            <span className="material-symbols-outlined text-primary-container text-7xl mb-8 opacity-60">
              local_florist
            </span>
            <h2 className="font-headline text-4xl text-on-surface mb-4">
              Collection Arriving Soon
            </h2>
            <p className="font-body text-on-surface-variant max-w-md leading-relaxed mb-10">
              Our fragrance curators are finalising an extraordinary edit of global scents. Be the first
              to know when they land.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/skincare"
                className="bg-primary text-on-primary px-8 py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:scale-95 transition-transform font-body"
              >
                Explore Skincare
              </Link>
              <Link
                href="/journal"
                className="border-b-2 border-primary text-primary px-8 py-4 font-bold text-sm uppercase tracking-widest hover:border-opacity-50 transition-all font-body"
              >
                Read the Journal
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
