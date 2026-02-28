import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocaleSelector } from "@/components/layout/locale-selector";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--blue-deep)] text-[var(--off-white)]">
        <div className="container mx-auto px-4 py-20 sm:px-6 sm:py-28 md:py-32">
          <div className="mb-6">
            <LocaleSelector />
          </div>
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="mt-4 text-lg text-[var(--gray-light)]/90 sm:text-xl">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="accent" className="min-w-[200px] sm:min-w-0">
                <Link href="/contato">{t("hero.cta")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)]/10 min-w-[200px] sm:min-w-0">
                <Link href="/parcerias">{t("nav.partnership")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-[var(--off-white)]/50 text-[var(--off-white)] hover:bg-white/10 min-w-[200px] sm:min-w-0">
                <Link href="/agendar">{t("hero.schedule")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-[var(--off-white)]/50 text-[var(--off-white)] hover:bg-white/10 min-w-[200px] sm:min-w-0">
                <Link href="/blog">{t("nav.blog")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold text-[var(--blue-deep)] sm:text-3xl">
          {t("areas.title")}
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AreaCard
            title={t("areas.jec.title")}
            description={t("areas.jec.description")}
            href="/areas/jec"
            learnMore={t("areas.learnMore")}
          />
          <AreaCard
            title={t("areas.consumer.title")}
            description={t("areas.consumer.description")}
            href="/areas/consumidor"
            learnMore={t("areas.learnMore")}
          />
          <AreaCard
            title={t("areas.criminal.title")}
            description={t("areas.criminal.description")}
            href="/areas/criminal"
            learnMore={t("areas.learnMore")}
          />
          <AreaCard
            title={t("areas.bancario.title")}
            description={t("areas.bancario.description")}
            href="/areas/bancario"
            learnMore={t("areas.learnMore")}
          />
          <AreaCard
            title={t("areas.tributario.title")}
            description={t("areas.tributario.description")}
            href="/areas/tributario"
            learnMore={t("areas.learnMore")}
          />
        </div>
      </section>

      <section className="bg-[var(--gray-light)] py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-semibold text-[var(--blue-deep)] sm:text-3xl">
            {t("process.title")}
          </h2>
          <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">
            {t("process.description")}{" "}
            <span className="no-widow">{t("process.descriptionEnd")}</span>
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold text-[var(--blue-deep)] sm:text-3xl">
          {t("differentials.title")}
        </h2>
        <div className="mt-6 max-w-3xl space-y-4 text-[var(--muted-foreground)]">
          <p>{t("differentials.intro1")}</p>
          <p>{t("differentials.intro2")}</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[var(--gold)]">{t("differentials.riskAnalysis")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--muted-foreground)]">{t("differentials.riskAnalysisDesc")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[var(--gold)]">{t("differentials.strategicVision")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--muted-foreground)]">{t("differentials.strategicVisionDesc")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[var(--gold)]">{t("differentials.techIntegration")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--muted-foreground)]">{t("differentials.techIntegrationDesc")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[var(--gold)]">{t("differentials.multidisciplinary")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--muted-foreground)]">{t("differentials.multidisciplinaryDesc")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[var(--gold)]">{t("differentials.selective")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--muted-foreground)]">{t("differentials.selectiveDesc")}</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

function AreaCard({
  title,
  description,
  href,
  learnMore,
}: {
  title: string;
  description: string;
  href: string;
  learnMore: string;
}) {
  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-[var(--blue-deep)]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-[var(--muted-foreground)]">{description}</p>
      </CardContent>
      <CardContent className="pt-0">
        <Button asChild variant="link" size="sm" className="p-0 h-auto text-[var(--gold)] hover:text-[var(--gold-light)]">
          <Link href={href}>{learnMore}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
