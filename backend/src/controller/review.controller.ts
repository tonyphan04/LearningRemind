import { sendReviewEmail } from "../services/email";
import { getTodayReviewTasks, ReviewTaskWithItem } from "../services/reviewTasks";
import { Request, Response } from "express";

export const getTodayTasks = async (_req: Request, res: Response) => {
  try {
    const today = await getTodayReviewTasks();
    // If today is array of ReviewTaskWithItem, map to item structure
    const items = today.map(task => task.item);
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const sendTodayReviewEmail = async (_req: Request, res: Response) => {
  try {
    const today = await getTodayReviewTasks();
    const items = today.map(task => task.item);
    await sendReviewEmail(items);
    res.json({ sent: true, count: items.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
