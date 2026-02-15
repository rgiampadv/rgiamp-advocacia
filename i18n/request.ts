import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export const locales = ["pt", "en", "es", "it", "fr", "de"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }
  const messages = (await import(`../messages/${locale}.json`)).default;
  return { locale, messages, timeZone: "America/Sao_Paulo" };
});
