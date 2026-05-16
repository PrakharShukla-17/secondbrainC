import { Router, Request, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { User } from "../models/User";
import { Content } from "../models/Content";
import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 12);
const router = Router();

// Toggle share brain
router.post("/toggle", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ message: "User not found" }); return; }

    if (user.shareToken) {
      user.shareToken = undefined;
      await user.save();
      res.json({ shared: false, shareToken: null });
    } else {
      user.shareToken = nanoid();
      await user.save();
      res.json({ shared: true, shareToken: user.shareToken });
    }
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Get share status
router.get("/status", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ message: "User not found" }); return; }
    res.json({ shared: !!user.shareToken, shareToken: user.shareToken || null });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// View shared brain by token
router.get("/:shareToken", async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ shareToken: req.params.shareToken });
    if (!user) { res.status(404).json({ message: "Shared brain not found" }); return; }
    const content = await Content.find({ userId: user._id }).sort({ createdAt: -1 });
    res.json({ username: user.username, content });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
