import { Request, Response } from "express";
import { prisma } from "../services/prisma";
import jwt from "jsonwebtoken";
import { createVocabSchema, updateVocabSchema } from "../validation/vocab.validation";

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

export const createVocab = async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  // Coerce collectionId to number for validation
  const parseResult = createVocabSchema.safeParse({
    ...req.body,
    collectionId: Number(req.body.collectionId),
  });
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten().fieldErrors });
  }
  const { collectionId, word, description, example } = parseResult.data;
  try {
    // Ensure the collection belongs to the user
    const collection = await prisma.collection.findFirst({ where: { id: collectionId, userId } });
    if (!collection) return res.status(404).json({ error: "Collection not found or not yours" });
    const vocab = await prisma.word.create({
      data: {
        collectionId,
        word,
        description: description ?? null,
        example: example ?? null,
      },
    });
    return res.status(201).json(vocab);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getVocabs = async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { collectionId, sortBy } = req.query;
  if (!collectionId) return res.status(400).json({ error: "collectionId is required" });
  let orderBy: any = { createdAt: "desc" };
  if (sortBy === "word") orderBy = { word: "asc" };
  if (sortBy === "updatedAt") orderBy = { updatedAt: "asc" };
  try {
    // Ensure the collection belongs to the user
    const collection = await prisma.collection.findFirst({ where: { id: Number(collectionId), userId } });
    if (!collection) return res.status(404).json({ error: "Collection not found or not yours" });
    const vocabs = await prisma.word.findMany({
      where: { collectionId: Number(collectionId) },
      orderBy,
    });
    return res.status(200).json(vocabs);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getVocabById = async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { id } = req.params;
  try {
    const vocab = await prisma.word.findUnique({ where: { id: Number(id) } });
    if (!vocab) return res.status(404).json({ error: "Vocab not found" });
    // Ensure the vocab belongs to a collection owned by the user
    const collection = await prisma.collection.findFirst({ where: { id: vocab.collectionId, userId } });
    if (!collection) return res.status(403).json({ error: "Forbidden" });
    return res.status(200).json(vocab);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateVocab = async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { id } = req.params;
  const parseResult = updateVocabSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten().fieldErrors });
  }
  const { word, description, example } = parseResult.data;
  try {
    const vocab = await prisma.word.findUnique({ where: { id: Number(id) } });
    if (!vocab) return res.status(404).json({ error: "Vocab not found" });
    // Ensure the vocab belongs to a collection owned by the user
    const collection = await prisma.collection.findFirst({ where: { id: vocab.collectionId, userId } });
    if (!collection) return res.status(403).json({ error: "Forbidden" });
    await prisma.word.update({
      where: { id: Number(id) },
      data: {
        word,
        description: description ,
        example: example ,
      },
    });
    return res.status(200).json({ message: "Vocab updated" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteVocab = async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { id } = req.params;
  try {
    const vocab = await prisma.word.findUnique({ where: { id: Number(id) } });
    if (!vocab) return res.status(404).json({ error: "Vocab not found" });
    // Ensure the vocab belongs to a collection owned by the user
    const collection = await prisma.collection.findFirst({ where: { id: vocab.collectionId, userId } });
    if (!collection) return res.status(403).json({ error: "Forbidden" });
    await prisma.word.delete({ where: { id: Number(id) } });
    return res.status(200).json({ message: "Vocab deleted" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
