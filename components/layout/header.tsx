"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { LocaleSelector } from "@/components/layout/locale-selector";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { key: "home", href: "/" },
  { key: "areas", href: "/areas", children: [
    { key: "jec", href: "/areas/jec" },
    { key: "consumer", href: "/areas/consumidor" },
    { key: "criminal", href: "/areas/criminal" },
    { key: "bancario", href: "/areas/bancario" },
    { key: "tributario", href: "/areas/tributario" },
  ]},
  { key: "about", href: "/sobre" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [areasOpen, setAreasOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--card)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--card)]/80">
      <div className="container mx-auto flex h-16 items-center justify-between pl-2 pr-4 sm:pl-3 sm:pr-6">
        <div className="-ml-5 flex flex-1 items-center gap-0 min-w-0 sm:-ml-6">
          <div className="mr-10 sm:mr-12 shrink-0">
            <Logo />
          </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 shrink-0">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-[var(--gold)]",
              pathname === "/" ? "text-[var(--gold)]" : "text-[var(--foreground)]"
            )}
          >
            {t("home")}
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setAreasOpen(true)}
            onMouseLeave={() => setAreasOpen(false)}
          >
            <button
              type="button"
              className={cn(
                "flex items-center gap-1 text-sm font-medium transition-colors hover:text-[var(--gold)]",
                pathname?.startsWith("/areas") ? "text-[var(--gold)]" : "text-[var(--foreground)]"
              )}
              aria-expanded={areasOpen}
              aria-haspopup="true"
            >
              {t("areas")}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {areasOpen && (
              <div className="absolute left-0 top-full pt-1 w-48 rounded-md border border-[var(--border)] bg-[var(--card)] py-1 shadow-lg">
                <Link
                  href="/areas/jec"
                  className="block px-4 py-2 text-sm hover:bg-[var(--muted)]"
                  onClick={() => setAreasOpen(false)}
                >
                  {t("jec")}
                </Link>
                <Link
                  href="/areas/consumidor"
                  className="block px-4 py-2 text-sm hover:bg-[var(--muted)]"
                  onClick={() => setAreasOpen(false)}
                >
                  {t("consumer")}
                </Link>
                <Link
                  href="/areas/criminal"
                  className="block px-4 py-2 text-sm hover:bg-[var(--muted)]"
                  onClick={() => setAreasOpen(false)}
                >
                  {t("criminal")}
                </Link>
                <Link
                  href="/areas/bancario"
                  className="block px-4 py-2 text-sm hover:bg-[var(--muted)]"
                  onClick={() => setAreasOpen(false)}
                >
                  {t("bancario")}
                </Link>
                <Link
                  href="/areas/tributario"
                  className="block px-4 py-2 text-sm hover:bg-[var(--muted)]"
                  onClick={() => setAreasOpen(false)}
                >
                  {t("tributario")}
                </Link>
              </div>
            )}
          </div>
        </nav>
        </div>

        <div className="hidden md:flex items-center gap-4 shrink-0">
          <LocaleSelector className="shrink-0" />
          <Link
            href="/sobre"
            className={cn(
              "text-sm font-medium transition-colors hover:text-[var(--gold)]",
              pathname === "/sobre" ? "text-[var(--gold)]" : "text-[var(--foreground)]"
            )}
          >
            {t("about")}
          </Link>
          <Button asChild size="sm" variant="accent">
            <Link href="/agendar">{t("schedule")}</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/login">{t("clientArea")}</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <LocaleSelector />
          <button
            type="button"
            className="inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-[var(--border)] bg-transparent hover:bg-[var(--muted)] active:bg-[var(--muted)]"
            aria-label="Abrir menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--card)] md:hidden">
          <nav className="container mx-auto flex flex-col gap-0 px-4 py-4">
            <div className="mb-3">
              <LocaleSelector />
            </div>
            <Link href="/" className="min-h-[44px] flex items-center rounded-md px-4 py-3 text-sm font-medium hover:bg-[var(--muted)] active:bg-[var(--muted)]" onClick={() => setMobileOpen(false)}>
              {t("home")}
            </Link>
            <span className="px-4 py-2 text-xs font-medium text-[var(--muted-foreground)]">{t("areas")}</span>
            <Link href="/areas/jec" className="min-h-[44px] flex items-center rounded-md px-4 py-3 text-sm hover:bg-[var(--muted)] active:bg-[var(--muted)]" onClick={() => setMobileOpen(false)}>
              {t("jec")}
            </Link>
            <Link href="/areas/consumidor" className="min-h-[44px] flex items-center rounded-md px-4 py-3 text-sm hover:bg-[var(--muted)] active:bg-[var(--muted)]" onClick={() => setMobileOpen(false)}>
              {t("consumer")}
            </Link>
            <Link href="/areas/criminal" className="min-h-[44px] flex items-center rounded-md px-4 py-3 text-sm hover:bg-[var(--muted)] active:bg-[var(--muted)]" onClick={() => setMobileOpen(false)}>
              {t("criminal")}
            </Link>
            <Link href="/areas/bancario" className="min-h-[44px] flex items-center rounded-md px-4 py-3 text-sm hover:bg-[var(--muted)] active:bg-[var(--muted)]" onClick={() => setMobileOpen(false)}>
              {t("bancario")}
            </Link>
            <Link href="/areas/tributario" className="min-h-[44px] flex items-center rounded-md px-4 py-3 text-sm hover:bg-[var(--muted)] active:bg-[var(--muted)]" onClick={() => setMobileOpen(false)}>
              {t("tributario")}
            </Link>
            <Link href="/sobre" className="min-h-[44px] flex items-center rounded-md px-4 py-3 text-sm font-medium hover:bg-[var(--muted)] active:bg-[var(--muted)]" onClick={() => setMobileOpen(false)}>
              {t("about")}
            </Link>
            <div className="mt-2 flex flex-col gap-2 border-t border-[var(--border)] pt-4">
              <Button asChild variant="accent" className="h-12 w-full min-h-[44px]">
                <Link href="/agendar" onClick={() => setMobileOpen(false)}>{t("schedule")}</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 w-full min-h-[44px]">
                <Link href="/login" onClick={() => setMobileOpen(false)}>{t("clientArea")}</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

