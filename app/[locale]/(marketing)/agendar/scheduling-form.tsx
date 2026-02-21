"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { schedulingFormSchema, type SchedulingFormData } from "@/lib/validators";

const CONSULTATION_PRICE = 30000;

export function SchedulingForm() {
  const t = useTranslations("schedule");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [boletoUrl, setBoletoUrl] = useState<string | null>(null);
  const [pixCopyPaste, setPixCopyPaste] = useState<string | null>(null);
  const [pixQrCodeImage, setPixQrCodeImage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"boleto" | "pix" | "card">("boleto");
  const [form, setForm] = useState<Partial<SchedulingFormData>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const dates = getNextDays(14);
  const times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

  const handleStep1 = (date: string, time: string) => {
    setForm((f) => ({ ...f, preferredDate: date, preferredTime: time }));
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      preferredDate: form.preferredDate!,
      preferredTime: form.preferredTime!,
      subject: (fd.get("subject") as string) || undefined,
      paymentMethod,
    };
    const parsed = schedulingFormSchema.safeParse(data);
    if (!parsed.success) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/agendamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = (json as { error?: string }).error ?? "Erro ao gerar pagamento.";
        setError(msg);
        return;
      }
      setBoletoUrl(json.boletoUrl ?? null);
      setPixCopyPaste(json.pixCopyPaste ?? null);
      setPixQrCodeImage(json.pixQrCodeImage ?? null);
      setPaymentMethod((json.paymentMethod as "boleto" | "pix" | "card") ?? "boleto");
      setStep(3);
    } catch (err) {
      const isNetwork = err instanceof TypeError && (err.message === "Failed to fetch" || err.message === "Load failed");
      let message = "Erro ao agendar.";
      if (isNetwork) message = "Não foi possível conectar ao servidor. Verifique sua internet ou tente novamente. Se o problema continuar, entre em contato pelo WhatsApp.";
      else if (err instanceof Error) message = err.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 3 && (boletoUrl || pixCopyPaste)) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-lg font-semibold text-[var(--blue-deep)]">{t("step3")}</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Após o pagamento, você receberá a confirmação por e-mail.
        </p>

        {pixCopyPaste && (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-medium text-[var(--foreground)]">Pague via PIX (copia e cola ou QR Code):</p>
            <div className="flex flex-col gap-2">
              <textarea
                readOnly
                value={pixCopyPaste}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--muted)]/50 p-3 text-xs font-mono"
                rows={4}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(pixCopyPaste)}
              >
                Copiar código PIX
              </Button>
            </div>
            {pixQrCodeImage && (
              <div className="flex justify-center">
                <img
                  src={`data:image/png;base64,${pixQrCodeImage}`}
                  alt="QR Code PIX"
                  className="h-48 w-48 rounded border border-[var(--border)]"
                />
              </div>
            )}
          </div>
        )}

        {paymentMethod === "card" && boletoUrl && (
          <Button asChild className="mt-4">
            <a href={boletoUrl} target="_blank" rel="noopener noreferrer">
              Pagar com cartão (página segura Asaas)
            </a>
          </Button>
        )}

        {paymentMethod === "boleto" && boletoUrl && (
          <Button asChild className="mt-4">
            <a href={boletoUrl} target="_blank" rel="noopener noreferrer">
              Ver / Imprimir boleto
            </a>
          </Button>
        )}

        {!pixCopyPaste && paymentMethod !== "card" && paymentMethod !== "boleto" && boletoUrl && (
          <Button asChild className="mt-4">
            <a href={boletoUrl} target="_blank" rel="noopener noreferrer">
              Ver boleto / pagamento
            </a>
          </Button>
        )}
      </div>
    );
  }

  if (step === 2) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Nome *</label>
          <input
            type="text"
            name="name"
            required
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">E-mail *</label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Telefone (com DDD) *</label>
          <input
            type="tel"
            name="phone"
            required
            placeholder="(11) 99999-9999"
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Assunto (opcional)</label>
          <input
            type="text"
            name="subject"
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Forma de pagamento</label>
          <div className="flex flex-wrap gap-2">
            {(["boleto", "pix", "card"] as const).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                  paymentMethod === method
                    ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--blue-deep)]"
                    : "border-[var(--border)] hover:bg-[var(--muted)]"
                }`}
              >
                {method === "boleto" && "Boleto"}
                {method === "pix" && "PIX"}
                {method === "card" && "Cartão (crédito/débito)"}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-[var(--muted-foreground)]">
          Data: {form.preferredDate} às {form.preferredTime}. Valor: R$ {(CONSULTATION_PRICE / 100).toFixed(2)}.
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => setStep(1)}>
            Voltar
          </Button>
          <Button type="submit" variant="accent" disabled={loading}>
            {loading ? "Gerando pagamento..." : paymentMethod === "pix" ? "Gerar PIX" : paymentMethod === "card" ? "Ir para pagamento com cartão" : "Gerar boleto"}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-[var(--blue-deep)]">{t("step1")}</h2>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">Selecione a data e depois o horário.</p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {dates.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setSelectedDate(d)}
            className={`rounded-md border py-2 text-sm transition-colors ${
              selectedDate === d
                ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--blue-deep)]"
                : "border-[var(--border)] hover:bg-[var(--muted)]"
            }`}
          >
            {formatDateLabel(d)}
          </button>
        ))}
      </div>
      {selectedDate && (
        <>
          <p className="mt-4 text-sm font-medium text-[var(--foreground)]">Horário para {formatDateLabel(selectedDate)}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {times.map((time) => (
              <button
                key={time}
                type="button"
                className="rounded-md border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--muted)] focus:ring-2 focus:ring-[var(--gold)]"
                onClick={() => handleStep1(selectedDate, time)}
              >
                {time}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function formatDateLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", weekday: "short" });
}

function getNextDays(n: number): string[] {
  const out: string[] = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    out.push(d.toISOString().slice(0, 10));
  }
  return out.slice(0, 7);
}
