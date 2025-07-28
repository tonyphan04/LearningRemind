import { Request, Response } from "express";
import { getTodayDueCollections } from "../review/review.service";
import jwt from "jsonwebtoken";

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
    const collections = await getTodayDueCollections(userId);
    return res.status(200).json(collections);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
