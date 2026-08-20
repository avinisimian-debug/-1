import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { isAdminEmail } from "@/lib/admin";
import { getGoogleClientIdFromEnv } from "@/lib/auth-oauth";
import { registerOrUpdateUser } from "@/lib/users-store";
import { verifyGoogleIdToken } from "@/lib/verify-google-token";
import { verifyEmailOtp } from "@/lib/email-otp";

const providers: Provider[] = [
  Credentials({
    id: "email-otp",
    name: "Email",
    credentials: {
      name: { label: "Name", type: "text" },
      email: { label: "Email", type: "email" },
      otp: { label: "Code", type: "text" },
    },
    async authorize(credentials) {
      const name = credentials?.name as string | undefined;
      const email = credentials?.email as string | undefined;
      const otp = credentials?.otp as string | undefined;

      if (!name?.trim() || !email?.trim() || !otp?.trim()) return null;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return null;

      const normalized = email.trim().toLowerCase();
      const otpValid = await verifyEmailOtp(normalized, otp);
      if (!otpValid) return null;

      return {
        id: normalized,
        name: name.trim(),
        email: normalized,
      };
    },
  }),
];

const envGoogleClientId = getGoogleClientIdFromEnv();
const envGoogleClientSecret =
  process.env.GOOGLE_CLIENT_SECRET ??
  process.env.AUTH_GOOGLE_SECRET ??
  process.env.GOOGLE_SECRET;

if (envGoogleClientId && envGoogleClientSecret?.trim()) {
  providers.unshift(
    Google({
      clientId: envGoogleClientId,
      clientSecret: envGoogleClientSecret.trim(),
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

providers.push(
  Credentials({
    id: "google-credential",
    name: "Google",
    credentials: {
      credential: { label: "Credential", type: "text" },
    },
    async authorize(credentials) {
      const token = credentials?.credential as string | undefined;
      if (!token) return null;
      return verifyGoogleIdToken(token);
    },
  }),
);

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
          provider:
            account?.provider === "google" ||
            account?.provider === "google-credential"
              ? "google"
              : "email",
        });
      } catch (err) {
        console.error("Failed to persist user on sign-in:", err);
      }
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const email = user.email?.trim().toLowerCase();
        token.email = email;
        token.sub = email ?? user.id ?? token.sub;
        token.name = user.name;
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
        session.user.id = (token.sub as string) ?? session.user.email ?? "";
      }
      return session;
    },
  },
  trustHost: true,
});
