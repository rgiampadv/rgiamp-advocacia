import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }
  const { id } = await params;
  try {
    const body = await request.json();
    const title = body?.title !== undefined ? String(body.title).trim() : undefined;
    const excerpt = body?.excerpt !== undefined ? String(body.excerpt).trim() : undefined;
    const content = body?.content !== undefined ? String(body.content).trim() : undefined;
    let slug = body?.slug;
    if (slug !== undefined) {
      slug = String(slug)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }

    if (slug && slug !== existing.slug) {
      const conflict = await prisma.post.findUnique({ where: { slug } });
      if (conflict) {
        return NextResponse.json({ error: "Já existe um post com esse slug." }, { status: 400 });
      }
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(slug !== undefined && { slug }),
      },
    });
    return NextResponse.json({ post });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao atualizar post";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }
  const { id } = await params;
  try {
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao excluir post";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
