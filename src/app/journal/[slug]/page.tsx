import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const relatedArticles = [
  {
    tag: "Fragrance Archeology",
    title: "Scent as Memory: The Science of Olfactory Recall",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLpMmj4ZJUtGxVuAtFxqBu9yp21Nlh2yQAT5jSrpfHApEbSkSJe34n9cm-nHS-uNU-fNNGwptxdtHLlqGsR4sn-DOaGcNjlTK48NK1ORiZ70xJn9JlhbUPbVpi4nINs0dpVKNWC8BNs5ZlmjLDrsIycBqDwxSrm3qZZf1S_lhcD41RH09UDnzMXriGm2cxBKC1J6VLdSRV2esyr-bRypKvXLL7N-UJepye26Y4GDW4GR5GfrnN2JgUdioKRjKUs1yANW-azFgPLBbn",
    alt: "Essential oil bottles on white textured surface",
  },
  {
    tag: "Interiors",
    title: "Designing Serenity: The Architecture of the Home Spa",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDswZgxMRmIql2EWn3-Zfj9c5hIIcYEnRsE1roqM0atY6A5cXLu2k991EJkG-WHGg7HA2lFXcJcW0LCjlm5HOA4SRVjdFCUa_laScnIKTlf8yd9YYVgYjIExRjj9gSGP1ewg2tuyLhBTJqzlH5nrkTpuVqTInTxQZ2ojVAxWFUzF0mQzKAMPUsMAr-wjVMwpk_G5Zjl04IkusuEUcBwd9gH4Unzc-ignGDGZcchTheHfQ33eCqMPfKEohmkqYA7r1An2GfoWxWpH6nI",
    alt: "High-end interior spa with natural materials",
  },
  {
    tag: "Innovation",
    title: "Molecular Bonding: Why Viscosity Matters",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBemUB6lrijBhDBfOIdD7UskScgV-wQsJy5aOS2CQGG2nN0ns-8RUAqtQZnjRrvZCRL21RI4pNgZPQ3URHYlFL38An674DK-zoQvlAh1Ynw38XStzGZOtL9DaYsDTfnXAR0M3QYeFHGa2KQUCitsGKn844aI0OTt9iPYqGKe9wyQS7G2OhLxgWTHcwngOM7U-xEl7BtZu_H7jqBDibFro2XsOU8hOhADrTwQYZT5WGfOO5i4hwwcAqjaU9RIfARLoAumZSxINY_oXeo",
    alt: "Smooth cream texture with peaks and valleys",
  },
];

