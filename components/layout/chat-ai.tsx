"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { whatsAppUrl } from "@/lib/whatsapp";

type Message = { role: "user" | "assistant"; content: string };

export function ChatAI() {
  const t = useTranslations("chat");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: text }].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "CHAT_UNAVAILABLE");
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (err) {
      setError(t("unavailable"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-24 right-6 z-50 flex h-14 w-14 min-h-[48px] min-w-[48px] items-center justify-center rounded-full bg-[var(--blue-deep)] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[var(--blue-deep)]/50 touch-manipulation"
        aria-label={t("title")}
      >
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {open && (
        <div className="fixed bottom-28 right-4 left-4 z-50 w-[calc(100vw-2rem)] max-w-md rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-xl sm:bottom-24 sm:left-auto sm:right-6 sm:w-full">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
            <h3 className="font-semibold text-[var(--blue-deep)]">{t("title")}</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 hover:bg-[var(--muted)]"
              aria-label="Fechar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div
            ref={listRef}
            className="max-h-64 overflow-y-auto p-4 space-y-3"
          >
            {messages.length === 0 && (
              <p className="text-sm text-[var(--muted-foreground)]">{t("disclaimer")}</p>
            )}
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}-${m.content.slice(0, 8)}`}
                className={`rounded-lg px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "ml-8 bg-[var(--blue-deep)] text-[var(--off-white)]"
                    : "mr-8 bg-[var(--muted)] text-[var(--foreground)]"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="mr-8 rounded-lg bg-[var(--muted)] px-3 py-2 text-sm text-[var(--muted-foreground)]">
                ...
              </div>
            )}
            {error && (
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-2 text-sm">
                <p className="text-amber-800 dark:text-amber-200">{error}</p>
                <a
                  href={whatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-[var(--gold)] font-medium hover:underline"
                >
                  {t("contactWhatsApp")} →
                </a>
              </div>
            )}
          </div>
          <div className="border-t border-[var(--border)] p-3">
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("placeholder")}
                className="flex-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-md bg-[var(--gold)] px-4 py-2 text-sm font-medium text-[var(--blue-deep)] hover:bg-[var(--gold-light)] disabled:opacity-50"
              >
                {t("send")}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
