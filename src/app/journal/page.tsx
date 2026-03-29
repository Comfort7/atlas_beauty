import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const articles = [
  {
    slug: "architecture-of-radiance",
    tag: "Science & Art",
    title: "The Architecture of Radiance: A Guide to Cold Water Therapy",
    excerpt: "In an era of hyper-synthetic innovation, we return to the elemental. Discover how cold exposure reconstructs skin vitality from the core.",
    readTime: "8 min",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAX8NchmzbbX_FuQ-vY-WZsgNS6KGGRWSdOM9wnFSwhUDItfVCXsJKdaDnCqDYtE1bsgukd4WpIJ8LlqM4Dm1fpflf_CzEthy_UcJVotI0Z4OvNtCwr0ubeOsdKnwLDB-Yrf8kYVySKhJOfgSSLjrkVRyIJNQ78sQti-b7nqRY55AODdBAz3FuHJxFYBdM7-MqoeJ3sS9vTYV_be9vtWmFG6naS41KSsfQgT2shT6ZpPhQvRFjFUGc9ZLz5GI2MPrdJZEoNtaSmh9Xt",
  },
  {
    slug: "molecular-structure-of-serums",
    tag: "Science & Art",
    title: "The Molecular Structure of Serums",
    excerpt: "Understanding how architectural density in formulations affects ingredient absorption and long-term efficacy.",
    readTime: "6 min",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA24X0w8mN-fIJ7F8ZAxQe1bXxyf7Ci0Kayt9jkbAaDkd-p355yZip0z5ylqA4Yt0pm5wUdGgDLYu99N_mB7ou6xPDKKx6O7VN-v_6lDqzu_-DovdNvT56zqM82xk_DIkMPCGHiEkyMig_R6GUmoVC-p6iTYKsW8DUvSyHSDGjB124vYz0YVGBQnbIiCnr76fgnv2ae9JVhph52CrW-0qog7u18VxjW_ufD1mCcVvoMvlJVwJM-XEUeQg18KOLxbbrih7Uoe09JUJ_4",
  },
  {
    slug: "architectural-spaces-for-wellness",
    tag: "Curation",
    title: "Architectural Spaces for Wellness",
    excerpt: "Designing your personal environment to enhance the efficacy of your skincare rituals and daily wellbeing practice.",
    readTime: "5 min",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAv0FjguIprOun6vwWiATOBTnItxpLGY4Jv0oTCP1Ql54b-ycfyFGV-kn8fMNfSXfGKZ_KnggAeEWg7FPf10J7WrwUriBNTcN-3DOexIMokqxHIXmovX_xfXktFKSGEQRBV7VyllmBe2m44TxOPNKmNhWJ0iCw2qd4dcJSk_xKDQQa013ktitVm4YQH46ncoW6D0AtEsou1hRz1XZo7ZaLDDJ9en_s_1Jnq1B9BqjNQ3RoDqaWy_QJV-jpL4075OrcVX0ZjCKyYVv-7",
  },
];

export default function JournalPage() {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {articles.map((article, i) => (
            <Link key={article.slug} href={`/journal/${article.slug}`} className="group block">
              <div
                className="relative overflow-hidden mb-6 bg-surface-container-low"
                style={{ aspectRatio: i === 0 ? "16/10" : "4/5" }}
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <span className="font-label text-[10px] uppercase tracking-widest text-primary font-bold mb-3 block">
                {article.tag} · {article.readTime} read
              </span>
              <h2 className="font-headline text-2xl md:text-3xl leading-tight group-hover:text-primary transition-colors mb-3">
                {article.title}
              </h2>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">{article.excerpt}</p>
              <span className="mt-6 inline-block font-bold text-xs uppercase border-b border-primary text-primary pb-1">
                Read Article
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
