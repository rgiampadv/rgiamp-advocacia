import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseLawsuitFromTribunal } from "@/services/tribunal.service";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const lawsuits = await prisma.lawsuit.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ lawsuits });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao carregar processos";
    const isDbError = msg.includes("DATABASE_URL") || msg.includes("connect");
    return NextResponse.json(
      { error: isDbError ? "Configure o banco de dados na Vercel." : msg },
      { status: isDbError ? 503 : 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const number = String(body?.number ?? "").trim().replace(/\D/g, "");
    if (number.length < 10) {
      return NextResponse.json(
        { error: "Número do processo inválido." },
        { status: 400 }
      );
    }
    const formatted = formatProcessNumber(number);
    const existing = await prisma.lawsuit.findUnique({
      where: {
        userId_number: { userId: session.user.id, number: formatted },
      },
    });
    if (existing) {
      return NextResponse.json({ lawsuit: existing });
    }
    const parsed = await parseLawsuitFromTribunal(formatted);
    const lawsuit = await prisma.lawsuit.upsert({
      where: {
        userId_number: { userId: session.user.id, number: formatted },
      },
      create: {
        userId: session.user.id,
        number: formatted,
        court: parsed.court,
        summary: parsed.summary,
        lastUpdate: parsed.lastUpdate,
        nextSteps: parsed.nextSteps,
        rawData: (parsed.rawData ?? undefined) as Prisma.InputJsonValue | undefined,
      },
      update: {
        court: parsed.court,
        summary: parsed.summary,
        lastUpdate: parsed.lastUpdate,
        nextSteps: parsed.nextSteps,
        rawData: (parsed.rawData ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
    return NextResponse.json({ lawsuit });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao consultar processo";
    const isDbError = msg.includes("DATABASE_URL") || msg.includes("connect");
    console.error("[API lawsuits]", msg);
    return NextResponse.json(
      { error: isDbError ? "Configure o banco de dados na Vercel." : msg },
      { status: isDbError ? 503 : 500 }
    );
  }
}

function formatProcessNumber(digits: string): string {
  const d = digits.replace(/\D/g, "");
  if (d.length < 20) return digits.trim() || d;
  return `${d.slice(0, 7)}-${d.slice(7, 9)}.${d.slice(9, 13)}.${d.slice(13, 14)}.${d.slice(14, 16)}.${d.slice(16, 20)}`;
}
