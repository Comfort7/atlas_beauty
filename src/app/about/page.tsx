import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative min-h-[921px] flex items-center overflow-hidden bg-surface">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-container-low" />
          <div className="grid grid-cols-1 md:grid-cols-12 w-full max-w-7xl mx-auto px-8 relative z-10 gap-12 items-center">
            <div className="md:col-span-7 flex flex-col justify-center">
              <span className="text-primary font-label text-xs uppercase tracking-[0.3em] mb-6 block">
                The Atlas Philosophy
              </span>
              <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl text-on-background leading-tight mb-8">
                Beauty <br />
                <span className="ml-12 md:ml-24 italic font-light text-primary">in motion</span>
              </h1>
              <div className="max-w-md ml-auto md:mr-12">
                <p className="text-on-surface-variant text-lg leading-relaxed">
                  Discover a curated world where elegance meets movement. Atlas Beauty is more than a
                  destination; it&apos;s a rhythmic celebration of self.
                </p>
              </div>
            </div>
            <div className="md:col-span-5 relative mt-12 md:mt-0">
              <div className="aspect-[3/4] w-full bg-primary-container overflow-hidden rounded-lg shadow-2xl relative translate-y-12">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsQEuQP_eC7haKq7YAvH9YBkUydftwu9c2y9EHzKonijb7e7mvntTFhTXri8WEP3v8Upu5zJc0Xoi1b1UPfoOWw-W0Lu-vC3eoFNva5ZVr3xntWlszwQ-SiJ6NpX19F6c6Y2uUPywOEgfqXwiWxFwMklLcj7MmjlNMPKNACwmBwvDT8xwz5fv__JpyLDRVzG14AmQRzUyAzwWz-9HqE7t6wY-6xNVDuN6wwEzPz5eobLvb28mbIn6DA4srbzp8ek_w3FaTsr60mrjm"
                  alt="High-fashion model with luminous skin in soft cool studio light"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-surface-container-low p-4 rounded-lg hidden lg:flex items-center justify-center">
                <div className="w-full h-full border border-outline-variant flex items-center justify-center p-6 text-center">
                  <span className="font-headline text-sm italic">Curating Global Excellence</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="py-32 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <h2 className="font-headline text-4xl text-primary md:sticky md:top-32">Our Vision</h2>
            </div>
            <div className="md:col-span-8">
              <blockquote className="font-headline text-3xl md:text-5xl text-on-background leading-snug border-l-4 border-primary-container pl-8 md:pl-16 py-4">
                &ldquo;To build a global beauty community where authenticity thrives, individuality is
                celebrated, and everyone feels empowered to own their beauty unapologetically.&rdquo;
              </blockquote>
              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                {[
                  { icon: "public", title: "Global Reach", desc: "Connecting diverse beauty traditions and innovations from across the continents into one seamless experience." },
                  { icon: "auto_awesome", title: "Authentic Choice", desc: "Prioritizing real results and honest representation over fleeting industry trends and filters." },
                ].map((c) => (
                  <div key={c.title} className="bg-surface-container-lowest p-10 rounded-lg shadow-sm">
                    <span className="material-symbols-outlined text-primary-container mb-6 text-5xl block">{c.icon}</span>
                    <h3 className="font-headline text-xl mb-4">{c.title}</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-32 bg-background overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 items-center gap-16">
            <div className="md:col-span-6 relative z-10">
              <span className="text-primary font-label text-xs uppercase tracking-widest">The Atlas Mission</span>
              <h2 className="font-headline text-5xl mt-4 mb-8">Driven by Purpose</h2>
              <p className="font-body text-xl text-on-surface leading-relaxed mb-10">
                Atlas Beauty KE is committed to connecting people to authentic, high-quality beauty
                products from around the world while inspiring confidence, self-expression, and pride
                in every individual&apos;s unique beauty.
              </p>
              <div className="flex flex-wrap gap-4">
                {[{ icon: "verified", label: "Certified Authentic" }, { icon: "language", label: "Globally Sourced" }].map((b) => (
                  <div key={b.label} className="inline-flex items-center px-6 py-2 bg-primary-container/10 rounded-full border border-primary-container/20">
                    <span className="material-symbols-outlined text-primary text-sm mr-2">{b.icon}</span>
                    <span className="text-xs font-label uppercase tracking-wider text-on-primary-container">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-6">
              <div className="relative">
                <div className="aspect-square w-full rounded-lg overflow-hidden relative grayscale contrast-125">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCr0Z700VKUClpZmaWUC9lnyHAQ89T5TAMT4AbX0fzrLF-b7HtCLGxMMfTY9PRWcxANDBFa25HOUim1MrOQdz8OQ0Dmxp68QAj5DNHTZ9HookXEKovSogMxjc5_6GNk7bEucnyUcjQCer2wEqIyt7H2bEs2hqVvREGOEJXuPDqJ257bn0SjjuSr_dHHr99_D9SL1imzJpcaaV733Y1E1eJYCuelgwk324tLhJSvmJm7WfLGzbS2nz43weFMedAEv_TbPL5R7tJVSGXi"
                    alt="Monochrome artistic photo of beauty product splashing"
                    fill className="object-cover"
                  />
                </div>
                <div className="absolute -top-12 -right-12 w-64 h-80 bg-primary-container p-1 rounded-lg shadow-xl hidden lg:block overflow-hidden relative">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8H1azRcyLoprBiX46pI0S8QrgqM2aC9xRCwiQJKFHhg6FHjqErcwzVzI0DXOdh7CsBC_ZC0aia-SeWGUpLgHIZ3eaH214yFuLX5fI6tPjnijN2ruKd4_QAmBlQTTqhFKVF7w-81weQYG3me5XMVgYcS2UjnVvCVmpMiEmtOZ8kfUDuSkppYw-ZhDaaMogyiK0E3LDM_MJe6b1gwP75nbUzQX5vA9HUfdD_tHjKHbbbxxDvd5TOFD5OalGkGzmN0dK3t436nh7fhAy"
                    alt="Minimalist glass perfume bottle catching natural light"
                    fill className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Curator's Standard */}
        <section className="py-32 bg-surface-container-high">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-24">
              <h2 className="font-headline text-4xl md:text-5xl mb-6">The Curator&apos;s Standard</h2>
              <div className="w-24 h-1 bg-primary mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-outline-variant/20">
              {[
                { num: "01", title: "Uncompromising Quality", desc: "We bypass the generic to find the exceptional. Every item in our atlas is vetted for efficacy, origin, and the story it tells." },
                { num: "02", title: "Inclusive Excellence", desc: "Beauty is not a monolith. Our selection reflects the vast spectrum of global skin tones, textures, and cultural expressions." },
                { num: "03", title: "Modern Authority", desc: "We blend timeless wisdom with modern science, providing a professional compass for your personal beauty journey." },
              ].map((c) => (
                <div key={c.num} className="bg-surface p-12 hover:bg-surface-container-lowest transition-all duration-500">
                  <span className="text-6xl font-headline text-primary-fixed-dim/40 mb-8 block">{c.num}</span>
                  <h4 className="font-headline text-2xl mb-6">{c.title}</h4>
                  <p className="text-on-surface-variant leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 bg-primary text-on-primary">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <h2 className="font-headline text-4xl md:text-6xl mb-12 italic">Join the Movement</h2>
            <p className="font-light text-xl mb-12 leading-relaxed opacity-90">
              Step into a space where your unique beauty is the primary focus. Explore the Atlas and find the pieces that move you.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <button className="px-12 py-4 bg-primary-container text-on-primary-container font-label font-bold uppercase tracking-widest rounded-lg hover:shadow-xl transition-all">
                Shop Collections
              </button>
              <button className="px-12 py-4 border border-on-primary/40 text-on-primary font-label font-bold uppercase tracking-widest rounded-lg hover:bg-white/10 transition-all">
                The Journal
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
