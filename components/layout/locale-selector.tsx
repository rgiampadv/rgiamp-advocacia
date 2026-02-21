"use client";

import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

const locales: { code: "pt" | "en" | "es" | "it" | "fr" | "de"; country: string; label: string }[] = [
  { code: "pt", country: "br", label: "Português" },
  { code: "en", country: "us", label: "English" },
  { code: "es", country: "es", label: "Español" },
  { code: "it", country: "it", label: "Italiano" },
  { code: "fr", country: "fr", label: "Français" },
  { code: "de", country: "de", label: "Deutsch" },
];

export function LocaleSelector({ className }: { className?: string }) {
  const pathname = usePathname();
  const currentLocale = useLocale();

  return (
    <div className={cn("flex items-center gap-1", className)} role="group" aria-label="Idioma">
      {locales.map(({ code, country, label }) => (
        <Link
          key={code}
          href={pathname}
          locale={code}
          className={cn(
            "flex items-center justify-center rounded p-1 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]",
            currentLocale === code ? "opacity-100 ring-1 ring-[var(--gold)]/50" : "opacity-70 hover:opacity-90"
          )}
          title={label}
          aria-current={currentLocale === code ? "true" : undefined}
        >
          <Image
            src={`https://flagcdn.com/w40/${country}.png`}
            alt={label}
            width={24}
            height={18}
            className="rounded-sm object-cover"
          />
        </Link>
      ))}
    </div>
  );
}
