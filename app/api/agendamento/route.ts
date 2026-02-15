import { NextResponse } from "next/server";
import { schedulingFormSchema } from "@/lib/validators";
import { createSchedulingWithBoleto } from "@/services/scheduling.service";

export async function POST(request: Request) {
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
    const message = err instanceof Error ? err.message : "Erro ao criar agendamento";
    console.error("[API agendamento]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
