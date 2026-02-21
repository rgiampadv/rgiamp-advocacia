import { NextResponse } from "next/server";
import { confirmSchedulingAfterPayment } from "@/services/scheduling.service";

/**
 * Webhook para confirmação de pagamento do boleto (Asaas ou PagSeguro).
 * Configure no painel do gateway para apontar para: POST /api/webhook/boleto
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const schedulingId =
      body.payment?.externalReference ??
      body.externalReference ??
      body.payment?.id ??
      body.reference_id ??
      body.referenceId;
    if (!schedulingId || typeof schedulingId !== "string") {
      return NextResponse.json({ received: true });
    }
    const status =
      body.payment?.status ??
      body.status ??
      body.event;
    const paid = ["CONFIRMED", "RECEIVED", "PAID", "payment_confirmed"].includes(
      String(status).toUpperCase()
    );
    if (paid) {
      await confirmSchedulingAfterPayment(schedulingId);
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Webhook boleto]", err);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
