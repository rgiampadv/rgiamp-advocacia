import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Lista de e-mails com permissão de administrador do site.
 * Configure ADMIN_EMAILS no .env (ex: ADMIN_EMAILS=seu@email.com,outro@email.com)
 */
function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Verifica se o usuário logado é administrador */
export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return false;
  const admins = getAdminEmails();
  if (admins.length === 0) return false;
  return admins.includes(session.user.email.toLowerCase());
}
