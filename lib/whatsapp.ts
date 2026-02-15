/**
 * WhatsApp: número do escritório (contato público) e helpers.
 * Use NEXT_PUBLIC_WHATSAPP_NUMBER no .env (ex: 5511974367189).
 */
const DEFAULT_NUMBER = "5511974367189";

export function getWhatsAppNumber(): string {
  return (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_WHATSAPP_NUMBER) ||
    DEFAULT_NUMBER;
}

/** Link para abrir conversa no WhatsApp (wa.me) com mensagem opcional. */
export function whatsAppUrl(message?: string): string {
  const num = getWhatsAppNumber().replace(/\D/g, "");
  const base = `https://wa.me/${num}`;
  if (message?.trim()) {
    return `${base}?text=${encodeURIComponent(message.trim())}`;
  }
  return base;
}
