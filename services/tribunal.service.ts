/**
 * Serviço de consulta a tribunais brasileiros (API/Scraping).
 * Parser jurídico: transforma termos técnicos em resumo claro
 * (Situação, Último Andamento, Próximos Passos).
 */

export interface TribunalParseResult {
  court: string | null;
  summary: string | null;
  lastUpdate: string | null;
  nextSteps: string | null;
  rawData: Record<string, unknown> | null;
}

export async function parseLawsuitFromTribunal(
  processNumber: string
): Promise<TribunalParseResult> {
  try {
    if (process.env.TRIBUNAL_API_URL) {
      const res = await fetch(
        `${process.env.TRIBUNAL_API_URL}?numero=${encodeURIComponent(processNumber)}`
      );
      if (res.ok) {
        const data = (await res.json()) as TribunalParseResult & { raw?: unknown };
        return {
          court: data.court ?? null,
          summary: data.summary ?? null,
          lastUpdate: data.lastUpdate ?? null,
          nextSteps: data.nextSteps ?? null,
          rawData: (data.raw ?? data.rawData ?? null) as Record<string, unknown> | null,
        };
      }
    }
    return mockParse(processNumber);
  } catch (err) {
    console.error("[TribunalService]", err);
    return mockParse(processNumber);
  }
}

function mockParse(processNumber: string): TribunalParseResult {
  return {
    court: "Tribunal de Justiça (exemplo)",
    summary: "Resumo gerado pelo parser jurídico. Em produção, integrar com API do CNJ ou tribunal.",
    lastUpdate: "Último andamento disponível após consulta ao tribunal.",
    nextSteps: "Aguardar intimação ou prazo processual.",
    rawData: { processNumber, mock: true },
  };
}
