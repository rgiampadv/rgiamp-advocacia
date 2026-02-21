import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LawsuitTracker } from "./lawsuit-tracker";

export default async function AreaDoClientePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  let lawsuits: Awaited<ReturnType<typeof prisma.lawsuit.findMany>> = [];
  try {
    lawsuits = await prisma.lawsuit.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    });
  } catch {
    // DATABASE_URL não configurado ou indisponível
  }

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--blue-deep)]">Área do Cliente</h1>
      <p className="mt-1 text-[var(--muted-foreground)]">
        Acompanhe a situação dos seus processos. Os dados são obtidos via consulta aos tribunais.
      </p>
      <LawsuitTracker initialLawsuits={lawsuits} />
    </div>
  );
}
