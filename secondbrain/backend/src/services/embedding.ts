import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function embed(
  text: string,
  taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" = "RETRIEVAL_DOCUMENT"
): Promise<number[]> {
  const res = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text.slice(0, 8000),
    config: { taskType, outputDimensionality: 1536 },
  });
  return res.embeddings![0].values!;
}