import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { Content, ContentType } from "../models/Content";
import mongoose from "mongoose";

const router = Router();

function detectType(url: string): ContentType {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
  if (url.includes("reddit.com")) return "reddit";
  if (url.includes("instagram.com")) return "instagram";
  return "article";
}

// Get all content for user
router.get("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter: { userId: mongoose.Types.ObjectId; type?: string } = {
      userId: new mongoose.Types.ObjectId(req.userId),
    };
    if (req.query.type) filter.type = req.query.type as string;
    const content = await Content.find(filter).sort({ createdAt: -1 });
    res.json(content);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Add content
router.post("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { url, title, tags } = req.body;
    if (!url || !title) {
      res.status(400).json({ message: "URL and title are required" });
      return;
    }
    const type = detectType(url);
    const content = await Content.create({
      userId: new mongoose.Types.ObjectId(req.userId),
      url,
      title,
      type,
      tags: tags || [],
    });
    res.status(201).json(content);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete content
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const content = await Content.findOneAndDelete({
      _id: req.params.id,
      userId: new mongoose.Types.ObjectId(req.userId),
    });
    if (!content) {
      res.status(404).json({ message: "Content not found" });
      return;
    }
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
