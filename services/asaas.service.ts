/**
 * Integração Asaas: cliente, cobrança Boleto, PIX e link para cartão.
 * Requer ASAAS_API_KEY. Para PIX/cartão o cliente é criado ou reutilizado.
 */

const ASAAS_BASE = "https://api.asaas.com/v3";

export type BillingType = "BOLETO" | "PIX" | "CREDIT_CARD";

export interface AsaasCustomerInput {
  name: string;
  cpfCnpj: string;
  email: string;
  mobilePhone?: string;
}

export interface AsaasPaymentInput {
  customerId: string;
  billingType: BillingType;
  value: number;
  dueDate: string;
  description: string;
  externalReference: string;
}

export interface AsaasPaymentResult {
  id: string;
  invoiceUrl?: string;
  bankSlipUrl?: string;
  status?: string;
}

export interface AsaasPixQrCode {
  encodedImage: string;
  payload: string;
  expirationDate: string;
}

function getApiKey(): string {
  const key = process.env.ASAAS_API_KEY;
  if (!key) throw new Error("ASAAS_API_KEY não configurada.");
  return key;
}

/** Cria ou busca cliente por CPF/CNPJ. Retorna o ID do cliente no Asaas. */
export async function createOrGetCustomer(input: AsaasCustomerInput): Promise<string> {
  const apiKey = getApiKey();
  const cpfCnpj = input.cpfCnpj.replace(/\D/g, "");
  if (cpfCnpj.length < 11) throw new Error("CPF/CNPJ inválido.");

  const listRes = await fetch(`${ASAAS_BASE}/customers?cpfCnpj=${cpfCnpj}`, {
    headers: { access_token: apiKey },
  });
  const listData = await listRes.json();
  if (listRes.ok && listData.data?.length > 0) {
    return listData.data[0].id;
  }

  const createRes = await fetch(`${ASAAS_BASE}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      access_token: apiKey,
    },
    body: JSON.stringify({
      name: input.name,
      cpfCnpj: cpfCnpj,
      email: input.email,
      mobilePhone: (input.mobilePhone ?? "").replace(/\D/g, "").slice(0, 11) || undefined,
    }),
  });
  const createData = await createRes.json();
  if (!createRes.ok) {
    throw new Error(createData.errors?.[0]?.description ?? "Erro ao criar cliente Asaas");
  }
  return createData.id;
}

/** Cria cobrança (BOLETO, PIX ou CREDIT_CARD). Para cartão, use invoiceUrl na página do Asaas. */
export async function createPayment(input: AsaasPaymentInput): Promise<AsaasPaymentResult> {
  const apiKey = getApiKey();
  const res = await fetch(`${ASAAS_BASE}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      access_token: apiKey,
    },
    body: JSON.stringify({
      customer: input.customerId,
      billingType: input.billingType,
      value: input.value,
      dueDate: input.dueDate,
      description: input.description,
      externalReference: input.externalReference,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.errors?.[0]?.description ?? "Erro ao criar cobrança Asaas");
  }
  return {
    id: data.id,
    invoiceUrl: data.invoiceUrl,
    bankSlipUrl: data.bankSlipUrl,
    status: data.status,
  };
}

/** Retorna QR Code PIX (copia e cola + imagem base64) para uma cobrança PIX. */
export async function getPixQrCode(paymentId: string): Promise<AsaasPixQrCode> {
  const apiKey = getApiKey();
  const res = await fetch(`${ASAAS_BASE}/payments/${paymentId}/pixQrCode`, {
    headers: { access_token: apiKey },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.errors?.[0]?.description ?? "Erro ao obter QR Code PIX");
  }
  return {
    encodedImage: data.encodedImage ?? "",
    payload: data.payload ?? "",
    expirationDate: data.expirationDate ?? "",
  };
}
