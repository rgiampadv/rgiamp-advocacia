"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", textAlign: "center" }}>
        <h1 style={{ color: "#1e3a5f" }}>Algo deu errado</h1>
        <p style={{ color: "#666", maxWidth: "400px", margin: "1rem auto" }}>
          Ocorreu um erro inesperado. Tente recarregar a página ou acessar o site novamente.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: "0.5rem 1.5rem",
            backgroundColor: "#c9a227",
            color: "#1e3a5f",
            border: "none",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
