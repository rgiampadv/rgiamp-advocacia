import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        createdAt: true,
        author: { select: { name: true } },
      },
    });
    return NextResponse.json({ posts });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao carregar posts";
    const isDbError = msg.includes("DATABASE_URL") || msg.includes("connect");
    return NextResponse.json(
      { error: isDbError ? "Configure o banco de dados." : msg },
      { status: isDbError ? 503 : 500 }
    );
  }
}

export async function POST(request: Request) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const title = String(body?.title ?? "").trim();
    const excerpt = String(body?.excerpt ?? "").trim();
    const content = String(body?.content ?? "").trim();
    const slug =
      String(body?.slug ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") || title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    if (!title) {
      return NextResponse.json({ error: "Título é obrigatório." }, { status: 400 });
    }

    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Já existe um post com esse slug." }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        slug,
        title,
        excerpt: excerpt || title,
        content: content || "",
        authorId: session.user.id,
      },
    });
    return NextResponse.json({ post });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao criar post";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
