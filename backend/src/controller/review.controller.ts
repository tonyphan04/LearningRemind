import { sendReviewEmail } from "../services/email";
import { getTodayReviewTasks, ReviewTaskWithItem } from "../services/reviewTasks";
import { Request, Response } from "express";

export const getTodayTasks = async (_req: Request, res: Response) => {
  try {
    const today = await getTodayReviewTasks();
    res.json(today);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const sendTodayReviewEmail = async (_req: Request, res: Response) => {
  try {
    const today = await getTodayReviewTasks();
    await sendReviewEmail(today);
    res.json({ sent: true, count: today.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
