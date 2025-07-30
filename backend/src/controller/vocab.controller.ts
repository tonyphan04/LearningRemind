import { Request, Response } from "express";
import { prisma } from "../services/prisma";
import jwt from "jsonwebtoken";
import { createVocabSchema, updateVocabSchema } from "../validation/vocab.validation";
import { parse } from "csv-parse/sync";
import { isStructuredFile, normalizeHeaders } from "../utils/fileUpload";

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

export const createVocabFromFile = async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const collectionId  = req.params.collectionId;
  // Use req.file for Multer single file upload
  const file = req.file;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  if (!collectionId) return res.status(400).json({ error: "collectionId is required" });
  if (!file) return res.status(400).json({ error: "File is required. Make sure you are using multipart/form-data and Multer middleware." });

  try {
    // Find collection to ensure it belongs to the user
    const collection = await prisma.collection.findUnique({ where: { id: Number(collectionId), userId } });
    if (!collection) return res.status(404).json({ error: "Collection not found or not yours" });
    //check if size of file is less than 10MB
    if (file.size > 10 * 1024 * 1024) {
    return res.status(400).json({ error: "File size must be less than 10MB" });
    }

    const allowedExtensions = [".pdf", ".docx", ".txt", ".xlsx"];
    const ext = "." + file.originalname.split('.').pop()?.toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      return res.status(400).json({ error: "File type not supported. Allowed types: .pdf, .docx, .txt, .xlsx" });
    }

    try {
      const fileRecord = await prisma.uploadedFile.create({
        data: {
          filename: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          data: file.buffer,
          collectionId: Number(collectionId),
          userId: Number(userId), // Associate file with user
        }
      });

      res.json({
        success: true,
        fileId: fileRecord.id,
        message: "File uploaded and saved to database"
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save file" });
    }
    // start parsing content
    // if file is structured like "word,description,example" per line
    if (isStructuredFile(file)){
      const content = file.buffer.toString("utf-8");
      const records = parse(content, { skip_empty_lines: true });

      const headers = records[0];
      const rows = records.slice(1);

      const headerIndexes = normalizeHeaders(headers);

      const words = rows.map((row: string[]) => ({
        word: row[headerIndexes.word],
        description: row[headerIndexes.description],
        example: headerIndexes.example !== undefined ? row[headerIndexes.example] : null,
        collectionId: Number(collectionId),
      }));
      //validate each word using createVocabSchema
      const validationResults = words
        .map((word) => createVocabSchema.safeParse(word))
        .filter((result) => result.success)
        .map((result) => result.data);
      const errors = words.length - validationResults.length;
      if (errors > 0) {
        return res.status(400).json({ error: "Validation failed", details: "Some words failed validation." });
      }
      
      const existingWords = await prisma.word.findMany({  
        where: {
          collectionId: Number(collectionId),
          word: {
            in: validationResults.map((w) => w.word)
          }
        },
        select: { word: true }
      });
      if (existingWords.length > 0) {
        return res.status(400).json({ error: "Some words already exist in the collection", existingWords });
      }
      // filter out existing words
      const newWords = validationResults.filter(w => !existingWords.some(existing => existing.word === w.word));
      // save all words to the database
      await prisma.word.createMany({
        data: newWords
      });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }

}

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