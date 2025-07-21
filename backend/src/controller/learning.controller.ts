import { Request, Response } from "express";
import { prisma } from "../services/prisma";

export const createNote = async (req: Request, res: Response) => {
  try {
    const { topic, goal, resources, startDay } = req.body;
    if (!topic || typeof topic !== "string") {
      return res.status(400).json({ error: "Missing or invalid topic" });
    }
    if (!Array.isArray(goal) || goal.some(g => typeof g !== "string")) {
      return res.status(400).json({ error: "Goals must be an array of strings" });
    }
    if (resources && (!Array.isArray(resources) || resources.some(r => typeof r !== "string"))) {
      return res.status(400).json({ error: "Resources must be an array of strings" });
    }
    if (!startDay || isNaN(Date.parse(startDay))) {
      return res.status(400).json({ error: "Missing or invalid startDay" });
    }

    const item = await prisma.learningItem.create({
      data: {
        topic,
        goal,
        resources,
        startDay: new Date(startDay)
      }
    });

    const intervals = [1, 3, 7, 14, 30];
    const tasks = intervals.map(day => ({
      intervalDay: day,
      itemId: item.id
    }));

    await prisma.reviewTask.createMany({ data: tasks });
    return res.status(201).json(item);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getNotes = async (_req: Request, res: Response) => {
  try {
    const notes = await prisma.learningItem.findMany({ include: { reviews: true } });
    return res.status(200).json(notes);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid note id" });
    }
    const note = await prisma.learningItem.findUnique({
      where: { id },
      include: { reviews: true }
    });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    return res.status(200).json(note);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid note id" });
    }
    const { topic, goal, resources, startDay } = req.body;
    const updates: any = {};
    if (topic !== undefined) {
      if (typeof topic !== "string") return res.status(400).json({ error: "Topic must be a string" });
      updates.topic = topic;
    }
    if (goal !== undefined) {
      if (!Array.isArray(goal) || goal.some(g => typeof g !== "string")) return res.status(400).json({ error: "Goals must be an array of strings" });
      updates.goal = goal;
    }
    if (resources !== undefined) {
      if (!Array.isArray(resources) || resources.some(r => typeof r !== "string")) return res.status(400).json({ error: "Resources must be an array of strings" });
      updates.resources = resources;
    }
    if (startDay !== undefined) {
      if (isNaN(Date.parse(startDay))) return res.status(400).json({ error: "Invalid startDay" });
      updates.startDay = new Date(startDay);
    }

    const updated = await prisma.learningItem.update({
      where: { id },
      data: updates
    });

    return res.status(200).json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid note id" });
    }
    await prisma.reviewTask.deleteMany({ where: { itemId: id } });
    await prisma.learningItem.delete({ where: { id } });
    return res.status(204).send();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
