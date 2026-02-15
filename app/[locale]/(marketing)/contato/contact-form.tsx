"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { contactFormSchema } from "@/lib/validators";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: (fd.get("phone") as string) || undefined,
      message: fd.get("message") as string,
    };
    const parsed = contactFormSchema.safeParse(data);
    if (!parsed.success) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("Erro ao enviar");
      setSent(true);
    } catch {
      setError("Não foi possível enviar. Tente novamente ou use o WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <p className="rounded-md bg-[var(--muted)] p-4 text-[var(--foreground)]">
        Mensagem recebida. Retornaremos em breve.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">Nome *</label>
        <input type="text" name="name" required className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">E-mail *</label>
        <input type="email" name="email" required className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">Telefone</label>
        <input type="tel" name="phone" className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">Mensagem *</label>
        <textarea name="message" required rows={4} className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" variant="accent" disabled={loading}>
        {loading ? "Enviando..." : "Enviar"}
      </Button>
    </form>
  );
}
