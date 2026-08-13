import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(
      `Variável de ambiente "${name}" não definida. Crie um arquivo server/.env baseado em server/.env.example.`
    );
  }
  return value;
}

export const env = {
  geminiApiKey: required("GEMINI_API_KEY"),
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  port: Number(process.env.PORT) || 4000,
};
