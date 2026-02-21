import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Auto-detect URL on Vercel (evita página em branco quando NEXTAUTH_URL não está definido)
if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}
// Fallback para permitir preview sem configurar secret (apenas para testes)
if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = process.env.NODE_ENV === "production" ? "preview-" + (process.env.VERCEL_URL ?? "secret") : "dev-secret";
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