export default function JournalArticlePage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 lg:pt-32">
        {/* Editorial Hero */}
        <header className="max-w-7xl mx-auto px-8 mb-16 lg:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7">
              <div className="mb-8">
                <span className="font-label text-xs uppercase tracking-[0.3em] text-primary font-bold">
                  Scientific Inquiry &amp; Ritual
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl xl:text-8xl leading-tight font-headline text-on-background mb-8">
                The Architecture of Radiance:{" "}
                <span className="italic font-normal">A Guide to Cold Water Therapy</span>
              </h1>
            </div>
            <div className="lg:col-span-5 pb-4">
              <p className="font-body text-lg text-on-surface-variant leading-relaxed max-w-md ml-auto text-right">
                In an era of hyper-synthetic innovation, we return to the elemental. Discover how the
                molecular precision of cold exposure reconstructs skin vitality from the core.
              </p>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <section className="w-full h-[600px] relative overflow-hidden bg-primary-container">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX8NchmzbbX_FuQ-vY-WZsgNS6KGGRWSdOM9wnFSwhUDItfVCXsJKdaDnCqDYtE1bsgukd4WpIJ8LlqM4Dm1fpflf_CzEthy_UcJVotI0Z4OvNtCwr0ubeOsdKnwLDB-Yrf8kYVySKhJOfgSSLjrkVRyIJNQ78sQti-b7nqRY55AODdBAz3FuHJxFYBdM7-MqoeJ3sS9vTYV_be9vtWmFG6naS41KSsfQgT2shT6ZpPhQvRFjFUGc9ZLz5GI2MPrdJZEoNtaSmh9Xt"
            alt="Crystal clear water splashing with ethereal lighting"
            fill
            className="object-cover mix-blend-multiply opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent" />
          <div className="absolute bottom-12 left-12 bg-white/10 backdrop-blur-md p-6 rounded-lg max-w-xs border border-white/20">
            <p className="text-white font-label text-sm uppercase tracking-widest leading-relaxed">
              Captured at the Atlas Hydro-Labs, Geneva. Research Study 402.
            </p>
          </div>
        </section>

        {/* Article Body */}
        <article className="max-w-7xl mx-auto px-8 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sidebar */}
          <aside className="lg:col-span-3 order-2 lg:order-1">
            <div className="lg:sticky lg:top-32 space-y-12">
              <div className="space-y-4">
                <h4 className="font-label text-xs uppercase tracking-widest text-primary font-bold">Author</h4>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high relative flex-shrink-0">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCy5vEvf_6_f1OLuHKSIGT0EGN-iAyFlgJuGRNHd_OjLTFo7Os_3289yq4fKZifqir-8wC1p5GFYKY8s6n2O85gO1MXQXGwCbIVVLWvdSevGyt8bn5G0YN4MC8wtwMdbttkgKvJukWTg2lJcoaS55AECBqQysWUz_hUkOW00F9bNM2-_FqpoPFe70pYVny4xi5kgcig-CmoU4jUnrvYKjzTM8K4HmqaMkSGmx-AxvQD6BqcWpUZvlUcg8Kuzw4vOQ7Dy9aDaRAne78b"
                      alt="Dr. Elena Vance"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-headline font-bold text-sm">Dr. Elena Vance</p>
                    <p className="font-body text-xs text-on-surface-variant">Director of Biological Research</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-label text-xs uppercase tracking-widest text-primary font-bold">Reading Time</h4>
                <p className="font-body text-sm">08 Minutes</p>
              </div>
              <div className="space-y-3">
                <h4 className="font-label text-xs uppercase tracking-widest text-primary font-bold">Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {["Longevity", "Cryo-Biology", "Cellular Health"].map((t) => (
                    <span key={t} className="px-3 py-1 bg-surface-container text-[10px] uppercase font-bold tracking-wider rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-7 space-y-12 order-1 lg:order-2">
            <section className="space-y-6">
              <p className="font-headline text-3xl italic leading-relaxed text-primary">
                &ldquo;The skin is not merely a barrier, but a responsive landscape. Cold is the architect
                that forces its structural recalibration.&rdquo;
              </p>
              <div className="font-body text-lg leading-[1.8] text-on-surface-variant space-y-8">
                <p>
                  For centuries, the ritual of hydrotherapy has been whispered through the corridors of
                  traditional medicine. Today, at Atlas Beauty, we quantify these whispers through the
                  lens of cryo-biology. The &lsquo;Architecture of Radiance&rsquo; is built upon the body&apos;s
                  innate response to thermal shock — a process known as hormesis.
                </p>
                <p>
                  When the skin encounters water at precise temperatures (below 14°C), a cascade of
                  physiological events is triggered. Micro-circulation is instantly accelerated, not
                  through external friction, but through internal vascular constriction and subsequent
                  dilation. This &lsquo;pumping&rsquo; action flushes metabolic waste and delivers a surge of
                  oxygenated blood to the dermis.
                </p>
              </div>
            </section>

            {/* Phase I */}
            <section className="py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="bg-surface-container-low p-12 aspect-square flex flex-col justify-center">
                <h3 className="text-3xl font-headline mb-6">Phase I: <br />Vascular Awakening</h3>
                <p className="font-body text-sm text-on-surface-variant leading-loose">
                  Upon initial contact, the sympathetic nervous system initiates a rapid vasoconstriction.
                  This immediate response preserves core heat while simultaneously &lsquo;tightening&rsquo; the
                  epidermal matrix.
                </p>
              </div>
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuChZ-1JTNHErKirnl6KCX6fSPJ_1xvv_S0i5Mp4vymxU_Ql2VK8_BdJF4OjjWY8ImDinGsmbveT3wrvfOhGLYQ6yLHZalnDlNJOyJKcz87rXAnTz4V00IWszowSfwyhYvFPoN5aVrAAwzOkqxS2ftAOxNYO86MbqD18N9wS7vdJRf0RCoZhz2Iy2HUnc1vxcRffb_asCWdjif9PLpKUJKCm8FRUFhXkQ7n6yKIrY8KtG313U5vUJ84jor4WyOCkef9CuItFnhr8L2_f"
                  alt="Ice cubes in water on a minimalist marble surface"
                  fill
                  className="object-cover"
                />
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-4xl font-headline">The Atlas Protocol</h2>
              <div className="font-body text-lg leading-[1.8] text-on-surface-variant space-y-6">
                <p>
                  To achieve clinical-grade results at home, we recommend the 3:1 ratio. Begin with three
                  minutes of tepid water to relax the pores, followed by one minute of focused cold
                  exposure. Target the clavicle and the jawline — areas rich in lymph nodes — to maximize
                  drainage and sculpting effects.
                </p>
                <p>
                  The result is a complexion that doesn&apos;t just look healthy but functions at a higher
                  metabolic rate. This is the foundation of the Atlas Beauty philosophy: professional
                  precision meeting elemental serenity.
                </p>
              </div>
            </section>
          </div>

          {/* Social Share */}
          <div className="lg:col-span-2 hidden lg:flex order-3 justify-center">
            <div className="sticky top-32 flex flex-col gap-6 items-center">
              <div className="w-px h-16 bg-outline-variant" />
              {["share", "bookmark", "favorite"].map((icon) => (
                <button key={icon} className="text-outline hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">{icon}</span>
                </button>
              ))}
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <section className="bg-surface-container-low py-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h4 className="font-label text-xs uppercase tracking-widest text-primary font-bold mb-4">
                  Curated Narratives
                </h4>
                <h2 className="text-5xl font-headline">Related Rituals</h2>
              </div>
              <Link
                href="/journal"
                className="font-label text-sm font-bold uppercase tracking-widest border-b-2 border-primary pb-2 hover:text-primary transition-colors"
              >
                View All Journal Entries
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((article, i) => (
                <div key={article.title} className={`group cursor-pointer ${i > 0 ? "mt-12 md:mt-0" : ""}`}>
                  <div className="aspect-[4/5] overflow-hidden mb-6 bg-surface-container-high relative">
                    <Image
                      src={article.image}
                      alt={article.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <span className="font-label text-[10px] uppercase tracking-widest text-primary mb-3 block">
                    {article.tag}
                  </span>
                  <h3 className="text-2xl font-headline leading-tight group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
