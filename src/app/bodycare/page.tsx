import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopByBrand from "@/components/ShopByBrand";

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
];

const bodyCategories: { label: string; count: number; href: string; active?: boolean }[] = [
  { label: "All body care", count: 86, active: true, href: "/bodycare" },
  { label: "Lotion", count: 22, href: "/shop?category=body-lotion" },
  { label: "Scrub", count: 14, href: "/shop?category=body-scrub" },
  { label: "Soap", count: 11, href: "/shop?category=body-soap" },
  { label: "Wash", count: 18, href: "/shop?category=body-wash" },
  { label: "Gel", count: 21, href: "/shop?category=body-gel" },
];

export default function BodyCarePage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 max-w-7xl mx-auto px-8">
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="font-headline text-5xl md:text-7xl text-on-surface tracking-tighter leading-tight">
                Body<br />Care.
              </h1>
              <p className="mt-6 text-on-surface-variant font-body text-lg leading-relaxed">
                Texture, scent, and ritual—body formulas engineered with the same Atlas standard as our
                skincare edit.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-label uppercase tracking-widest text-on-surface-variant">
              <span>Showing curated preview</span>
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-12">
          <aside className="w-full md:w-64 flex-shrink-0 space-y-12">
            <div>
              <h3 className="font-headline text-lg mb-6 text-on-surface">Subcategory</h3>
              <ul className="space-y-4 text-sm">
                {bodyCategories.map((cat) => {
                  const inner = (
                    <>
                      <span className={cat.active ? "text-primary font-bold" : "text-on-surface-variant"}>
                        {cat.label}
                      </span>
                      <span className="text-xs text-on-surface-variant opacity-50">{cat.count}</span>
                    </>
                  );
                  return (
                    <li key={cat.label} className="flex justify-between items-center hover:text-primary transition-colors">
                      <Link href={cat.href} className="flex w-full justify-between items-center">
                        {inner}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <ShopByBrand />

            <div>
              <h3 className="font-headline text-lg mb-6 text-on-surface">Price Range</h3>
              <div className="px-2">
                <div className="h-1 bg-surface-container-high relative rounded-full mb-6">
                  <div className="absolute left-0 right-1/3 h-full bg-primary rounded-full" />
                  <div className="absolute left-0 -top-1 w-3 h-3 bg-primary rounded-full shadow-sm cursor-pointer" />
                  <div className="absolute right-1/3 -top-1 w-3 h-3 bg-primary rounded-full shadow-sm cursor-pointer" />
                </div>
                <div className="flex justify-between text-xs font-medium text-on-surface-variant">
                  <span>$15</span>
                  <span>$180+</span>
                </div>
              </div>
            </div>
          </aside>

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
                      <div
                        className={`absolute top-4 left-4 px-3 py-1 text-[10px] font-bold tracking-widest uppercase ${product.badgeStyle}`}
                      >
                        {product.badge}
                      </div>
                    )}
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
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
