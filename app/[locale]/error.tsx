"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LocaleError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  const router = useRouter();

  useEffect(() => {
    console.error("[LocaleError]", error.message, error.digest);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <h1 className="text-2xl font-bold text-[var(--blue-deep)]">
        Algo deu errado
      </h1>
      <p className="mt-2 max-w-md text-center text-[var(--muted-foreground)]">
        Ocorreu um erro ao carregar esta página. Tente novamente ou volte ao início.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-[var(--gold)] px-6 py-2.5 font-medium text-[var(--blue-deep)] hover:bg-[var(--gold-light)]"
        >
          Tentar novamente
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-md border border-[var(--border)] px-6 py-2.5 font-medium hover:bg-[var(--muted)]"
        >
          Ir para o início
        </button>
      </div>
    </div>
  );
}
