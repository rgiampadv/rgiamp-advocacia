import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function CadastroLayout({
  children,
}: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    redirect("/area-do-cliente");
  }
  return <>{children}</>;
}
