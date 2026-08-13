import { defaultReviewProfile } from "../config/reviewProfiles/default.js";
import { buildReviewPrompt } from "../prompts/buildReviewPrompt.js";
import type { Classification, ReviewProblem, ReviewResult } from "../types/review.js";
import { appendHistory } from "./historyStore.js";
import { generateStructuredReview, GeminiRequestError } from "./geminiClient.js";

const DISCLAIMER =
  "Esta classificação é gerada por inteligência artificial e serve como ferramenta de apoio à revisão " +
  "humana. Não é uma garantia absoluta de que o conteúdo é apropriado para crianças — revise sempre antes do uso.";

const VALID_CLASSIFICATIONS: Classification[] = ["APROVADA", "ATENCAO", "REPROVADA"];
const VALID_SEVERITIES = ["Baixa", "Média", "Alta"];

export class ReviewValidationError extends Error {}

interface RawProblem {
  category?: unknown;
  term?: unknown;
  excerpt?: unknown;
  reason?: unknown;
  severity?: unknown;
  suggestion?: unknown;
  suggestionRationale?: unknown;
}

interface RawReview {
  classification?: unknown;
  score?: unknown;
  summary?: unknown;
  problems?: unknown;
  categoriesIdentified?: unknown;
  finalRecommendation?: unknown;
  revisedLyrics?: unknown;
}

function normalizeProblem(raw: RawProblem, index: number): ReviewProblem {
  if (typeof raw.category !== "string" || typeof raw.excerpt !== "string" || typeof raw.reason !== "string") {
    throw new ReviewValidationError(`Problema #${index} retornado pela IA está incompleto.`);
  }
  const severity = VALID_SEVERITIES.includes(raw.severity as string) ? (raw.severity as ReviewProblem["severity"]) : "Média";
  return {
    category: raw.category,
    term: typeof raw.term === "string" ? raw.term : "",
    excerpt: raw.excerpt,
    reason: raw.reason,
    severity,
    suggestion: typeof raw.suggestion === "string" ? raw.suggestion : null,
    suggestionRationale: typeof raw.suggestionRationale === "string" ? raw.suggestionRationale : null,
  };
}

function parseAndValidate(rawText: string, musicName: string): ReviewResult {
  let parsed: RawReview;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new ReviewValidationError("A resposta da IA não é um JSON válido.");
  }

  if (!VALID_CLASSIFICATIONS.includes(parsed.classification as Classification)) {
    throw new ReviewValidationError("Classificação retornada pela IA é inválida.");
  }
  if (typeof parsed.score !== "number" || Number.isNaN(parsed.score)) {
    throw new ReviewValidationError("Pontuação retornada pela IA é inválida.");
  }
  if (typeof parsed.summary !== "string") {
    throw new ReviewValidationError("Resumo retornado pela IA é inválido.");
  }
  if (!Array.isArray(parsed.problems)) {
    throw new ReviewValidationError("Lista de problemas retornada pela IA é inválida.");
  }

  const score = Math.max(0, Math.min(100, Math.round(parsed.score)));
  const problems = (parsed.problems as RawProblem[]).map(normalizeProblem);
  const categoriesIdentified = Array.isArray(parsed.categoriesIdentified)
    ? (parsed.categoriesIdentified as unknown[]).filter((c): c is string => typeof c === "string")
    : [];

  return {
    musicName,
    classification: parsed.classification as Classification,
    score,
    summary: parsed.summary,
    problems,
    categoriesIdentified,
    finalRecommendation:
      typeof parsed.finalRecommendation === "string"
        ? parsed.finalRecommendation
        : "Revise manualmente antes de utilizar esta música com público infantil.",
    revisedLyrics: typeof parsed.revisedLyrics === "string" ? parsed.revisedLyrics : null,
    disclaimer: DISCLAIMER,
  };
}

function buildFallbackResult(musicName: string, note: string): ReviewResult {
  return {
    musicName,
    classification: "ATENCAO",
    score: 50,
    summary: `Não foi possível concluir a análise automática integralmente (${note}). Recomenda-se revisão humana completa.`,
    problems: [],
    categoriesIdentified: [],
    finalRecommendation: "Revise manualmente esta música antes de utilizá-la, pois a análise automática não pôde ser confirmada.",
    revisedLyrics: null,
    disclaimer: DISCLAIMER,
  };
}

export interface ReviewMusicInput {
  musicName?: string;
  lyrics: string;
}

export interface ReviewMusicOutput {
  id: string;
  timestamp: string;
  result: ReviewResult;
}

export async function reviewMusic({ musicName, lyrics }: ReviewMusicInput): Promise<ReviewMusicOutput> {
  const trimmedLyrics = lyrics.trim();
  if (!trimmedLyrics) {
    throw new ReviewValidationError("A letra da música não pode estar vazia.");
  }
  const resolvedName = musicName?.trim() || "(sem título)";

  const prompt = buildReviewPrompt(defaultReviewProfile, resolvedName, trimmedLyrics);

  let result: ReviewResult;
  try {
    const rawText = await generateStructuredReview(prompt);
    result = parseAndValidate(rawText, resolvedName);
  } catch (error) {
    if (error instanceof GeminiRequestError) throw error;
    const note = error instanceof Error ? error.message : "erro desconhecido";
    result = buildFallbackResult(resolvedName, note);
  }

  const entry = await appendHistory(resolvedName, trimmedLyrics, result);
  return { id: entry.id, timestamp: entry.timestamp, result };
}
