const LEGAL_SERVICE_JSON_LD = (locale: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rgiamp.adv.br";
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: "Raphael José Giampietro Fiuza Pequeno - Advocacia",
    description: "Advocacia de excelência em São Paulo. Áreas: JEC, Consumidor e Criminal. Conteúdo meramente informativo.",
    url: `${baseUrl}/${locale}`,
    areaServed: { "@type": "City", name: "São Paulo" },
    priceRange: "R$",
  };
};

export function LegalServiceSchema({ locale }: { locale: string }) {
  const json = LEGAL_SERVICE_JSON_LD(locale);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
