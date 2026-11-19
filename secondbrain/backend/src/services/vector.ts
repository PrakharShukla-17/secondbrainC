import { QdrantClient } from "@qdrant/js-client-rest";

const COLLECTION = "contents";

export const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY,
});

let ready: Promise<void> | null = null;

export function ensureCollection(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      const { collections } = await qdrant.getCollections();
      if (!collections.some((c) => c.name === COLLECTION)) {
        await qdrant.createCollection(COLLECTION, {
          vectors: { size: 1536, distance: "Cosine" },
        });
        await qdrant.createPayloadIndex(COLLECTION, {
          field_name: "userId",
          field_schema: "keyword",
        });
        console.log("Qdrant collection created:", COLLECTION);
      }
    })().catch((err) => {
      ready = null; // allow retry on next call
      throw err;
    });
  }
  return ready;
}

export async function upsertVector(
  vectorId: string, // must be a UUID
  vector: number[],
  payload: { mongoId: string; userId: string }
) {
  await ensureCollection();
  await qdrant.upsert(COLLECTION, {
    wait: true,
    points: [{ id: vectorId, vector, payload }],
  });
}

export async function deleteVector(vectorId: string) {
  await ensureCollection();
  await qdrant.delete(COLLECTION, { wait: true, points: [vectorId] });
}

export async function searchVectors(vector: number[], userId: string, limit = 5) {
  await ensureCollection();
  const res = await qdrant.query(COLLECTION, {
    query: vector,
    limit,
    score_threshold: 0.25,
    with_payload: true,
    filter: { must: [{ key: "userId", match: { value: userId } }] },
  });
  return res.points;
}