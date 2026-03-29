import Image from "next/image";

const products = [
  {
    id: 1,
    tag: "Hydration",
    name: "Deep Sea Mineral Cream",
    description:
      "Experience the restorative power of oceanic minerals in a silk-weight formula.",
    price: "$85.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuANsTiPnQ9RR4dXX2LQ6eg4q4O2vSdHaQa8pL-wMxV0K57fIVxfl1ruKrDYi1eW_WOzDj6vo6GVmp9H7MWZjghuMemKvg-NGrpXllMS3FiUdEYCVrM2MBqaWE40XOQE6RppPGqQMgULSCw1w_rA6gSJUDhK1Yf_FaZ1ke53jXveT938y5SIJ7HTz7ToLk3LsNOzLLK5ASJpOC9WxBabrqKO3h8jA-xlMXMlaVHPK0kL8cAvhHXpYN5HnUMYr7KW5qomJQgREibQLVg8",
    alt: "Luxury moisturizer cream texture on a cool grey surface",
    large: true,
  },
  {
    id: 2,
    name: "Balancing Toner",
    price: "$42.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCBS6IFxse7P_ZKCvWg88ZYB7VpmH6osfuCz3fHNrp1xolnEzyvl60hqZ-vGudVEewGbnd3jSPvhj7RF7CXCqYJw3IYZ8dwwx2duDz5tA_OcD35fk-kTLkMzqDB2nNiV3etIefzC8jvZtFySLb2sFLVwFV6hivJj6jWFZmMmRz4GnYkMQAIpRBOxs8eiwBSfdLkhJd4GLVpG97Xmu1kTXDRcA4fjLKl1NXUinXX_AQwpNLXoBGpMySKVSUfAUNWcofIvU3QUEQyxFRi",
    alt: "Minimalist white toner bottle on a glass shelf with water ripples",
  },
  {
    id: 3,
    name: "Botanical Elixir",
    price: "$110.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCqIMmMgECvHRy-Wemuhv3BP3d6aJFkrcrMLv9KxwXNnyHHL1j14tusUSlBHt-r4vC0kNYzqHhLlsRtVJbrf57VdKb7JIFRozwcfjrLhERTF_xZ5eY0H0XTvxCHihNo7ZGnXAKnf0slaC6xbY2Fm-vkn6hlwjnv3RMARBP9uozJjRglxhUOLMmBETZxs6oRbsXX_H7Bop4oBrbQmjH47CBDNfVV9XXIbQtGE0i_c28fbeE4-oTuo7pPXjiYrORiT5wtpkH_HH15JCid",
    alt: "Elegant pipette glass bottle with clear oil and botanical extracts",
  },
  {
    id: 4,
    tag: "Limited Edition",
    name: "The Architectural Set",
    description: "A complete 3-step routine for structural restoration.",
    price: "$195.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCyArApJcCYidUT2Tb-bW5_rGepRVdBlFgNxscVuW6q_mKqetSpmTHZOv1k0EaMswinHp-2H-4XaKSfM1WdXjYzheZ5-wnCh9WNImR77PMiQwmBC4XmcPokXJyKpiRgTUZPPThMu6du9p9gOnNndJ57vLjUbah_RZU6fR6Z2Lx7Fo-sGvJqqDJW7vxiUvcfz8TrTFvbC4CfWEx5Y9kV9SQDIrDKCdpIVir3Rhb-ufTCjnyDHfMPzO0_h7eGrxRWmuJrHYUpprjvWVhm",
    alt: "Set of three skincare products on a marble surface with morning sunlight",
    wide: true,
  },
];

export default function NewArrivals() {
  return (
    <section className="py-24 bg-surface-container-low px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="font-body text-sm uppercase tracking-[0.2em] text-primary font-bold">
              Seasonal Drops
            </span>
            <h2 className="text-4xl font-headline mt-2">New Arrivals</h2>
          </div>
          <a
            href="#"
            className="font-body text-sm font-bold border-b border-on-surface hover:text-primary transition-colors"
          >
            VIEW ALL
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Large featured card */}
          <div className="md:col-span-2 md:row-span-2 group cursor-pointer overflow-hidden rounded-lg bg-surface-container-lowest">
            <div className="aspect-square relative overflow-hidden">
              <Image
                src={products[0].image}
                alt={products[0].alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-8">
              <span className="text-xs uppercase font-bold text-primary tracking-widest">
                {products[0].tag}
              </span>
              <h3 className="text-2xl font-headline mt-2">{products[0].name}</h3>
              <p className="font-body text-on-surface-variant mt-2 mb-6">
                {products[0].description}
              </p>
              <span className="font-bold text-primary">{products[0].price}</span>
            </div>
          </div>

          {/* Small card — Toner */}
          <div className="group cursor-pointer rounded-lg bg-surface-container-lowest overflow-hidden">
            <div className="aspect-square overflow-hidden relative">
              <Image
                src={products[1].image}
                alt={products[1].alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <h3 className="font-headline text-lg">{products[1].name}</h3>
              <span className="font-body text-sm text-on-surface-variant">
                {products[1].price}
              </span>
            </div>
          </div>

          {/* Small card — Elixir */}
          <div className="group cursor-pointer rounded-lg bg-surface-container-lowest overflow-hidden">
            <div className="aspect-square overflow-hidden relative">
              <Image
                src={products[2].image}
                alt={products[2].alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <h3 className="font-headline text-lg">{products[2].name}</h3>
              <span className="font-body text-sm text-on-surface-variant">
                {products[2].price}
              </span>
            </div>
          </div>

          {/* Wide card — Architectural Set */}
          <div className="md:col-span-2 group cursor-pointer rounded-lg bg-surface-container-lowest overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/2 aspect-square overflow-hidden relative">
              <Image
                src={products[3].image}
                alt={products[3].alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-8 md:w-1/2 flex flex-col justify-center">
              <span className="text-xs uppercase font-bold text-primary tracking-widest">
                {products[3].tag}
              </span>
              <h3 className="text-xl font-headline mt-2">{products[3].name}</h3>
              <p className="font-body text-sm text-on-surface-variant mt-2 mb-4">
                {products[3].description}
              </p>
              <span className="font-bold text-primary">{products[3].price}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
