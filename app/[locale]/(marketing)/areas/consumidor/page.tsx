import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { whatsAppUrl } from "@/lib/whatsapp";

type Props = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "areas.consumer" });
  return { title: t("title"), description: t("description") };
}

export default async function ConsumidorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("areas.consumer");
  const tArea = await getTranslations("areas");

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-[var(--blue-deep)]">{t("title")}</h1>

      <div className="mt-6 max-w-3xl space-y-4 text-[var(--muted-foreground)]">
        <p>
          As relações de consumo nem sempre são equilibradas. Cobranças abusivas, falhas na prestação de serviços, contratos confusos e práticas inadequadas podem gerar prejuízos financeiros e transtornos ao consumidor.
        </p>
        <p>
          Atuo de forma técnica e estratégica, avaliando cada caso de maneira individual, buscando a solução mais adequada — seja por via administrativa, acordo ou ação judicial — sempre com foco na proteção dos direitos do cliente e na prevenção de novos conflitos.
        </p>
      </div>

      <h2 className="mt-10 text-xl font-semibold text-[var(--blue-deep)]">
        Atuação comum
      </h2>
      <ul className="mt-3 list-inside list-disc space-y-1 text-[var(--muted-foreground)]">
        <li>revisão de contratos de consumo</li>
        <li>cobranças indevidas</li>
        <li>falhas na prestação de serviços</li>
        <li>indenizações quando juridicamente cabíveis</li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold text-[var(--blue-deep)]">
        Diferencial (IMPORTANTE)
      </h2>
      <p className="mt-3 max-w-3xl text-[var(--muted-foreground)]">
        Meu trabalho prioriza clareza, orientação jurídica consciente e decisões baseadas em risco, evitando demandas aventureiras e expectativas irreais.
      </p>

      <div className="mt-12 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-6">
        <p className="text-sm text-[var(--muted-foreground)]">
          {tArea("consultDisclaimer")}
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Button asChild size="lg" variant="accent">
            <Link href="/agendar">{tArea("ctaSchedule")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-[var(--blue-deep)]">
            <a
              href={whatsAppUrl("Olá, gostaria de agendar uma consulta sobre Direito do Consumidor.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar no WhatsApp"
            >
              {tArea("ctaWhatsApp")}
            </a>
          </Button>
        </div>
      </div>

      <p className="mt-8 text-sm text-[var(--muted-foreground)]">
        O conteúdo desta página é meramente informativo. Cada caso requer análise específica por advogado.
      </p>
    </div>
  );
}
