import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ChatAI } from "@/components/layout/chat-ai";
import { Providers } from "@/components/providers";
import { LegalServiceSchema } from "@/components/seo/legal-service-schema";

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "pt" | "en" | "es" | "it" | "fr" | "de")) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <LegalServiceSchema locale={locale} />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
          <WhatsAppButton />
          <ChatAI />
        </div>
      </Providers>
    </NextIntlClientProvider>
  );
}
