import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "./contact-form";

type Props = { params: Promise<{ locale: string }> };

export default async function ContatoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-[var(--blue-deep)]">Contato</h1>
      <p className="mt-2 text-[var(--muted-foreground)]">
        Envie sua mensagem. Responderemos com brevidade. Conteúdo meramente informativo.
      </p>
      <div className="mt-10 max-w-xl">
        <ContactForm />
      </div>
    </div>
  );
}
