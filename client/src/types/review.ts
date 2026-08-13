export type Classification = "APROVADA" | "ATENCAO" | "REPROVADA";

export type Severity = "Baixa" | "Média" | "Alta";

export interface ReviewProblem {
  category: string;
  term: string;
  excerpt: string;
  reason: string;
  severity: Severity;
  suggestion: string | null;
  suggestionRationale: string | null;
}

export interface ReviewResult {
  musicName: string;
  classification: Classification;
  score: number;
  summary: string;
  problems: ReviewProblem[];
  categoriesIdentified: string[];
  finalRecommendation: string;
  revisedLyrics: string | null;
  disclaimer: string;
}

export interface AnalyzeResponse {
  id: string;
  timestamp: string;
  result: ReviewResult;
}

export interface HistorySummary {
  id: string;
  musicName: string;
  timestamp: string;
  classification: Classification;
  score: number;
}

export interface HistoryEntry {
  id: string;
  musicName: string;
  lyrics: string;
  timestamp: string;
  result: ReviewResult;
}
