/**
 * Serviço de geração de boletos (Asaas ou PagSeguro).
 * Configure ASAAS_API_KEY ou PAGSEGURO_* nas variáveis de ambiente.
 * Dados bancários: Banco C6 (336), Ag 0001, Conta 0000-017110431-5, CPF 469.993.348-38
 */

export interface BoletoRequest {
  amountCents: number;
  customerName: string;
  customerEmail: string;
  customerCpf: string;
  description: string;
  dueDate: string;
  referenceId: string;
}

export interface BoletoResponse {
  success: boolean;
  boletoId?: string;
  boletoUrl?: string;
  error?: string;
}

const CONSULTATION_AMOUNT_CENTS = 30000; // R$ 300,00

export function getConsultationAmountCents(): number {
  return CONSULTATION_AMOUNT_CENTS;
}

export async function createBoleto(
  request: Omit<BoletoRequest, "amountCents"> & { amountCents?: number }
): Promise<BoletoResponse> {
  const payload: BoletoRequest = {
    ...request,
    amountCents: request.amountCents ?? CONSULTATION_AMOUNT_CENTS,
  };

  try {
    if (process.env.ASAAS_API_KEY) {
      return await createBoletoAsaas(payload);
    }
    if (process.env.PAGSEGURO_EMAIL && process.env.PAGSEGURO_TOKEN) {
      return await createBoletoPagSeguro(payload);
    }
    return mockBoleto(payload);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao gerar boleto";
    console.error("[BoletoService]", message);
    return { success: false, error: message };
  }
}

async function createBoletoAsaas(payload: BoletoRequest): Promise<BoletoResponse> {
  const apiKey = process.env.ASAAS_API_KEY!;
  const res = await fetch("https://api.asaas.com/v3/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      access_token: apiKey,
    },
    body: JSON.stringify({
      billingType: "BOLETO",
      value: payload.amountCents / 100,
      dueDate: payload.dueDate,
      description: payload.description,
      externalReference: payload.referenceId,
      customer: payload.customerCpf,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: data.errors?.[0]?.description ?? "Asaas error" };
  }
  return {
    success: true,
    boletoId: data.id,
    boletoUrl: data.invoiceUrl ?? data.bankSlipUrl,
  };
}

async function createBoletoPagSeguro(payload: BoletoRequest): Promise<BoletoResponse> {
  // PagSeguro API de boletos - implementação similar com env PAGSEGURO_*
  const email = process.env.PAGSEGURO_EMAIL!;
  const token = process.env.PAGSEGURO_TOKEN!;
  const res = await fetch(
    `https://ws.pagseguro.uol.com.br/v4/charges?email=${email}&token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference_id: payload.referenceId,
        description: payload.description,
        amount: { value: payload.amountCents, currency: "BRL" },
        payment_method: {
          type: "BOLETO",
          boleto: {
            due_date: payload.dueDate,
            instruction_lines: { line_1: "Consulta jurídica R$ 300,00" },
            holder: {
              name: payload.customerName,
              tax_id: payload.customerCpf.replace(/\D/g, ""),
              email: payload.customerEmail,
            },
          },
        },
      }),
    }
  );
  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: data.error_message ?? "PagSeguro error" };
  }
  const boleto = data.payment_method?.boleto;
  return {
    success: true,
    boletoId: data.id,
    boletoUrl: boleto?.link ?? boleto?.pdf?.href,
  };
}

function mockBoleto(payload: BoletoRequest): BoletoResponse {
  if (process.env.NODE_ENV === "production") {
    return { success: false, error: "Nenhum gateway de boleto configurado (ASAAS ou PAGSEGURO)." };
  }
  return {
    success: true,
    boletoId: `mock-${payload.referenceId}`,
    boletoUrl: "#boleto-mock",
  };
}
