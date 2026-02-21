import { prisma } from "@/lib/db";
import { createBoleto, getConsultationAmountCents } from "./boleto.service";
import { addMinutes, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export type PaymentMethod = "boleto" | "pix" | "card";

export interface CreateSchedulingInput {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  subject?: string;
  paymentMethod?: PaymentMethod;
}

export async function createSchedulingWithBoleto(input: CreateSchedulingInput) {
  const scheduling = await prisma.scheduling.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      preferredDate: input.preferredDate,
      preferredTime: input.preferredTime,
      subject: input.subject,
      amountCents: getConsultationAmountCents(),
      status: "pending",
    },
  });

  const [year, month, day] = input.preferredDate.split("-").map(Number);
  const [hour, min] = input.preferredTime.split(":").map(Number);
  const dueDate = format(
    addMinutes(new Date(year, month - 1, day, hour, min), 1),
    "yyyy-MM-dd"
  );

  const paymentMethod = input.paymentMethod ?? "boleto";
  const cpf = (process.env.BOLETO_CPF ?? "46999334838").replace(/\D/g, "");
  const customerCpf = cpf.length >= 11 ? cpf : "00000000000";

  if (process.env.ASAAS_API_KEY && paymentMethod === "pix") {
    try {
      const { createOrGetCustomer, createPayment, getPixQrCode } = await import("./asaas.service");
      const customerId = await createOrGetCustomer({
        name: input.name,
        cpfCnpj: customerCpf,
        email: input.email,
        mobilePhone: input.phone,
      });
      const value = getConsultationAmountCents() / 100;
      const description = "Consulta jurídica inicial - R$ 300,00";
      const payment = await createPayment({
        customerId,
        billingType: "PIX",
        value,
        dueDate,
        description,
        externalReference: scheduling.id,
      });

      await prisma.scheduling.update({
        where: { id: scheduling.id },
        data: {
          boletoId: payment.id,
          boletoUrl: payment.invoiceUrl ?? undefined,
        },
      });

      const pix = await getPixQrCode(payment.id);
      return {
        schedulingId: scheduling.id,
        boletoUrl: payment.invoiceUrl,
        boletoId: payment.id,
        paymentMethod: "pix" as const,
        pixCopyPaste: pix.payload,
        pixQrCodeImage: pix.encodedImage,
      };
    } catch (err) {
      console.error("[Scheduling] Asaas PIX:", err);
      await prisma.scheduling.update({
        where: { id: scheduling.id },
        data: { status: "boleto_error" },
      });
      throw err;
    }
  }

  if (process.env.ASAAS_API_KEY && paymentMethod === "card") {
    try {
      const { createOrGetCustomer, createPayment } = await import("./asaas.service");
      const customerId = await createOrGetCustomer({
        name: input.name,
        cpfCnpj: customerCpf,
        email: input.email,
        mobilePhone: input.phone,
      });
      const value = getConsultationAmountCents() / 100;
      const payment = await createPayment({
        customerId,
        billingType: "BOLETO",
        value,
        dueDate,
        description: "Consulta jurídica inicial - R$ 300,00",
        externalReference: scheduling.id,
      });
      await prisma.scheduling.update({
        where: { id: scheduling.id },
        data: {
          boletoId: payment.id,
          boletoUrl: payment.invoiceUrl ?? payment.bankSlipUrl ?? undefined,
        },
      });
      return {
        schedulingId: scheduling.id,
        boletoUrl: payment.invoiceUrl ?? payment.bankSlipUrl,
        boletoId: payment.id,
        paymentMethod: "card" as const,
      };
    } catch (err) {
      console.error("[Scheduling] Asaas card link:", err);
      await prisma.scheduling.update({
        where: { id: scheduling.id },
        data: { status: "boleto_error" },
      });
      throw err;
    }
  }

  if (process.env.ASAAS_API_KEY && paymentMethod === "boleto") {
    try {
      const { createOrGetCustomer, createPayment } = await import("./asaas.service");
      const customerId = await createOrGetCustomer({
        name: input.name,
        cpfCnpj: customerCpf,
        email: input.email,
        mobilePhone: input.phone,
      });
      const value = getConsultationAmountCents() / 100;
      const payment = await createPayment({
        customerId,
        billingType: "BOLETO",
        value,
        dueDate,
        description: "Consulta jurídica inicial - R$ 300,00",
        externalReference: scheduling.id,
      });

      await prisma.scheduling.update({
        where: { id: scheduling.id },
        data: {
          boletoId: payment.id,
          boletoUrl: payment.bankSlipUrl ?? payment.invoiceUrl ?? undefined,
        },
      });

      return {
        schedulingId: scheduling.id,
        boletoUrl: payment.bankSlipUrl ?? payment.invoiceUrl,
        boletoId: payment.id,
        paymentMethod: "boleto" as const,
      };
    } catch (err) {
      console.error("[Scheduling] Asaas boleto:", err);
    }
  }

  const boleto = await createBoleto({
    customerName: input.name,
    customerEmail: input.email,
    customerCpf: customerCpf,
    description: "Consulta jurídica inicial - R$ 300,00",
    dueDate,
    referenceId: scheduling.id,
  });

  if (!boleto.success) {
    await prisma.scheduling.update({
      where: { id: scheduling.id },
      data: { status: "boleto_error" },
    });
    throw new Error(boleto.error ?? "Falha ao gerar boleto");
  }

  await prisma.scheduling.update({
    where: { id: scheduling.id },
    data: {
      boletoId: boleto.boletoId ?? undefined,
      boletoUrl: boleto.boletoUrl ?? undefined,
    },
  });

  return {
    schedulingId: scheduling.id,
    boletoUrl: boleto.boletoUrl,
    boletoId: boleto.boletoId,
    paymentMethod: "boleto" as const,
  };
}

