import { randomUUID } from "crypto";
import { Content } from "../models/Content";
import { embed } from "./embedding";
import { extractText } from "./extract";
import { upsertVector } from "./vector";

export async function indexContent(contentId: string) {
  const doc = await Content.findById(contentId);
  if (!doc) return;

  try {
    const pageText = await extractText(doc.url);
    doc.extractedText = pageText.slice(0, 20000);

    const textToEmbed = [
      doc.title,
      `Type: ${doc.type}`,
      `Tags: ${(doc.tags as unknown as string[]).join(", ")}`,
      pageText.slice(0, 3000),
    ].join("\n");

    const vector = await embed(textToEmbed);

    if (!doc.vectorId) doc.vectorId = randomUUID();
    doc.embedding = vector; // optional copy; remove if you don't want it in Mongo
    await upsertVector(doc.vectorId, vector, {
      mongoId: String(doc._id),
      userId: String(doc.userId),
    });

    doc.indexed = true;
    await doc.save();
  } catch (err) {
    console.error("indexContent failed for", contentId, err);
  }
}