import { setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function PoliticaPrivacidadePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-[var(--blue-deep)]">Política de Privacidade</h1>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
        Última atualização: {new Date().toLocaleDateString("pt-BR")}. Conformidade com a LGPD.
      </p>
      <div className="prose prose-slate mt-8 max-w-none text-[var(--foreground)]">
        <h2 className="text-xl font-semibold text-[var(--blue-deep)]">1. Responsável</h2>
        <p>
          Raphael José Giampietro Fiuza Pequeno Sociedade Unipessoal de Advocacia, responsável pelo tratamento dos seus dados pessoais neste site.
        </p>
        <h2 className="text-xl font-semibold text-[var(--blue-deep)] mt-6">2. Dados coletados</h2>
        <p>
          Podemos coletar nome, e-mail, telefone e mensagem quando você preenche formulários de contato ou agendamento, e dados de navegação (cookies) conforme seu consentimento.
        </p>
        <h2 className="text-xl font-semibold text-[var(--blue-deep)] mt-6">3. Finalidade</h2>
        <p>
          Os dados são utilizados para responder ao seu contato, realizar agendamentos, enviar confirmações e melhorar a experiência do site, sempre com base legal (execução de contrato, consentimento ou legítimo interesse).
        </p>
        <h2 className="text-xl font-semibold text-[var(--blue-deep)] mt-6">4. Compartilhamento</h2>
        <p>
          Não vendemos seus dados. Podemos compartilhar com prestadores de serviço (hospedagem, e-mail, pagamento) na medida necessária para a prestação do serviço.
        </p>
        <h2 className="text-xl font-semibold text-[var(--blue-deep)] mt-6">5. Seus direitos (LGPD)</h2>
        <p>
          Você pode solicitar acesso, correção, exclusão, portabilidade ou revogação do consentimento, mediante contato pelo site ou e-mail do escritório.
        </p>
      </div>
    </div>
  );
}
