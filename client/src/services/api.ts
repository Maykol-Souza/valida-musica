import type { AnalyzeResponse, HistoryEntry, HistorySummary } from "../types/review";

async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json();
    return typeof body?.error === "string" ? body.error : fallback;
  } catch {
    return fallback;
  }
}

export async function analyzeMusic(musicName: string, lyrics: string): Promise<AnalyzeResponse> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ musicName, lyrics }),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "Não foi possível concluir a análise. Tente novamente."));
  }

  return response.json();
}

export async function fetchHistory(): Promise<HistorySummary[]> {
  const response = await fetch("/api/history");
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "Não foi possível carregar o histórico."));
  }
  return response.json();
}

export async function fetchHistoryEntry(id: string): Promise<HistoryEntry> {
  const response = await fetch(`/api/history/${id}`);
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "Não foi possível carregar esta análise."));
  }
  return response.json();
}
