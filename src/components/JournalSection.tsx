import Image from "next/image";

const articles = [
  {
    tag: "Science & Art",
    title: "The Molecular Structure of Serums",
    excerpt:
      "Understanding how architectural density in formulations affects ingredient absorption...",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA24X0w8mN-fIJ7F8ZAxQe1bXxyf7Ci0Kayt9jkbAaDkd-p355yZip0z5ylqA4Yt0pm5wUdGgDLYu99N_mB7ou6xPDKKx6O7VN-v_6lDqzu_-DovdNvT56zqM82xk_DIkMPCGHiEkyMig_R6GUmoVC-p6iTYKsW8DUvSyHSDGjB124vYz0YVGBQnbIiCnr76fgnv2ae9JVhph52CrW-0qog7u18VxjW_ufD1mCcVvoMvlJVwJM-XEUeQg18KOLxbbrih7Uoe09JUJ_4",
    alt: "Abstract architectural shadows and light on a concrete wall",
  },
  {
    tag: "Rituals",
    title: "The Serenity of Cold Water Therapy",
    excerpt:
      "Exploring the ancient benefits of temperature shifts in modern skincare regimes...",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDcfUkdOnNV_mu_ha0t5aMXikXoLQztYTM2xi5_tiA4UPYqYRNYA2S0ciMWF6CImeGnLVVD3Vpub0E0BTXPLsJ0aGgQeNZ_tGlPuAj_XE-mrNet1azBOihIlKs2N83bSmNES3i5VGnWgUah0mmVgxKEgu50TkSeIOHhZYdS-vLPZJkgrj3H1LA1mnXhgCR73VwBx2A_RsGxKOuoFxKZpH5MpqWUmFlC57II6N_X2nTlQRuY53MyE4U_eQ6sZGR9z5X6x5QRMBeLOKiQ",
    alt: "Clear water in a crystal bowl with blue reflections and a dropper",
  },
  {
    tag: "Curation",
    title: "Architectural Spaces for Wellness",
    excerpt:
      "Designing your personal environment to enhance the efficacy of your rituals...",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAv0FjguIprOun6vwWiATOBTnItxpLGY4Jv0oTCP1Ql54b-ycfyFGV-kn8fMNfSXfGKZ_KnggAeEWg7FPf10J7WrwUriBNTcN-3DOexIMokqxHIXmovX_xfXktFKSGEQRBV7VyllmBe2m44TxOPNKmNhWJ0iCw2qd4dcJSk_xKDQQa013ktitVm4YQH46ncoW6D0AtEsou1hRz1XZo7ZaLDDJ9en_s_1Jnq1B9BqjNQ3RoDqaWy_QJV-jpL4075OrcVX0ZjCKyYVv-7",
    alt: "Minimalist interior with a single chair and soft blue window light",
  },
];

export default function JournalSection() {
  return (
    <section className="py-24 px-8 md:px-16 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="font-body text-sm uppercase tracking-widest text-primary font-bold">
          Reflections
        </span>
        <h2 className="text-4xl font-headline mt-2">The Atlas Journal</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {articles.map((article) => (
          <article key={article.title} className="group cursor-pointer">
            <div className="aspect-[16/10] bg-surface-container-low rounded-lg overflow-hidden mb-6 relative">
              <Image
                src={article.image}
                alt={article.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <span className="font-body text-xs uppercase text-on-surface-variant font-bold tracking-widest">
              {article.tag}
            </span>
            <h3 className="font-headline text-2xl mt-2 mb-4 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              {article.excerpt}
            </p>
            <button className="mt-6 font-bold text-xs uppercase border-b border-primary text-primary pb-1 hover:opacity-70 transition-opacity">
              Read Article
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
