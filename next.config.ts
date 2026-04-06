import type { NextConfig } from "next";

/** On Vercel, AUTH_URL is often unset; VERCEL_URL is always present. Auth.js needs a public URL for cookies/CSRF. */
const inferredAuthUrl =
  process.env.AUTH_URL?.trim() ||
  process.env.NEXTAUTH_URL?.trim() ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

const nextConfig: NextConfig = {
  env: {
    ...(inferredAuthUrl ? { AUTH_URL: inferredAuthUrl } : {}),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
