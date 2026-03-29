import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const products = [
  {
    slug: "celestial-reset-serum",
    name: "Celestial Reset Serum",
    subtitle: "Hyaluronic Acid & B5 Complex",
    price: "$84.00",
    size: "30ml",
    badge: "Best Seller",
    badgeStyle: "bg-primary text-on-primary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwyEoNbCtbtSxq-lqKzaB8SB-rfNMBB24_llV4bQlCBlMwgvrNwVP_HPqNuVJjnSR86iURC1fgA12MOBYzxm9kVDfppH5kbCMx65TZ7KFVMblIgHI1xmswdO1wJgG2UiQ2cyo_-jtt76laaKSwm5tPDjnCGO8Fii4NS22KovD0WCwOSyPsW9SSbqLnRnYQI0MVZs7jHs5Qduev_qiQQTR7LHgv-wgww2sfrYKkJtea-ysEcC55NtOd1QkZ3zKH5EPkMY-AIcW58rRH",
    alt: "Minimalist glass serum bottle on a light blue marble block",
  },
  {
    slug: "tidal-essence-toner",
    name: "Tidal Essence Toner",
    subtitle: "Marine Algae & Sea Silt",
    price: "$62.00",
    size: "150ml",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB0_h6MieZ7JbGkffyd0NX11zEmhKvzpKeIAD2mLAW4d5aLJi0_KazkHQa4yeyMjKBeYIcIGBG9t0Vug1dBGve4YDmD1phQkTq4fkn6WxyKGnt1ZX8MvQc-_hS_M2ZNMzaPZk8oGtK26nrjok6KpailgEf3i8UixpV2iA2KAMBe2GvWUqesQGpOiKzVoZjn7xZzwp0zSM36Xs38zHj1l26EzIeLf7Uw_LG_acnwn3V8Jd95uAq6VM5nl-rZBurveAqCTg6cJEJ9qs41",
    alt: "Tall frosted glass toner bottle on a reflective black surface",
  },
  {
    slug: "architectural-day-cream",
    name: "Architectural Day Cream",
    subtitle: "Ceramides & Peptides",
    price: "$110.00",
    size: "50ml",
    badge: "New Arrival",
    badgeStyle: "bg-secondary-container text-on-secondary-container",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjurLL2RcXTHp8FjbCUMhVLa23Bh5UfCvvHjsRZE7tgok1QSpM1EOY6zrs4mD_jc8-nqrI0JhVJBvF36ox7Mw3JgT8BL6IHSUSQmD7t6C189squY1xswb2su3hshiN6LGIY2ZJ9Op9IujnzdNwoEaPfcjdMtBvBl3JfwdL03YaUCWGYmN870WFFBlnvmkmFwgn4PA8C3VCHg1XlT68biIr7SsnBCZgLrvOIvEcHsApboOVHPh1TuEN7OGYgDeP5uOcAIu38868b5Km",
    alt: "White cream jar on a concrete sculptural base with dramatic shadows",
  },
  {
    slug: "pure-void-cleanser",
    name: "Pure Void Cleanser",
    subtitle: "pH Balanced Enzyme Gel",
    price: "$48.00",
    size: "200ml",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAqkqfrTe59-o8tAlBPEV4XO0LfMM1_VNujQdMFnC3RgjLH3i0x9SBXzw6wRV3fuCpiJjnSI0lnxNvFnTsNTtfRz0YyV-1MkHtfom_Z7fgnRPEg476h4OSM-nziKyKa09bu-nzAZuUD-04Y9KKzAywuA8yqqSDEl0mf-Mokr85PZtuFsACQeeywEpaWhyFwq8Nk6liV8r1BW7w_Ly5RZ_-woApiJGgf50QI_SM1C_xDOcYpQxqTLheu2HG7lN32gaQ_FA3dmCfOxNXI",
    alt: "Liquid cleanser with air bubbles on a cool blue lit surface",
  },
  {
    slug: "horizon-eye-balm",
    name: "Horizon Eye Balm",
    subtitle: "Retinol Alternative & Caffeine",
    price: "$74.00",
    size: "15ml",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCK-VwuTLu7iMyUMSzKM0V_fSi0vchbyzJwwFPPl_zjxuV77-Ez_S2iv7B7x0lw8AWDz3v21b6Wxbs5A4QqcE3llKTvomV70hZfHPsHKHLZOsNewcRK0h2y4cF__p7ChKQqsgN81OfVfEy7kH6yEs_xWxSLO7-dbuFzB9e61IKwDWnSe0fd1zkeL7_nQPI1RCGQJSRQj50270hZdPzLwhJ9AQ53oDXILK8sOKyMDBLlQwcceqal4u04vgDeV3c-l7PGIxWJ-zk8Husk",
    alt: "Small amber eye cream jar next to a geometric acrylic cube",
  },
  {
    slug: "atlas-protocol-kit",
    name: "The Atlas Protocol Kit",
    subtitle: "4-Step Essential Discovery Set",
    price: "$185.00",
    size: "Set",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDgW7yjWxxIwkDH3qZ59NRoPvNfFY3bO1Bw_uqfH-_a-h_mDukdHhDevLb9sEM3_plKSpus_F3rBxwINLQADEUTMRjweQUMKMXwyLw60_cSGo7QcUWjWtSQpdK-gUyxmr2vi4UOaMQCtS7DWRVZnyD7NyYmMPIBV7-fXIjUzHiJx2jHJEh8ePMKqShk7pZ7UAOszjKP5q8ivDnoNrkGPCHccn584cJs85nQHXk0ydsi4x1oZXXSqioiqjXkUY_6jiQ5wtQ54UI37nw1",
    alt: "Minimalist skincare bottles arranged by height on a marble display",
  },
];

