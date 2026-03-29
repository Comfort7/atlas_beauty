import { Resend } from "resend";

/** Null when RESEND_API_KEY is unset (e.g. Vercel build or dev without email). */
export const resend: Resend | null = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const EMAIL_FROM =
  process.env.EMAIL_FROM || "Atlas Beauty <noreply@atlasbeauty.com>";
