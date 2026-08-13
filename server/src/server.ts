import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { analyzeRouter } from "./routes/analyze.js";
import { historyRouter } from "./routes/history.js";
import { transcribeRouter } from "./routes/transcribe.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api", analyzeRouter);
app.use("/api", transcribeRouter);
app.use("/api", historyRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(env.port, () => {
  console.log(`Revisor Musical Infantil (server) rodando em http://localhost:${env.port}`);
});
