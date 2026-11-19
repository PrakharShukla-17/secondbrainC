import "dotenv/config";
import mongoose from "mongoose";
import { Content } from "../models/Content";
import { ensureCollection } from "../services/vector";
import { indexContent } from "../services/indexer";

(async () => {
  await mongoose.connect(process.env.MONGO_URI!);
  await ensureCollection();
  const pending = await Content.find({ indexed: { $ne: true } });
  for (const doc of pending) {
    await indexContent(String(doc._id));
    console.log("indexed", doc.title);
  }
  process.exit(0);
})();