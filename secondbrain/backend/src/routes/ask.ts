import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { Content } from "../models/Content";
import { embed, ai } from "../services/embedding";
import { searchVectors } from "../services/vector";

const router = Router();

const MIN_SCORE = 0.55;  // absolute cutoff, tune using the logged scores
const KEEP_RATIO = 0.85; // keep hits within 85% of the best score

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { query, mode } = req.body as { query?: string; mode?: "answer" | "search" };
    if (!query?.trim()) {
      return res.status(400).json({ message: "query required" });
    }

    const hits = await searchVectors(
      await embed(query, "RETRIEVAL_QUERY"),
      String((req as any).userId),
      5
    );

    // temporary: remove once you've picked your thresholds
    console.log(hits.map((h) => `${h.score.toFixed(3)} ${h.payload?.mongoId}`));

    const best = hits[0]?.score ?? 0;
    const kept = hits.filter((h) => h.score >= MIN_SCORE && h.score >= best * KEEP_RATIO);
    const ids = kept.map((h) => h.payload!.mongoId as string);

    const docs = await Content.find({ _id: { $in: ids } }).lean();

    // restore similarity order
    const ordered = ids
      .map((id) => docs.find((d) => String(d._id) === id))
      .filter((d): d is NonNullable<typeof d> => !!d);

    const sources = ordered.map((d) => ({
      title: d.title,
      url: d.url,
      type: d.type,
    }));

    if (mode === "search" || ordered.length === 0) {
      return res.json({ answer: null, sources });
    }

    const context = ordered
      .map(
        (d, i) =>
          `[${i + 1}] ${d.title} (${d.url})\n${(d.extractedText ?? "").slice(0, 2000)}`
      )
      .join("\n\n");

    const completion = await ai.models.generateContent({
      model: process.env.GEMINI_CHAT_MODEL ?? "gemini-3.8-flash",
      contents: `Sources:\n${context}\n\nQuestion: ${query}`,
      config: {
        systemInstruction:
          "You answer questions using ONLY the user's saved sources below. Cite sources as [n]. If the sources don't contain the answer, say so.",
      },
    });

    return res.json({ answer: completion.text, sources });
  } catch (err) {
    console.error("ask failed:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;