const categories = [
  { label: "All Products", count: 142, active: true },
  { label: "Cleansers", count: 18 },
  { label: "Serums & Oils", count: 34 },
  { label: "Moisturizers", count: 22 },
  { label: "Eye Care", count: 12 },
];

const concerns = ["Hydration", "Anti-Aging", "Blemishes", "Brightness", "Sensitivity"];

export default function SkincareePage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 max-w-7xl mx-auto px-8">
        {/* Hero Header */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="font-headline text-5xl md:text-7xl text-on-surface tracking-tighter leading-tight">
                Advanced<br />Skincare.
              </h1>
              <p className="mt-6 text-on-surface-variant font-body text-lg leading-relaxed">
                A curated collection of professional-grade formulas designed for
                architectural precision in skin health. Discover the Atlas methodology.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-label uppercase tracking-widest text-on-surface-variant">
              <span>Showing 24 of 142 Results</span>
              <div className="h-px w-12 bg-outline-variant" />
              <button className="flex items-center gap-2 font-bold text-primary">
                Sort By: Newest{" "}
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0 space-y-12">
            {/* Category */}
            <div>
              <h3 className="font-headline text-lg mb-6 text-on-surface">Category</h3>
              <ul className="space-y-4 text-sm">
                {categories.map((cat) => (
                  <li
                    key={cat.label}
                    className="flex justify-between items-center cursor-pointer hover:text-primary transition-colors"
                  >
                    <span className={cat.active ? "text-primary font-bold" : "text-on-surface-variant"}>
                      {cat.label}
                    </span>
                    <span className="text-xs text-on-surface-variant opacity-50">{cat.count}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skin Concern */}
            <div>
              <h3 className="font-headline text-lg mb-6 text-on-surface">Skin Concern</h3>
              <div className="flex flex-wrap gap-2">
                {concerns.map((concern, i) => (
                  <span
                    key={concern}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-colors ${
                      i === 0
                        ? "bg-primary-container text-on-primary-container"
                        : "bg-secondary-container text-on-secondary-container hover:bg-primary-container hover:text-on-primary-container"
                    }`}
                  >
                    {concern}
                  </span>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-headline text-lg mb-6 text-on-surface">Price Range</h3>
              <div className="px-2">
                <div className="h-1 bg-surface-container-high relative rounded-full mb-6">
                  <div className="absolute left-0 right-1/4 h-full bg-primary rounded-full" />
                  <div className="absolute left-0 -top-1 w-3 h-3 bg-primary rounded-full shadow-sm cursor-pointer" />
                  <div className="absolute right-1/4 -top-1 w-3 h-3 bg-primary rounded-full shadow-sm cursor-pointer" />
                </div>
                <div className="flex justify-between text-xs font-medium text-on-surface-variant">
                  <span>$20</span>
                  <span>$250+</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {products.map((product) => (
                <Link href={`/products/${product.slug}`} key={product.slug} className="group block">
                  <div className="relative aspect-[3/4] bg-surface-container-low overflow-hidden mb-4">
                    <Image
                      src={product.image}
                      alt={product.alt}
                      fill
                      className="object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                    />
                    {product.badge && (
                      <div className={`absolute top-4 left-4 px-3 py-1 text-[10px] font-bold tracking-widest uppercase ${product.badgeStyle}`}>
                        {product.badge}
                      </div>
                    )}
                    <button className="absolute bottom-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <span className="material-symbols-outlined text-primary text-sm">add_shopping_cart</span>
                    </button>
                  </div>
                  <h4 className="font-headline text-xl text-on-surface mb-1">{product.name}</h4>
                  <p className="text-on-surface-variant text-sm mb-3">{product.subtitle}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-bold">{product.price}</span>
                    <span className="h-px w-4 bg-outline-variant" />
                    <span className="text-[10px] uppercase tracking-tighter text-on-surface-variant font-bold">
                      {product.size}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-20 flex justify-center items-center gap-4">
              <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                      page === 1
                        ? "bg-primary text-on-primary font-bold"
                        : "text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <span className="px-2 text-on-surface-variant">...</span>
                <button className="w-10 h-10 rounded-full text-on-surface-variant font-medium text-sm hover:bg-surface-container transition-colors">
                  12
                </button>
              </div>
              <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
