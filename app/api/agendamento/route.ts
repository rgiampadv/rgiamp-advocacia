import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/lib/db";
import { schedulingFormSchema } from "@/lib/validators";
import { createSchedulingWithBoleto } from "@/services/scheduling.service";

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Serviço de agendamento temporariamente indisponível. Configure DATABASE_URL no ambiente." },
      { status: 503 }
    );
  }
  try {
    const body = await request.json();
    const parsed = schedulingFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const result = await createSchedulingWithBoleto(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao criar agendamento";
    const isDbError = msg.includes("DATABASE_URL") || msg.includes("connect") || msg.includes("Connection") || msg.includes("connection");
    const message = isDbError ? "Não foi possível conectar ao banco de dados. Tente novamente em instantes ou entre em contato pelo WhatsApp." : msg;
    console.error("[API agendamento]", msg);
    return NextResponse.json({ error: message }, { status: isDbError ? 503 : 500 });
  }
}
