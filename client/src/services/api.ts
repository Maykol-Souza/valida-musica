import type { AnalyzeResponse, HistoryEntry, HistorySummary } from "../types/review";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json();
    return typeof body?.error === "string" ? body.error : fallback;
  } catch {
    return fallback;
  }
}

export async function analyzeMusic(musicName: string, lyrics: string): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE}/analyze`, {
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
  const response = await fetch(`${API_BASE}/history`);
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "Não foi possível carregar o histórico."));
  }
  return response.json();
}

export async function fetchHistoryEntry(id: string): Promise<HistoryEntry> {
  const response = await fetch(`${API_BASE}/history/${id}`);
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "Não foi possível carregar esta análise."));
  }
  return response.json();
}

export async function transcribeAudio(file: File): Promise<{ lyrics: string }> {
  const formData = new FormData();
  formData.append("audio", file);

  const response = await fetch(`${API_BASE}/transcribe`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "Não foi possível transcrever o áudio. Tente novamente."));
  }

  return response.json();
}
