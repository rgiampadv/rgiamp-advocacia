import { setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function CookiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-[var(--blue-deep)]">Uso de cookies</h1>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
        Conformidade com a LGPD e transparência sobre o uso de cookies.
      </p>
      <div className="mt-8 space-y-4 text-[var(--foreground)]">
        <p>
          Utilizamos cookies para memorizar sua preferência de consentimento, idioma e melhorar a navegação. Não utilizamos cookies para publicidade dirigida sem seu consentimento.
        </p>
        <p>
          Você pode alterar suas preferências a qualquer momento nas configurações do navegador ou recusando no banner exibido no site.
        </p>
      </div>
    </div>
  );
}
