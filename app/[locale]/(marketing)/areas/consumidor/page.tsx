import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "areas.consumer" });
  return { title: t("title"), description: t("description") };
}

export default async function ConsumidorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("areas.consumer");

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-[var(--blue-deep)]">{t("title")}</h1>
      <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">{t("description")}</p>
      <p className="mt-6 text-sm text-[var(--muted-foreground)]">
        O conteúdo desta página é meramente informativo. Cada caso requer análise específica por advogado.
      </p>
    </div>
  );
}
