import Image from "next/image";

const ritualImages = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFDw6kxfcTmI8_Y1TXLmpVrk5zl1cPCn9KBN_l6RBEfnKyAK6OafIH5oCpCEBMhoQ0oGWTlBkNJIix8boxYEwjczyrKafttoXZjFiBkrm2pA-7erhuc341kDlDTrnB0U9NuuZIziAGyhOOKfj26xEbl_OzIVCQghQ5XeoGDFe-xbHPa6oZVmRHQKp8UKy7rp1RjRBoow2EP0zqRmWoEvt92C6aQblOxpS7dyz37ymosWHGyAmXOHHUOSdsIxjn1yL3bSpBdDudpY69",
    alt: "Woman with flawless skin in a spa with blue light treatment",
    aspect: "aspect-[4/5]",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3er13exN3sIwJJOEGy0AlrpIRlxNkr09Do3CiPPUQKHS-4IM5wPoaOApnMU94jMqODPo2zrj2o_DcKgF1POgldWIKQm5oTf1ZxUMY1-eN-fDbNUbVnHU1OEmUgRfZK84_kxTUQ-yhl3fziuexTzwbkGSvb3p5id9ms6M8nrFL8qPf2wv8CMvFb19FXC8uRLcKFZQK3zp4KsDb0HddVDkcWyKbZ3lplllwU1gX5zsiS28jyEWkorgbNbHcyPhDt4ZUYfgYiNwBBLSi",
    alt: "Top view of hands mixing a blue face mask in a ceramic bowl",
    aspect: "aspect-square",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhqSKMy8QY85cNiCkH9Wi0qg1FOpKGTRBAsEoIcFWXOu9k-eesZ3Mk6LT2HTnjJzeVY7SR_6MYPaWenNntjdu0kkgXoLZeEJk1p5yWA_a_vy6lWeei8DRElspEoHiEDIOLxxLIZlojbSekmmWsnowujeqPzT1ILbFYBa_4qwgPY-Q_VU-KVjXC4RzS22en94ZU-AdcdY-KB9f_k2OHgXYIPEzoZ2rwQTbRKgiayuB4WhbF1enG479STd5tnCW707Rpv-OmWWV8cnMg",
    alt: "Morning dew on a soft blue petal representing freshness and hydration",
    aspect: "aspect-square",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVMN2jLE2BG_ODWCbHf3vP-Q4r4LVERfyYuX1CkhY9-cN7wwkZVAB8SvP8zKlQpq1sz3r04tl3r8uLU2BJVuhbi772k6fQ0ZlPsMjIeO4TLR-Lv6BXw4eOLzI2tnTVahFekeVNS2BEnURA3-dKYI3slpv0Kx4XHuxa1dNXMMyRBcal5MEx1nUA1kdm3WvcrKN1qPeN7yT0_PdmAwXhQT1QJtBWYItTAjgbsjGfrN_5O_csJ_vGmeDLE1SegVh6_429QiYgHezQm2zX",
    alt: "Minimalist bathroom counter with Atlas Beauty products and eucalyptus",
    aspect: "aspect-[4/5]",
  },
];

const rituals = [
  {
    num: "01",
    title: "The Morning Awakening",
    desc: "Revitalize and protect for the day ahead.",
  },
  {
    num: "02",
    title: "Structural Night Recovery",
    desc: "Deep repair during your body's rest cycle.",
  },
  {
    num: "03",
    title: "The Weekend Detox",
    desc: "Intensive purification and mineral infusion.",
  },
];

export default function CuratedRituals() {
  return (
    <section className="py-32 bg-gradient-to-br from-primary to-primary-container text-on-primary overflow-hidden relative">
      {/* Decorative SVG blob */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
        <svg
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M47.5,-61.8C60.6,-53.4,69.5,-38.7,73.4,-23.1C77.4,-7.6,76.3,8.7,69.8,22.6C63.3,36.5,51.3,47.9,37.8,55.1C24.3,62.3,9.4,65.2,-6.3,63.9C-21.9,62.5,-38.4,56.9,-51.1,46.1C-63.8,35.2,-72.7,19.2,-73.5,3.1C-74.4,-13,-67.2,-29.1,-55.8,-38.4C-44.5,-47.8,-29,-50.3,-14.4,-57C0.1,-63.7,15.1,-74.6,30.3,-72.4C45.5,-70.2,60.8,-54.9,47.5,-61.8Z"
            fill="currentColor"
            transform="translate(200 200)"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        {/* Staggered image grid */}
        <div className="order-2 md:order-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              {[ritualImages[0], ritualImages[1]].map((img) => (
                <div
                  key={img.alt}
                  className={`${img.aspect} bg-white/10 rounded-lg overflow-hidden backdrop-blur-md relative`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="pt-12 space-y-4">
              {[ritualImages[2], ritualImages[3]].map((img) => (
                <div
                  key={img.alt}
                  className={`${img.aspect} bg-white/10 rounded-lg overflow-hidden backdrop-blur-md relative`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="order-1 md:order-2">
          <span className="font-body text-sm uppercase tracking-widest opacity-80 mb-4 block">
            The Serene Curator
          </span>
          <h2 className="text-5xl md:text-6xl font-headline mb-8">
            Curated Rituals for the Modern Skin
          </h2>
          <p className="text-xl font-body opacity-90 leading-relaxed mb-10">
            Our rituals are more than just a routine — they are a moment of
            architectural precision for your well-being. Guided by science,
            inspired by the calm of the sea.
          </p>

          <div className="space-y-6">
            {rituals.map((ritual) => (
              <div
                key={ritual.num}
                className="flex items-center gap-6 group cursor-pointer"
              >
                <span className="w-12 h-12 flex items-center justify-center border border-white/30 rounded-full group-hover:bg-white group-hover:text-primary transition-all font-body text-sm font-bold flex-shrink-0">
                  {ritual.num}
                </span>
                <div>
                  <h4 className="font-headline text-xl">{ritual.title}</h4>
                  <p className="text-sm opacity-70 font-body">{ritual.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
