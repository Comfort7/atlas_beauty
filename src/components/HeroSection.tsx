import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-[921px] flex flex-col justify-center px-8 md:px-16 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full">
        {/* Text content */}
        <div className="md:col-span-7 z-10 order-2 md:order-1">
          <h1 className="text-6xl md:text-8xl font-headline leading-tight tracking-tight text-on-surface mb-6">
            Architectural <br />
            <span className="italic text-primary">Radiance.</span>
          </h1>
          <p className="font-body text-on-surface-variant max-w-md text-lg leading-relaxed mb-10">
            A curated selection of high-performance skincare, blending
            professional precision with the serenity of nature&apos;s finest
            elements.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button className="bg-primary text-on-primary px-8 py-4 rounded-lg font-bold tracking-wide hover:scale-95 transition-transform font-body text-sm uppercase">
              Shop the Collection
            </button>
            <button className="text-primary font-bold px-8 py-4 border-b-2 border-primary/20 hover:border-primary transition-all font-body text-sm uppercase">
              Explore Rituals
            </button>
          </div>
        </div>

        {/* Hero image */}
        <div className="md:col-span-5 relative order-1 md:order-2">
          <div className="aspect-[3/4] w-full bg-surface-container-low rounded-lg overflow-hidden relative shadow-2xl">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYDJRelMgvNrje8QFUPVThOL8-KfvOzkEj_E8IfRZ4uU9wMF8rfgYdz77c-6vIH1goSrxNXjScRZNa9EJwLFoVpcJ_jA-UNVhmYjiTw89tNWWQwgkLdJty_lxRqZeZwEI8APxEMdBlzewXIgPDNC6UB-BINUwFYzZnlxICJOzYJ6G8LfM_7LjqDBJGwy6PZwci1IJRqG3vJ2Z-AVZ86mqO0T0CfCvYV8kXZx-U93-XO66xyE6w4AleqaSHBUseijBv-vA49ZER2mNB"
              alt="Azure Rejuvenating Serum on an architectural stone pedestal"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute bottom-4 left-4 right-4 p-6 glass-nav rounded-lg">
              <span className="font-body text-xs uppercase tracking-widest text-primary font-bold">
                New Release
              </span>
              <h3 className="font-headline text-xl mt-1">
                Azure Rejuvenating Serum
              </h3>
            </div>
          </div>
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl -z-10" />
        </div>
      </div>
    </section>
  );
}
