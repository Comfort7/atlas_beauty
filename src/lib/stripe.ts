import Stripe from "stripe";

/** Null when STRIPE_SECRET_KEY is unset (e.g. build without secrets). */
export const stripe: Stripe | null = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { typescript: true })
  : null;
