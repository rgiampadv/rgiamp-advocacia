import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `Você é um assistente do site do escritório de advocacia Raphael José Giampietro Fiuza Pequeno (OAB/SP 542.173). 
Responda de forma clara e informativa. O conteúdo é meramente informativo (Provimento 205/2021 OAB).
Não dê orientação jurídica específica nem opinião sobre resultados; para casos concretos, sugira agendar uma consulta.
Áreas de atuação: JEC, Direito do Consumidor e Criminal. Escritório em São Paulo.`;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Chat não configurado. Defina OPENAI_API_KEY no .env." },
        { status: 503 }
      );
    }
    const body = await request.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (messages.length === 0) {
      return NextResponse.json({ error: "Envie pelo menos uma mensagem." }, { status: 400 });
    }
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_CHAT_MODEL ?? "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant" | "system",
          content: String(m.content ?? ""),
        })),
      ],
      max_tokens: 500,
    });
    const content = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ message: content });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao processar pergunta.";
    console.error("[API chat]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
