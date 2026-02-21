"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

function LoginForm() {
  const t = useTranslations("nav");
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "pt";
  const searchParams = useSearchParams();
  const callbackPath = searchParams.get("callbackUrl") ?? "/area-do-cliente";
  const callbackUrl = callbackPath.startsWith("/") ? `/${locale}${callbackPath}` : `/${locale}/area-do-cliente`;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("E-mail ou senha incorretos.");
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Erro ao entrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-[var(--blue-deep)]">{t("clientArea")}</h1>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
        Acesse com e-mail e senha para acompanhar seus processos.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" variant="accent" className="w-full" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-[var(--muted-foreground)]">
        Não tem conta? <Link href="/cadastro" className="text-[var(--gold)] hover:underline">Cadastre-se</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
      <Suspense fallback={<div className="w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 animate-pulse" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
