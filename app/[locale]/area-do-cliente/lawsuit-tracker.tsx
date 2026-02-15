"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Lawsuit = {
  id: string;
  number: string;
  court: string | null;
  summary: string | null;
  lastUpdate: string | null;
  nextSteps: string | null;
};

export function LawsuitTracker({ initialLawsuits }: { initialLawsuits: Lawsuit[] }) {
  const [lawsuits, setLawsuits] = useState(initialLawsuits);
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/lawsuits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: number.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao adicionar processo");
      setLawsuits((prev) => [data.lawsuit, ...prev]);
      setNumber("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <form onSubmit={handleAdd} className="flex flex-wrap gap-2">
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Número do processo (ex: 0000000-00.0000.0.00.0000)"
          className="min-w-[200px] flex-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
        />
        <Button type="submit" variant="accent" disabled={loading}>
          {loading ? "Consultando..." : "Consultar processo"}
        </Button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <p className="text-xs text-[var(--muted-foreground)]">
        A consulta utiliza dados disponíveis nos portais dos tribunais. O resumo é gerado de forma automática (parser jurídico) e não substitui orientação do advogado.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {lawsuits.map((l) => (
          <Card key={l.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-[var(--blue-deep)]">
                {l.number}
              </CardTitle>
              {l.court && (
                <p className="text-xs text-[var(--muted-foreground)]">{l.court}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {l.summary && (
                <p><span className="font-medium">Situação:</span> {l.summary}</p>
              )}
              {l.lastUpdate && (
                <p><span className="font-medium">Último andamento:</span> {l.lastUpdate}</p>
              )}
              {l.nextSteps && (
                <p><span className="font-medium">Próximos passos:</span> {l.nextSteps}</p>
              )}
              {!l.summary && !l.lastUpdate && (
                <p className="text-[var(--muted-foreground)]">Aguardando consulta ao tribunal.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {lawsuits.length === 0 && (
        <p className="text-center text-[var(--muted-foreground)]">
          Nenhum processo cadastrado. Adicione o número acima para consultar.
        </p>
      )}
    </div>
  );
}
