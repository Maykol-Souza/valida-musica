import { ErrorRequestHandler, Router } from "express";
import multer from "multer";
import { GeminiRequestError, transcribeAudioWithGemini } from "../services/geminiClient.js";

const MAX_AUDIO_SIZE_BYTES = 20 * 1024 * 1024;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_AUDIO_SIZE_BYTES },
});

export const transcribeRouter = Router();

transcribeRouter.post("/transcribe", upload.single("audio"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "Envie um arquivo de áudio." });
  }

  const isSupportedType = file.mimetype.startsWith("audio/") || file.mimetype === "video/mp4";
  if (!isSupportedType) {
    return res.status(400).json({ error: "O arquivo enviado precisa ser um áudio (ou vídeo mp4)." });
  }

  try {
    const lyrics = await transcribeAudioWithGemini(file.buffer, file.mimetype);
    return res.json({ lyrics });
  } catch (error) {
    if (error instanceof GeminiRequestError) {
      console.error("Erro ao transcrever áudio com Gemini:", error.cause ?? error);
      return res.status(502).json({ error: error.message });
    }
    console.error("Erro inesperado ao transcrever áudio:", error);
    return res.status(500).json({ error: "Erro interno ao transcrever o áudio." });
  }
});

const handleUploadError: ErrorRequestHandler = (error, _req, res, next) => {
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "Arquivo muito grande. O limite é 20MB." });
  }
  return next(error);
};

transcribeRouter.use(handleUploadError);
