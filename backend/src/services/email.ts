import nodemailer from 'nodemailer'
import { prisma } from "./prisma";

type ReviewTaskWithItem = {
  intervalDay: number;
  item: {
    topic: string;
    startDay: string | Date; // Added startDay property
    // add other fields if needed
  };
};

export async function sendReviewEmail(tasks: ReviewTaskWithItem[]) {
  // Configure your email transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const taskList = tasks.map(task => `Topic: ${task.item.topic}, Interval: ${task.intervalDay} days`).join('\n')
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: 'Your Review Tasks for Today',
    text: `Here are your review tasks for today:\n${taskList}`,
    html: `<h2>Your Review Tasks for Today</h2><ul>${tasks.map(task => `<li>Topic: ${task.item.topic}, Interval: ${task.intervalDay} days</li>`).join('')}</ul>`
}

  await transporter.sendMail(mailOptions)
}

export async function getTodayReviewTasks(): Promise<ReviewTaskWithItem[]> {
  const now = new Date();
  const start = new Date(now.setHours(0, 0, 0, 0));
  const end = new Date(now.setHours(23, 59, 59, 999));
  const tasks: ReviewTaskWithItem[] = await prisma.reviewTask.findMany({ include: { item: true } });
  return tasks.filter((task: ReviewTaskWithItem) => {
    const reviewDate = new Date(new Date(task.item.startDay).getTime() + task.intervalDay * 86400000);
    return reviewDate >= start && reviewDate <= end;
  });
}
