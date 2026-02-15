/**
 * Redes sociais e credenciais profissionais.
 * Instagram: defina NEXT_PUBLIC_INSTAGRAM_URL no .env quando criar o perfil.
 */

export const OAB = "OAB/SP 542.173";

export const LINKEDIN_URL = "https://www.linkedin.com/in/raphaelgiampietro/";

export function getInstagramUrl(): string {
  return (
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_INSTAGRAM_URL) ||
    "https://www.instagram.com/"
  );
}
