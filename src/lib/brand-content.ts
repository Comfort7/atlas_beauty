export type FeaturedBrand = {
  name: string;
  slug: string;
  href: string;
  image: string;
  description: string;
};

export type BrandJournalEntry = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  brand: string;
  publishedAt: string;
};

export const featuredBrands: FeaturedBrand[] = [
  {
    name: "Dove",
    slug: "dove",
    href: "/shop?search=dove",
    image: "/products/dove-vanilla-sugar.jpg",
    description: "Everyday body care staples with soft, clean scent profiles.",
  },
  {
    name: "Tree Hut",
    slug: "tree-hut",
    href: "/shop?search=tree%20hut",
    image: "/products/treehut-pink-champagne.jpg",
    description: "Sugar scrub textures and fragrance-forward shower rituals.",
  },
  {
    name: "OGX",
    slug: "ogx",
    href: "/shop?search=ogx",
    image: "/products/ogx-coconut-coffee-scrub.jpg",
    description: "Exfoliating body washes and scrubs for smooth texture.",
  },
  {
    name: "Hempz",
    slug: "hempz",
    href: "/shop?search=hempz",
    image: "/products/hempz-original.jpg",
    description: "Moisture-rich lotions with signature gourmand notes.",
  },
  {
    name: "Carmex",
    slug: "carmex",
    href: "/shop?search=carmex",
    image: "/products/carmex-spf-15-lip-balm.jpg",
    description: "Classic lip care formulas focused on daily protection.",
  },
  {
    name: "Palmer's",
    slug: "palmers",
    href: "/shop?search=palmers",
    image: "/products/palmers-vanilla-cream.jpg",
    description: "Comforting cocoa-butter body treatments and creams.",
  },
  {
    name: "EOS",
    slug: "eos",
    href: "/shop?search=eos",
    image: "/products/eos-vanilla-cashmere.jpg",
    description: "Soft body hydration with playful scent combinations.",
  },
  {
    name: "Aquaphor",
    slug: "aquaphor",
    href: "/shop?search=aquaphor",
    image: "/products/aquaphor-lip-repair.jpg",
    description: "Repair-first care for dry lips and sensitive skin moments.",
  },
];

