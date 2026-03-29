import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@atlasbeauty.com" },
    update: {},
    create: {
      email: "admin@atlasbeauty.com",
      name: "Atlas Admin",
      passwordHash: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log(`Admin user created: ${admin.email}`);

  // Create test customer
  const customerPassword = await bcrypt.hash("Customer123!", 12);
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      name: "Jane Customer",
      passwordHash: customerPassword,
      role: "CUSTOMER",
      emailVerified: new Date(),
    },
  });
  console.log(`Customer created: ${customer.email}`);

  // Create address for customer
  await prisma.address.upsert({
    where: { id: "seed-address-1" },
    update: {},
    create: {
      id: "seed-address-1",
      userId: customer.id,
      label: "Home",
      fullName: "Jane Customer",
      line1: "123 Beauty Lane",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90001",
      country: "US",
      isDefault: true,
    },
  });

  // Create brands
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: "glow-labs" },
      update: {},
      create: {
        name: "Glow Labs",
        slug: "glow-labs",
        description: "Premium skincare backed by science",
      },
    }),
    prisma.brand.upsert({
      where: { slug: "velvet-rose" },
      update: {},
      create: {
        name: "Velvet Rose",
        slug: "velvet-rose",
        description: "Luxury cosmetics for everyday elegance",
      },
    }),
    prisma.brand.upsert({
      where: { slug: "pure-essence" },
      update: {},
      create: {
        name: "Pure Essence",
        slug: "pure-essence",
        description: "Natural and organic beauty products",
      },
    }),
  ]);
  console.log(`${brands.length} brands created`);

  // Create categories
  const skincare = await prisma.category.upsert({
    where: { slug: "skincare" },
    update: {},
    create: { name: "Skincare", slug: "skincare", description: "Face and body skincare products" },
  });

  const makeup = await prisma.category.upsert({
    where: { slug: "makeup" },
    update: {},
    create: { name: "Makeup", slug: "makeup", description: "Cosmetics and color products" },
  });

  const haircare = await prisma.category.upsert({
    where: { slug: "haircare" },
    update: {},
    create: { name: "Haircare", slug: "haircare", description: "Hair treatment and styling products" },
  });

  const fragrance = await prisma.category.upsert({
    where: { slug: "fragrance" },
    update: {},
    create: { name: "Fragrance", slug: "fragrance", description: "Perfumes and body mists" },
  });

  // Subcategories
  await Promise.all([
    prisma.category.upsert({
      where: { slug: "moisturizers" },
      update: {},
      create: { name: "Moisturizers", slug: "moisturizers", parentId: skincare.id },
    }),
    prisma.category.upsert({
      where: { slug: "serums" },
      update: {},
      create: { name: "Serums", slug: "serums", parentId: skincare.id },
    }),
    prisma.category.upsert({
      where: { slug: "lip-products" },
      update: {},
      create: { name: "Lip Products", slug: "lip-products", parentId: makeup.id },
    }),
    prisma.category.upsert({
      where: { slug: "foundation" },
      update: {},
      create: { name: "Foundation", slug: "foundation", parentId: makeup.id },
    }),
  ]);
  console.log("Categories created");

  // Create products
  const products = [
    {
      name: "Hydrating Glow Serum",
      slug: "hydrating-glow-serum",
      description: "A lightweight, fast-absorbing serum packed with hyaluronic acid and vitamin C to brighten and hydrate your skin. Suitable for all skin types.",
      shortDescription: "Hyaluronic acid + Vitamin C serum for radiant skin",
      categoryId: skincare.id,
      brandId: brands[0].id,
      basePrice: new Prisma.Decimal(48.00),
      compareAtPrice: new Prisma.Decimal(60.00),
      isFeatured: true,
      tags: ["serum", "hydrating", "vitamin-c", "bestseller"],
      ingredients: "Water, Hyaluronic Acid, Ascorbic Acid (Vitamin C), Niacinamide, Aloe Vera Extract",
      metaTitle: "Hydrating Glow Serum | Atlas Beauty",
      metaDescription: "Shop our bestselling Hydrating Glow Serum with Hyaluronic Acid and Vitamin C.",
    },
    {
      name: "Velvet Matte Lipstick",
      slug: "velvet-matte-lipstick",
      description: "Long-lasting matte lipstick with a velvety smooth finish. Enriched with vitamin E for comfortable all-day wear. Available in 6 stunning shades.",
      shortDescription: "Long-lasting matte lipstick in stunning shades",
      categoryId: makeup.id,
      brandId: brands[1].id,
      basePrice: new Prisma.Decimal(24.00),
      isFeatured: true,
      tags: ["lipstick", "matte", "long-lasting"],
      ingredients: "Dimethicone, Isododecane, Nylon-611, Vitamin E",
    },
    {
      name: "Repair & Shine Hair Mask",
      slug: "repair-shine-hair-mask",
      description: "Deep conditioning hair mask that repairs damage and adds brilliant shine. Formulated with argan oil and keratin for silky smooth results.",
      shortDescription: "Deep conditioning mask with argan oil & keratin",
      categoryId: haircare.id,
      brandId: brands[2].id,
      basePrice: new Prisma.Decimal(32.00),
      isFeatured: true,
      tags: ["hair-mask", "repair", "argan-oil"],
    },
    {
      name: "Rose Petal Moisturizer",
      slug: "rose-petal-moisturizer",
      description: "A luxurious daily moisturizer infused with rose extract and squalane. Deeply nourishes while leaving skin soft and dewy.",
      shortDescription: "Rose-infused daily moisturizer",
      categoryId: skincare.id,
      brandId: brands[2].id,
      basePrice: new Prisma.Decimal(38.00),
      tags: ["moisturizer", "rose", "daily"],
    },
    {
      name: "Midnight Orchid Eau de Parfum",
      slug: "midnight-orchid-eau-de-parfum",
      description: "An enchanting fragrance blending dark orchid, vanilla, and amber. A sophisticated scent for evening occasions.",
      shortDescription: "Dark orchid, vanilla & amber fragrance",
      categoryId: fragrance.id,
      brandId: brands[1].id,
      basePrice: new Prisma.Decimal(85.00),
      compareAtPrice: new Prisma.Decimal(110.00),
      isFeatured: true,
      tags: ["perfume", "eau-de-parfum", "evening"],
    },
  ];

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    });

    // Create variants for each product
    if (productData.slug === "velvet-matte-lipstick") {
      const shades = [
        { name: "Ruby Red", shade: "Ruby Red" },
        { name: "Nude Pink", shade: "Nude Pink" },
        { name: "Berry Wine", shade: "Berry Wine" },
      ];

      for (let i = 0; i < shades.length; i++) {
        const sku = `VML-${shades[i].shade.replace(/\s/g, "-").toUpperCase()}`;
        const variant = await prisma.productVariant.upsert({
          where: { sku },
          update: {},
          create: {
            productId: product.id,
            sku,
            name: shades[i].name,
            price: new Prisma.Decimal(24.00),
            options: { shade: shades[i].shade },
            weight: new Prisma.Decimal(30),
          },
        });
        await prisma.inventory.upsert({
          where: { variantId: variant.id },
          update: {},
          create: { variantId: variant.id, quantity: 50, lowStockThreshold: 10 },
        });
      }
    } else if (productData.slug === "hydrating-glow-serum") {
      const sizes = ["30ml", "50ml"];
      const prices = [48.00, 72.00];

      for (let i = 0; i < sizes.length; i++) {
        const sku = `HGS-${sizes[i].toUpperCase()}`;
        const variant = await prisma.productVariant.upsert({
          where: { sku },
          update: {},
          create: {
            productId: product.id,
            sku,
            name: sizes[i],
            price: new Prisma.Decimal(prices[i]),
            options: { size: sizes[i] },
            weight: new Prisma.Decimal(i === 0 ? 80 : 120),
          },
        });
        await prisma.inventory.upsert({
          where: { variantId: variant.id },
          update: {},
          create: { variantId: variant.id, quantity: 100, lowStockThreshold: 15 },
        });
      }
    } else {
      // Default single variant
      const sku = `${productData.slug.substring(0, 3).toUpperCase()}-STD`;
      const variant = await prisma.productVariant.upsert({
        where: { sku },
        update: {},
        create: {
          productId: product.id,
          sku,
          name: "Standard",
          price: productData.basePrice,
          options: { size: "Standard" },
          weight: new Prisma.Decimal(150),
        },
      });
      await prisma.inventory.upsert({
        where: { variantId: variant.id },
        update: {},
        create: { variantId: variant.id, quantity: 75, lowStockThreshold: 10 },
      });
    }
  }
  console.log(`${products.length} products with variants created`);

  // Create coupons
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      description: "10% off your first order",
      type: "PERCENTAGE",
      value: new Prisma.Decimal(10),
      maxUsesPerUser: 1,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "FREESHIP" },
    update: {},
    create: {
      code: "FREESHIP",
      description: "Free shipping on any order",
      type: "FREE_SHIPPING",
      value: new Prisma.Decimal(0),
      maxUses: 500,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "BEAUTY20" },
    update: {},
    create: {
      code: "BEAUTY20",
      description: "$20 off orders over $75",
      type: "FIXED",
      value: new Prisma.Decimal(20),
      minOrderAmount: new Prisma.Decimal(75),
    },
  });
  console.log("Coupons created");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
