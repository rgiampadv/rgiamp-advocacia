import { Link } from "@/i18n/routing";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-baseline gap-1.5 font-semibold tracking-tight text-[var(--blue-deep)] no-underline hover:text-[var(--blue-deep)]"
      aria-label="RGF Advocacia - Início"
    >
      <span className="text-xl font-bold text-[var(--gold)]">RGF</span>
      <span className="text-lg font-medium">Advocacia</span>
    </Link>
  );
}
