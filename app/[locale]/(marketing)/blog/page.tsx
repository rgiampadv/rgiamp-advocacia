import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

type Props = Readonly<{ params: Promise<{ locale: string }> }>;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return { title: t("title"), description: t("description") };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const admin = await isAdmin();

  let posts: { slug: string; title: string; excerpt: string; createdAt: Date }[] = [];
  try {
    posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      select: { slug: true, title: true, excerpt: true, createdAt: true },
    });
  } catch {
    // DB indisponível
  }

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--blue-deep)]">{t("title")}</h1>
          <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">{t("description")}</p>
        </div>
        {admin && (
          <Button asChild variant="accent" size="sm" className="shrink-0">
            <Link href="/admin/blog">{t("createPost")}</Link>
          </Button>
        )}
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="flex flex-col rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 transition-colors hover:border-[var(--gold)]"
          >
            <time className="text-sm text-[var(--muted-foreground)]" dateTime={post.createdAt.toISOString()}>
              {post.createdAt.toLocaleDateString(locale, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <h2 className="mt-2 text-xl font-semibold text-[var(--blue-deep)]">
              <Link href={`/blog/${post.slug}`} className="hover:text-[var(--gold)]">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 flex-1 text-sm text-[var(--muted-foreground)] line-clamp-3">
              {post.excerpt}
            </p>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-4 text-sm font-medium text-[var(--gold)] hover:underline"
            >
              {t("readMore")}
            </Link>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="mt-12 text-center text-[var(--muted-foreground)]">{t("empty")}</p>
      )}
    </div>
  );
}
