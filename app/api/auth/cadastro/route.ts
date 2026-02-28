import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/db";

const MIN_PASSWORD_LENGTH = 6;

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Cadastro temporariamente indisponível." },
      { status: 503 }
    );
  }
  let body: { name?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Dados inválidos. Verifique o formulário." },
      { status: 400 }
    );
  }
  const { name, email, password } = body ?? {};

  const trimmedName = typeof name === "string" ? name.trim() : "";
  const trimmedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const plainPassword = typeof password === "string" ? password : "";

  if (!trimmedName) {
    return NextResponse.json(
      { error: "Nome é obrigatório." },
      { status: 400 }
    );
  }
  if (!trimmedEmail || !plainPassword) {
    return NextResponse.json(
      { error: "E-mail e senha são obrigatórios." },
      { status: 400 }
    );
  }
  if (plainPassword.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.` },
      { status: 400 }
    );
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Já existe uma conta com este e-mail." },
        { status: 409 }
      );
    }

    const passwordHash = await hash(plainPassword, 10);
    await prisma.user.create({
      data: {
        email: trimmedEmail,
        passwordHash,
        name: trimmedName,
      },
    });

    return NextResponse.json({ ok: true, message: "Cadastro realizado. Faça login para acessar." });
  } catch (err: unknown) {
    console.error("[API cadastro]", err);
    const prismaErr = err as { code?: string; meta?: { target?: string[] } };
    if (prismaErr?.code === "P2002") {
      return NextResponse.json(
        { error: "Já existe uma conta com este e-mail." },
        { status: 409 }
      );
    }
    if (prismaErr?.code === "P1001" || prismaErr?.code === "P1002" || prismaErr?.code === "P1017") {
      return NextResponse.json(
        { error: "Banco de dados indisponível. Tente novamente em instantes." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao criar conta. Tente novamente." },
      { status: 500 }
    );
  }
}
