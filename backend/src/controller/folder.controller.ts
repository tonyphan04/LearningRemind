import { Request, Response } from "express";
import { prisma } from "../services/prisma";
import jwt from "jsonwebtoken";
import { createFolderSchema, updateFolderSchema } from "../validation/folder.validation";
import { createInitialReviewTask } from "../services/spacedRepetition";

// Helper to get userId from JWT
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

export const createFolder = async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const parseResult = createFolderSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten().fieldErrors });
  }
  const { name, description } = parseResult.data;
  try {
    // Create the folder (collection)
    const folder = await prisma.collection.create({
      data: { name, description, userId },
    });
    
    // Automatically create a review task for this new folder
    await createInitialReviewTask(folder.id);
    
    return res.status(201).json(folder);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getFolders = async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const folders = await prisma.collection.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(folders);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getFolderById = async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { id } = req.params;
  try {
    const folder = await prisma.collection.findFirst({
      where: { id: Number(id), userId },
    });
    if (!folder) return res.status(404).json({ error: "Folder not found" });
    return res.status(200).json(folder);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getFolderByName = async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { name } = req.query;
  if (!name || typeof name !== "string") return res.status(400).json({ error: "Name query is required" });
  try {
    const folders = await prisma.collection.findMany({
      where: {
        userId,
        name: { contains: name, mode: "insensitive" },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(folders);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateFolder = async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { id } = req.params;
  const parseResult = updateFolderSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten().fieldErrors });
  }
  const { name, description } = parseResult.data;
  try {
    const folder = await prisma.collection.updateMany({
      where: { id: Number(id), userId },
      data: { name, description },
    });
    if (folder.count === 0) return res.status(404).json({ error: "Folder not found or not yours" });
    return res.status(200).json({ message: "Folder updated" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteFolder = async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { id } = req.params;
  try {
    const folder = await prisma.collection.deleteMany({
      where: { id: Number(id), userId },
    });
    if (folder.count === 0) return res.status(404).json({ error: "Folder not found or not yours" });
    return res.status(200).json({ message: "Folder deleted" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};


