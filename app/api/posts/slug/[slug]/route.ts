import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { author: { select: { name: true } } },
    });
    if (!post) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao carregar post";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
