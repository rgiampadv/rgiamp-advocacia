import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { Link } from "@/i18n/routing";
import { PostForm } from "./post-form";
import { PostList } from "./post-list";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminBlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  let posts: Awaited<ReturnType<typeof prisma.post.findMany>> = [];
  try {
    posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    });
  } catch {
    // DB indisponível
  }

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--blue-deep)]">{t("blogTitle")}</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">{t("blogDesc")}</p>
        </div>
        <Link
          href="/blog"
          className="text-sm text-[var(--gold)] hover:underline"
        >
          {t("viewBlog")}
        </Link>
      </div>

      <PostForm />
      <PostList initialPosts={posts} />
    </div>
  );
}
