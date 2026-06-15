import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { registerOrUpdateUser } from "@/lib/users-store";

const providers: Provider[] = [
  Credentials({
    name: "Email",
    credentials: {
      name: { label: "Name", type: "text" },
      email: { label: "Email", type: "email" },
    },
    authorize(credentials) {
      const name = credentials?.name as string | undefined;
      const email = credentials?.email as string | undefined;

      if (!name?.trim() || !email?.trim()) return null;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return null;

      return {
        id: email,
        name: name.trim(),
        email: email.trim().toLowerCase(),
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.unshift(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

function isAdminEmail(email: string | null | undefined): boolean {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  return Boolean(adminEmail && email?.toLowerCase() === adminEmail);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  events: {
    async signIn({ user, account }) {
      if (!user.email || !user.name) return;

      try {
        await registerOrUpdateUser({
          name: user.name,
          email: user.email,
          provider: account?.provider === "google" ? "google" : "email",
        });
      } catch (err) {
        // Don't block login if user persistence fails (e.g. read-only FS)
        console.error("Failed to persist user on sign-in:", err);
      }
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      token.isAdmin = isAdminEmail(token.email as string);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string | undefined;
        session.user.isAdmin = Boolean(token.isAdmin);
      }
      return session;
    },
  },
  trustHost: true,
});
