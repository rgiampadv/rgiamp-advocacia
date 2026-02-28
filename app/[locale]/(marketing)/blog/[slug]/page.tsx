import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/db";

type Props = Readonly<{ params: Promise<{ locale: string; slug: string }> }>;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, excerpt: true },
  });
  if (!post) return { title: "Post não encontrado" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");

  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  });

  if (!post) notFound();

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--gold)]"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t("backToBlog")}
      </Link>
      <article className="mt-8 max-w-3xl">
        <time className="text-sm text-[var(--muted-foreground)]" dateTime={post.createdAt.toISOString()}>
          {post.createdAt.toLocaleDateString(locale, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>
        <h1 className="mt-2 text-3xl font-bold text-[var(--blue-deep)]">{post.title}</h1>
        {post.author?.name && (
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">{post.author.name}</p>
        )}
        <div className="prose prose-invert mt-8 max-w-none">
          <p className="whitespace-pre-wrap text-[var(--muted-foreground)]">{post.content}</p>
        </div>
      </article>
    </div>
  );
}
