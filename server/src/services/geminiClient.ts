import { GoogleGenAI, Type } from "@google/genai";
import { env } from "../config/env.js";

const problemSchema = {
  type: Type.OBJECT,
  properties: {
    category: { type: Type.STRING },
    term: { type: Type.STRING },
    excerpt: { type: Type.STRING },
    reason: { type: Type.STRING },
    severity: { type: Type.STRING, enum: ["Baixa", "Média", "Alta"] },
    suggestion: { type: Type.STRING, nullable: true },
    suggestionRationale: { type: Type.STRING, nullable: true },
  },
  required: ["category", "term", "excerpt", "reason", "severity", "suggestion", "suggestionRationale"],
};

export const reviewResponseSchema = {
  type: Type.OBJECT,
  properties: {
    classification: { type: Type.STRING, enum: ["APROVADA", "ATENCAO", "REPROVADA"] },
    score: { type: Type.INTEGER },
    summary: { type: Type.STRING },
    problems: { type: Type.ARRAY, items: problemSchema },
    categoriesIdentified: { type: Type.ARRAY, items: { type: Type.STRING } },
    finalRecommendation: { type: Type.STRING },
    revisedLyrics: { type: Type.STRING, nullable: true },
  },
  required: [
    "classification",
    "score",
    "summary",
    "problems",
    "categoriesIdentified",
    "finalRecommendation",
    "revisedLyrics",
  ],
};

const client = new GoogleGenAI({ apiKey: env.geminiApiKey });

export class GeminiRequestError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "GeminiRequestError";
  }
}

export async function generateStructuredReview(prompt: string): Promise<string> {
  try {
    const response = await client.models.generateContent({
      model: env.geminiModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: reviewResponseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new GeminiRequestError("O Gemini retornou uma resposta vazia.");
    }
    return text;
  } catch (error) {
    if (error instanceof GeminiRequestError) throw error;
    throw new GeminiRequestError("Falha ao comunicar com a API do Gemini.", error);
  }
}
