import { Router } from "express";
import { reviewMusic, ReviewValidationError } from "../services/musicReviewService.js";
import { GeminiRequestError } from "../services/geminiClient.js";
import type { AnalyzeRequestBody } from "../types/review.js";

export const analyzeRouter = Router();

analyzeRouter.post("/analyze", async (req, res) => {
  const body = req.body as AnalyzeRequestBody;

  if (!body || typeof body.lyrics !== "string" || body.lyrics.trim().length === 0) {
    return res.status(400).json({ error: "Informe a letra da música." });
  }

  try {
    const output = await reviewMusic({ musicName: body.musicName, lyrics: body.lyrics });
    return res.json(output);
  } catch (error) {
    if (error instanceof ReviewValidationError) {
      return res.status(400).json({ error: error.message });
    }
    if (error instanceof GeminiRequestError) {
      console.error("Erro ao chamar o Gemini:", error.cause ?? error);
      return res.status(502).json({ error: "Não foi possível concluir a análise com a IA. Tente novamente em instantes." });
    }
    console.error("Erro inesperado ao analisar música:", error);
    return res.status(500).json({ error: "Erro interno ao processar a análise." });
  }
});
