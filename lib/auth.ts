import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import { compare } from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: { id: string; email: string; name?: string | null; image?: string | null };
  }
}

// Garante secret definido antes de qualquer uso (layout, getServerSession, etc.)
if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET =
    process.env.NODE_ENV === "production"
      ? "preview-" + (process.env.VERCEL_URL ?? "secret")
      : "dev-secret";
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          if (!user?.passwordHash) return null;
          const ok = await compare(credentials.password, user.passwordHash);
          if (!ok) return null;
          return { id: user.id, email: user.email, name: user.name, image: user.image };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      if (session.user) session.user.id = token.sub!;
      return session;
    },
    jwt: ({ token, user }) => {
      if (user) token.sub = user.id;
      return token;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
};