export async function confirmSchedulingAfterPayment(schedulingId: string) {
  const scheduling = await prisma.scheduling.findUnique({
    where: { id: schedulingId },
  });
  if (!scheduling || scheduling.status !== "pending") return;

  await prisma.scheduling.update({
    where: { id: schedulingId },
    data: { status: "confirmed", confirmedAt: new Date() },
  });

  try {
    let googleEventId: string | null = null;
    if (process.env.GOOGLE_CALENDAR_ENABLED === "true") {
      googleEventId = await createGoogleCalendarEvent(scheduling);
    }
    await prisma.scheduling.update({
      where: { id: schedulingId },
      data: { googleEventId: googleEventId ?? undefined },
    });
    if (process.env.WHATSAPP_WEBHOOK_URL) {
      await notifyWhatsApp(scheduling);
    }
  } catch (err) {
    console.error("[Scheduling] pós-confirmação:", err);
  }
}

async function createGoogleCalendarEvent(scheduling: {
  name: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  subject?: string | null;
}) {
  const { GoogleCalendarService } = await import("./google-calendar.service");
  const [year, month, day] = scheduling.preferredDate.split("-").map(Number);
  const [hour, min] = scheduling.preferredTime.split(":").map(Number);
  const start = new Date(year, month - 1, day, hour, min);
  const end = addMinutes(start, 60);
  return GoogleCalendarService.createEvent({
    summary: `Consulta: ${scheduling.name}`,
    description: scheduling.subject ?? "",
    start,
    end,
    attendeeEmail: scheduling.email,
  });
}

async function notifyWhatsApp(scheduling: {
  name: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
}) {
  const url = process.env.WHATSAPP_WEBHOOK_URL;
  const advogadoNumber = (process.env.WHATSAPP_ADVOGADO_NUMBER ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5511974367189").replace(/\D/g, "");
  const message = `Novo agendamento confirmado: ${scheduling.name}, ${scheduling.preferredDate} às ${scheduling.preferredTime}. Contato do cliente: ${scheduling.phone}.`;
  if (url) {
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: advogadoNumber,
          message,
          clientPhone: scheduling.phone.replace(/\D/g, ""),
        }),
      });
    } catch (err) {
      console.error("[Scheduling] WhatsApp webhook error:", err);
    }
  }
}
