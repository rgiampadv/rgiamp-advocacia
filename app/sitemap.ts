import { routing } from "@/i18n/routing";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rgiamp.adv.com";

const staticPaths = [
  "",
  "/sobre",
  "/agendar",
  "/contato",
  "/politica-privacidade",
  "/cookies",
  "/login",
  "/area-do-cliente",
  "/parcerias",
  "/areas/jec",
  "/areas/consumidor",
  "/areas/criminal",
];

export default function sitemap() {
  const locales = routing.locales;
  type Entry = { url: string; lastModified: string; changeFrequency: "weekly" | "monthly"; priority: number };
  const entries: Entry[] = [];
  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: new Date().toISOString(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
      });
    }
  }
  return entries;
}
