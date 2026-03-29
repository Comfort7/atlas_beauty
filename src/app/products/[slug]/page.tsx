import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProductDetailPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-8 mb-8">
          <nav className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
            <Link href="/skincare" className="hover:text-primary transition-colors">Shop</Link>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <Link href="/skincare" className="hover:text-primary transition-colors">Skincare</Link>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-primary">Radiant Dew Serum</span>
          </nav>
        </div>

        {/* Product Hero */}
        <section className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Left: Image Stack */}
          <div className="md:col-span-7 flex flex-col space-y-4">
            <div className="bg-surface-container-low aspect-[4/5] overflow-hidden relative">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-c_xAQGgY5BE5IzQYV-SskqDVbVj6PxlWQRpKqVKG1FcGrBvq68Vta67RCOiNsbm6Y_i-T4GsGJt6b1wh_qW0KvB-ComHDJLcZRJl-GrMmUf55Q_gqWfFtPjU5Kw4nQ360zH1na-7I-9cU1wWbKu4oGmSDgqx_JFAfvdTliu4sj-De5ZTSGHPzXot2Zu9KoQCZYFqU-QhNJSvdV7KrIR5AXgdd4BXdzfqtctg0WgFmd5v4bJbswqlKxDUksJrRLgZXaOWV9GMN12f"
                alt="Radiant Dew Serum — main product shot"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBz5x898POXjBgGIXGjOuRFRcxEp_lwhswItJTFOlNfJCEBbby39SYuH8JOPiHcEE5wDWJSMPFkVQ-ZM41QAgMHaaAyIZjCSCGyeriWl2P4K95B7R7b4FDTCww0R_KlwzSM7LPAD3j5MvXUguvmC6HS7c1nmgJXMttQzXn5cW-3ySbUEPM7841gMC-2CsynSo_ah4GhIs_w3U4Pt9185mxHHW45Bo0gT6Rji1K6hlxKTN1NzB-hxF9DyGn_03FPhEfjH1yribSKGhEV",
                  alt: "Serum drop detail",
                },
                {
                  src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAcvSx50Wf7B720I0f38VkI4ogYpPixK_8JpoyaWeQIlG7nHuXULASjvMjgh0mktRYKLPonEyKi8lJs5uWgFq_M7np1pQbfcGsMkEoHzN92l3rjNNND95Rt_V-EhUGqGoNFQqraLL9_yCAnXDQoB3JVmfZHF7jjA1Hk_2Ao91_IW5gV44aFeniUq1L2YvGWnieNCG96xlGUkJ3uHeEc643VJG7xpoMh-0T4Spcb3qbfpCQC3w6ShoWhaV63SLzaQMAQexPJ3M5Wy_b",
                  alt: "Water ripples texture",
                },
              ].map((img) => (
                <div key={img.alt} className="bg-surface-container-low aspect-square relative">
                  <Image src={img.src} alt={img.alt} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Content */}
          <div className="md:col-span-5 flex flex-col justify-start pt-4">
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] mb-4">
              Professional Collection
            </span>
            <h1 className="font-headline text-5xl md:text-6xl text-on-surface leading-tight tracking-tighter mb-4">
              Radiant Dew Serum
            </h1>
            <p className="font-headline italic text-on-surface-variant text-xl mb-8">
              Molecular hydration for the architectural complexion.
            </p>
            <div className="flex items-baseline space-x-4 mb-10">
              <span className="text-2xl font-body font-light text-on-surface">$114.00</span>
              <span className="text-sm text-on-surface-variant line-through">$140.00</span>
            </div>

            <div className="space-y-8 mb-12">
              <div className="border-b-2 border-primary/10 pb-4">
                <h3 className="font-bold text-xs uppercase tracking-widest mb-2">The Formula</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  A high-potency concentrate featuring triple-weight Hyaluronic Acid and Ceramide NP.
                  Engineered to restore the skin&apos;s barrier with a weightless, light-blue aqueous finish.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-2">
                    Size
                  </span>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 border-2 border-primary text-primary text-xs font-bold">
                      30ml
                    </button>
                    <button className="px-4 py-2 bg-surface-container text-on-surface-variant text-xs font-bold hover:bg-surface-container-high transition-colors">
                      50ml
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-2">
                    Quantity
                  </span>
                  <div className="flex items-center space-x-4 bg-surface-container-low px-3 py-2">
                    <button className="material-symbols-outlined text-sm">remove</button>
                    <span className="text-xs font-bold w-4 text-center">1</span>
                    <button className="material-symbols-outlined text-sm">add</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <button className="w-full bg-primary text-on-primary py-5 rounded-lg font-bold text-sm tracking-widest uppercase hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/10">
                Add to Collection
              </button>
              <button className="w-full bg-primary-container text-on-primary-container py-5 rounded-lg font-bold text-sm tracking-widest uppercase hover:brightness-105 transition-all">
                Buy Now
              </button>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-primary">verified</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Clinical Grade
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-primary">eco</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Sustainably Sourced
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Details Bento */}
        <section className="mt-24 bg-surface-container-low py-20 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="font-headline text-4xl text-on-surface mb-2">Specifications</h2>
              <div className="h-1 w-20 bg-primary" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2 bg-surface p-8 border-l-4 border-primary">
                <span className="text-primary font-bold text-[10px] uppercase tracking-widest mb-4 block">
                  Key Ingredient
                </span>
                <h4 className="font-headline text-2xl mb-4">Blue Tansy Oil</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Calms inflammation and reduces redness while providing the serum&apos;s signature serene blue hue.
                  Rich in antioxidants for architectural skin repair.
                </p>
              </div>
              <div className="bg-primary-container/20 p-8 flex flex-col justify-between">
                <span className="material-symbols-outlined text-primary text-4xl mb-4">water_drop</span>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest mb-2">Hydration Index</h4>
                  <p className="text-3xl font-headline text-on-primary-container">98%</p>
                </div>
              </div>
              <div className="bg-surface p-8">
                <h4 className="font-bold text-xs uppercase tracking-widest mb-4">pH Balance</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-4xl font-headline text-on-surface">5.5</span>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1">OPTIMAL</span>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-4">
                  Precision-tuned for the skin&apos;s natural acidic mantle.
                </p>
              </div>
              <div className="md:col-span-4 bg-surface-container-lowest p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { num: "01", label: "Morning Ritual", text: "Apply 3 drops to cleansed skin. Press gently into the face using upward motions." },
                  { num: "02", label: "Layering", text: "Follow with your preferred Atlas Beauty moisturizer to lock in molecular moisture." },
                  { num: "03", label: "Synergy", text: "Pairs perfectly with our Obsidian Sculpting Tool for enhanced lymphatic drainage." },
                ].map((step) => (
                  <div key={step.num}>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4">
                      {step.num} / {step.label}
                    </h5>
                    <p className="text-xs text-on-surface-variant">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Quote */}
        <section className="py-24 max-w-5xl mx-auto px-8 text-center">
          <span className="material-symbols-outlined text-primary-container text-6xl opacity-50 mb-8 block">
            format_quote
          </span>
          <p className="font-headline text-3xl md:text-4xl text-on-surface italic leading-relaxed">
            &ldquo;The Radiant Dew Serum isn&apos;t just skincare; it&apos;s a structural reset. We&apos;ve removed the
            noise to focus on the essential architecture of hydration.&rdquo;
          </p>
          <div className="mt-8 flex flex-col items-center">
            <div className="w-12 h-px bg-primary mb-4" />
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-on-surface-variant">
              The Atlas Collective
            </span>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
