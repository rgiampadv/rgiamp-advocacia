import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    // Integrar com e-mail (Resend, SendGrid, etc.) ou WhatsApp Business API
    if (process.env.CONTACT_WEBHOOK_URL) {
      await fetch(process.env.CONTACT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[API contato]", err);
    return NextResponse.json({ error: "Erro ao enviar" }, { status: 500 });
  }
}
