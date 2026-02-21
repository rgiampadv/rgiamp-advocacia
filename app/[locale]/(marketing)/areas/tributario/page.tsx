import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { whatsAppUrl } from "@/lib/whatsapp";

type Props = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "areas.tributario" });
  return { title: t("title"), description: t("description") };
}

export default async function TributarioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("areas.tributario");
  const tArea = await getTranslations("areas");

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-[var(--blue-deep)]">{t("title")}</h1>

      <div className="mt-6 max-w-3xl space-y-4 text-[var(--muted-foreground)]">
        <p>
          A gestão tributária é parte essencial da saúde financeira de qualquer empresa. Decisões inadequadas ou ausência de planejamento podem gerar custos elevados, autuações fiscais e insegurança jurídica.
        </p>
        <p>
          Atuo de forma consultiva e estratégica em matéria tributária, com foco na análise de impactos fiscais, planejamento lícito, avaliação de riscos e apoio jurídico à tomada de decisões empresariais, sempre observando a legislação vigente e a jurisprudência aplicável.
        </p>
      </div>

      <h2 className="mt-10 text-xl font-semibold text-[var(--blue-deep)]">
        Atuação consultiva
      </h2>
      <ul className="mt-3 list-inside list-disc space-y-1 text-[var(--muted-foreground)]">
        <li>análise de enquadramento tributário</li>
        <li>avaliação de impacto de alterações legislativas</li>
        <li>revisão de carga tributária e riscos fiscais</li>
        <li>apoio jurídico em decisões empresariais</li>
        <li>orientação preventiva e estratégica</li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold text-[var(--blue-deep)]">
        Importante
      </h2>
      <p className="mt-3 max-w-3xl text-[var(--muted-foreground)]">
        Cada situação tributária é única e depende de análise técnica individualizada. A atuação jurídica é sempre pautada pela legalidade, pela prudência e pela transparência quanto aos riscos envolvidos.
      </p>
      <p className="mt-4 text-sm text-[var(--muted-foreground)]">
        Não há garantia de resultados, e eventuais medidas judiciais dependem de análise prévia do caso concreto.
      </p>

      <div className="mt-12 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-6">
        <p className="text-sm text-[var(--muted-foreground)]">
          {tArea("consultDisclaimer")}
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Button asChild size="lg" variant="accent">
            <Link href="/agendar">{tArea("ctaScheduleTax")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-[var(--blue-deep)]">
            <a
              href={whatsAppUrl("Olá, gostaria de agendar uma consulta sobre Direito Tributário empresarial.")}
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