export const brandJournalEntries: BrandJournalEntry[] = [
  {
    slug: "dove-everyday-soft-skin-ritual",
    title: "Dove: The Everyday Soft-Skin Ritual",
    excerpt: "How to layer a gentle cleanse and moisture step for all-day comfort.",
    coverImage: "/products/dove-vanilla-sugar.jpg",
    tags: ["Dove", "Body Care", "Routine"],
    brand: "Dove",
    publishedAt: "2026-04-20T08:00:00.000Z",
    content: `Dove routines work best when you keep the sequence simple and consistent.

Start with a gentle cleanse to reset the skin barrier, then lock in moisture while skin is still slightly damp.

For daytime, focus on comfort and scent longevity.

- Use a mild wash first
- Follow with a body cream or lotion
- Reapply to dry zones in the evening

This rhythm supports softness without overcomplicating your routine.`,
  },
  {
    slug: "tree-hut-scrub-layering-guide",
    title: "Tree Hut: A Better Scrub Layering Guide",
    excerpt: "Use exfoliation intentionally so skin feels polished, never stripped.",
    coverImage: "/products/treehut-pink-champagne.jpg",
    tags: ["Tree Hut", "Exfoliation", "Body Care"],
    brand: "Tree Hut",
    publishedAt: "2026-04-19T08:00:00.000Z",
    content: `Tree Hut scrubs shine when you control frequency and pressure.

Exfoliate two to three times a week instead of daily.

On scrub days, keep everything else soothing and hydrating.

- Warm water first to soften skin
- Small circular motions with light pressure
- Finish with a moisture-rich lotion

Your goal is glow and smoothness, not friction.`,
  },
  {
    slug: "ogx-texture-reset-shower-plan",
    title: "OGX: Texture Reset Shower Plan",
    excerpt: "A practical weekly shower rhythm for roughness and uneven texture.",
    coverImage: "/products/ogx-coconut-coffee-scrub.jpg",
    tags: ["OGX", "Texture", "Shower Ritual"],
    brand: "OGX",
    publishedAt: "2026-04-18T08:00:00.000Z",
    content: `Texture improves fastest when cleansing and exfoliating are balanced.

Alternate between gentle wash days and active scrub days.

Keep fragrance strong but hydration stronger.

- Day 1 and 3: hydrating wash
- Day 2 and 5: exfoliating scrub
- Finish each shower with body lotion

Consistency for two weeks usually shows the biggest shift.`,
  },
  {
    slug: "hempz-long-lasting-moisture-formula",
    title: "Hempz: Building Long-Lasting Moisture",
    excerpt: "How to extend softness from morning application into the night.",
    coverImage: "/products/hempz-original.jpg",
    tags: ["Hempz", "Moisture", "Body Lotion"],
    brand: "Hempz",
    publishedAt: "2026-04-17T08:00:00.000Z",
    content: `Hempz lotions perform best when paired with damp-skin application.

Use one full pass after showering, then a second targeted pass on elbows, knees, and hands.

If your environment is dry, seal moisture with a richer cream at night.

That one adjustment can dramatically improve next-day skin feel.`,
  },
  {
    slug: "carmex-lip-care-day-night-system",
    title: "Carmex: A Day-Night Lip Care System",
    excerpt: "Protect in the day, recover at night with a minimal lip routine.",
    coverImage: "/products/carmex-spf-15-lip-balm.jpg",
    tags: ["Carmex", "Lip Care", "SPF"],
    brand: "Carmex",
    publishedAt: "2026-04-16T08:00:00.000Z",
    content: `Lip care works best when daytime and nighttime roles are different.

In daytime, prioritize SPF and frequent light reapplication.

At night, use a thicker layer so lips recover while you sleep.

- Day: SPF balm every few hours
- Night: richer coat before bed
- Avoid licking lips between applications

This system is simple and very effective.`,
  },
  {
    slug: "palmers-comfort-barrier-care",
    title: "Palmer's: Comfort-Focused Barrier Care",
    excerpt: "Use cocoa-butter rich formulas to maintain comfort during dry weeks.",
    coverImage: "/products/palmers-vanilla-cream.jpg",
    tags: ["Palmer's", "Barrier Support", "Hydration"],
    brand: "Palmer's",
    publishedAt: "2026-04-15T08:00:00.000Z",
    content: `When skin feels tight, barrier-focused routines outperform aggressive actives.

Palmer's products are strongest when applied immediately after cleansing.

Use warm-not-hot water and avoid over-washing.

Layering a cream in the evening can stabilize moisture overnight and reduce morning dryness.`,
  },
  {
    slug: "eos-scented-hydration-balance",
    title: "EOS: Balancing Scent and Hydration",
    excerpt: "How to enjoy scented body care while keeping hydration levels high.",
    coverImage: "/products/eos-vanilla-cashmere.jpg",
    tags: ["EOS", "Body Care", "Hydration"],
    brand: "EOS",
    publishedAt: "2026-04-14T08:00:00.000Z",
    content: `Scented body products can stay skin-friendly when hydration is built in.

Use EOS lotion as your hydration anchor, then add fragrance layers around it.

The key is preventing moisture loss before scent is applied.

A hydrated base keeps both comfort and fragrance performance steady.`,
  },
  {
    slug: "aquaphor-rapid-lip-repair-playbook",
    title: "Aquaphor: Rapid Lip Repair Playbook",
    excerpt: "A focused repair approach for lips that feel cracked or wind-burned.",
    coverImage: "/products/aquaphor-lip-repair.jpg",
    tags: ["Aquaphor", "Repair", "Lip Care"],
    brand: "Aquaphor",
    publishedAt: "2026-04-13T08:00:00.000Z",
    content: `When lips are compromised, keep the routine protective and non-irritating.

Apply a repair balm first thing in the morning, after meals, and before bed.

Skip fragranced lip formulas until comfort returns.

In 48 to 72 hours, most users notice smoother texture and less sensitivity.`,
  },
];

export function getBrandJournalBySlug(slug: string) {
  return brandJournalEntries.find((entry) => entry.slug === slug) ?? null;
}
