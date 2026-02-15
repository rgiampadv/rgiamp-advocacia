"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

const COOKIE_CONSENT_KEY = "rjgfpequeno-cookie-consent";

export function CookieBanner() {
  const t = useTranslations("cookies");
  const [mounted, setMounted] = useState(false);
  const [accepted, setAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    setAccepted(stored !== null);
    setMounted(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setAccepted(true);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setAccepted(true);
  };

  if (!mounted || accepted !== false) return null;

  return (
    <div
      role="dialog"
      aria-label="Banner de cookies"
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-[var(--border)] bg-[var(--card)] p-4 shadow-lg sm:left-4 sm:right-auto sm:bottom-4 sm:max-w-md sm:rounded-lg"
    >
      <p className="text-sm text-[var(--foreground)] mb-3">{t("message")}</p>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="accent" onClick={handleAccept}>
          {t("accept")}
        </Button>
        <Button size="sm" variant="outline" onClick={handleDecline}>
          {t("decline")}
        </Button>
        <Link href="/politica-privacidade" className="text-sm text-[var(--muted-foreground)] underline self-center ml-2">
          Política de Privacidade
        </Link>
      </div>
    </div>
  );
}
