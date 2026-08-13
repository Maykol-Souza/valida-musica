import { Router } from "express";
import { listHistory, getHistoryById } from "../services/historyStore.js";

export const historyRouter = Router();

historyRouter.get("/history", async (_req, res) => {
  try {
    const summaries = await listHistory();
    return res.json(summaries);
  } catch (error) {
    console.error("Erro ao listar histórico:", error);
    return res.status(500).json({ error: "Erro ao carregar o histórico." });
  }
});

historyRouter.get("/history/:id", async (req, res) => {
  try {
    const entry = await getHistoryById(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: "Análise não encontrada." });
    }
    return res.json(entry);
  } catch (error) {
    console.error("Erro ao buscar análise do histórico:", error);
    return res.status(500).json({ error: "Erro ao carregar a análise." });
  }
});
