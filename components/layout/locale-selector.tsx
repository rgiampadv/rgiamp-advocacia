"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

const locales: { code: "pt" | "en" | "es" | "it" | "fr" | "de"; flag: string; label: string }[] = [
  { code: "pt", flag: "🇧🇷", label: "Português" },
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "es", flag: "🇪🇸", label: "Español" },
  { code: "it", flag: "🇮🇹", label: "Italiano" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
];

export function LocaleSelector({ className }: { className?: string }) {
  const pathname = usePathname();
  const currentLocale = useLocale();

  return (
    <div className={cn("flex items-center gap-0.5", className)} role="group" aria-label="Idioma">
      {locales.map(({ code, flag, label }) => (
        <Link
          key={code}
          href={pathname}
          locale={code}
          className={cn(
            "flex items-center justify-center w-8 h-8 text-lg rounded transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]",
            currentLocale === code ? "opacity-100 ring-1 ring-[var(--gold)]/50" : "opacity-70 hover:opacity-90"
          )}
          title={label}
          aria-current={currentLocale === code ? "true" : undefined}
        >
          {flag}
        </Link>
      ))}
    </div>
  );
}
