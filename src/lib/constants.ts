export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const CART_SESSION_COOKIE = "atlas_cart_session";
export const CART_SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const ORDER_PREFIX = "AB";

export const SHIPPING_METHODS = {
  STANDARD: {
    id: "standard",
    name: "Standard Shipping",
    description: "5-7 business days",
    baseRate: 5.99,
    freeThreshold: 50,
  },
  EXPRESS: {
    id: "express",
    name: "Express Shipping",
    description: "2-3 business days",
    baseRate: 12.99,
    freeThreshold: null,
  },
  OVERNIGHT: {
    id: "overnight",
    name: "Overnight Shipping",
    description: "Next business day",
    baseRate: 24.99,
    freeThreshold: null,
  },
} as const;

export const TAX_RATE = 0.08; // 8% default tax rate

export const CACHE_TTL = {
  PRODUCTS: 300,       // 5 minutes
  CATEGORIES: 900,     // 15 minutes
  SEARCH: 60,          // 1 minute
  DASHBOARD: 60,       // 1 minute
} as const;
