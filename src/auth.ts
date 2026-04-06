import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

/** Prefer AUTH_SECRET; support legacy NEXTAUTH_SECRET so Vercel env names still work. */
const authSecret =
  process.env.AUTH_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim();

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // Do not pass `secret: undefined` — it blocks Auth.js from reading NEXTAUTH_SECRET from the environment.
  ...(authSecret ? { secret: authSecret } : {}),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (existingUser) {
          if (!existingUser.googleId) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                googleId: account.providerAccountId,
                image: user.image,
                emailVerified: new Date(),
              },
            });
          }
        } else {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              image: user.image,
              googleId: account.providerAccountId,
              emailVerified: new Date(),
              role: "CUSTOMER",
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: { id: true, role: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
});
