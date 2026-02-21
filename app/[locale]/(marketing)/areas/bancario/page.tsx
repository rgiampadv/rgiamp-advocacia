import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { whatsAppUrl } from "@/lib/whatsapp";

type Props = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "areas.bancario" });
  return { title: t("title"), description: t("description") };
}

export default async function BancarioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("areas.bancario");
  const tArea = await getTranslations("areas");

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-[var(--blue-deep)]">{t("title")}</h1>

      <div className="mt-6 max-w-3xl space-y-4 text-[var(--muted-foreground)]">
        <p>
          As relações com instituições financeiras exigem atenção técnica, clareza contratual e análise estratégica. Contratos bancários, cobranças, renegociações e disputas financeiras podem gerar impactos relevantes no patrimônio de pessoas físicas e empresas quando não são devidamente avaliados.
        </p>
        <p>
          Minha atuação em Direito Bancário é voltada à análise técnica de contratos, negociação estratégica de dívidas e defesa jurídica em demandas bancárias, sempre com foco na mitigação de riscos, previsibilidade de resultados e condução responsável do caso.
        </p>
      </div>

      <h2 className="mt-10 text-xl font-semibold text-[var(--blue-deep)]">
        Atuação comum
      </h2>
      <ul className="mt-3 list-inside list-disc space-y-1 text-[var(--muted-foreground)]">
        <li>revisão de contratos bancários</li>
        <li>análise de juros, encargos e cláusulas financeiras</li>
        <li>negociação e reestruturação de dívidas</li>
        <li>defesa em ações de cobrança e execuções</li>
        <li>atuação em demandas bancárias no Juizado Especial e Justiça Comum</li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold text-[var(--blue-deep)]">
        Como funciona
      </h2>
      <p className="mt-3 max-w-3xl text-[var(--muted-foreground)]">
        Cada caso passa por uma avaliação prévia de viabilidade, na qual são analisados riscos, alternativas jurídicas e a estratégia mais adequada, inclusive a possibilidade de solução consensual quando vantajosa ao cliente.
      </p>
      <p className="mt-4 text-sm text-[var(--muted-foreground)]">
        Os valores e estratégias variam conforme a complexidade do caso e são informados previamente.
      </p>

      <div className="mt-12 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-6">
        <p className="text-sm text-[var(--muted-foreground)]">
          {tArea("consultDisclaimer")}
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Button asChild size="lg" variant="accent">
            <Link href="/agendar">{tArea("ctaRequestContractAnalysis")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-[var(--blue-deep)]">
            <a
              href={whatsAppUrl("Olá, gostaria de solicitar análise de contrato / Direito Bancário.")}
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
