import { Request, Response } from "express";
import { prisma } from "../services/prisma";
import jwt from "jsonwebtoken";
import { completeReview, getTodayDueCollections, resetReviewProgress } from "../services/spacedRepetition";

function getUserIdFromRequest(req: Request): number | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET || "secret-key");
    return payload.userId;
  } catch {
    return null;
  }
}

export const getTodayReview = async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    // Get all collections for the user due for review today, including review fields
    const collections = await getTodayDueCollections(userId);
    return res.status(200).json(collections);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Mark a review as completed and schedule the next one
 */
export const markReviewCompleted = async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  
  const { taskId } = req.params;
  
  try {
    // First verify the review task belongs to one of the user's collections
    const reviewTask = await prisma.reviewTask.findUnique({
      where: { id: Number(taskId) },
      include: { collection: true },
    });
    
    if (!reviewTask) {
      return res.status(404).json({ error: "Review task not found" });
    }
    
    if (reviewTask.collection.userId !== userId) {
      return res.status(403).json({ error: "You don't have permission to update this review task" });
    }
    
    const updatedTask = await completeReview(Number(taskId));
    return res.status(200).json(updatedTask);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Reset a review task to start from the beginning of the spaced repetition sequence
 */
export const resetReviewTask = async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  
  const { taskId } = req.params;
  
  try {
    // First verify the review task belongs to one of the user's collections
    const reviewTask = await prisma.reviewTask.findUnique({
      where: { id: Number(taskId) },
      include: { collection: true },
    });
    
    if (!reviewTask) {
      return res.status(404).json({ error: "Review task not found" });
    }
    
    if (reviewTask.collection.userId !== userId) {
      return res.status(403).json({ error: "You don't have permission to update this review task" });
    }
    
    const updatedTask = await resetReviewProgress(Number(taskId));
    return res.status(200).json(updatedTask);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
