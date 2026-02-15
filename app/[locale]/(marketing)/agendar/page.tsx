import { getTranslations, setRequestLocale } from "next-intl/server";
import { SchedulingForm } from "./scheduling-form";

type Props = { params: Promise<{ locale: string }> };

export default async function AgendarPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("schedule");

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-[var(--blue-deep)]">{t("title")}</h1>
      <p className="mt-2 text-[var(--gold)] font-medium">{t("price")}</p>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">{t("priceNote")}</p>
      <div className="mt-10 max-w-xl">
        <SchedulingForm />
      </div>
    </div>
  );
}
