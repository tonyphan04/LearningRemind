import nodemailer from 'nodemailer'
import { prisma } from "./prisma";

export type ReviewTaskWithItem = {
  id: number;
  itemId: number;
  intervalDay?: number;
  item: {
    id: number;
    topic: string;
    goal: string[];
    resources: string[];
    startDay?: Date | string;
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

  // Only include tasks due today
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const todaysTasks = tasks.filter(task => {
    if (!task.item.startDay || typeof task.intervalDay !== 'number') return false;
    const reviewDate = new Date(new Date(task.item.startDay).getTime() + task.intervalDay * 86400000);
    return reviewDate >= startOfDay && reviewDate <= endOfDay;
  });

  const taskList = todaysTasks.map(task => {
    const dateStr = task.item.startDay ? new Date(task.item.startDay).toLocaleDateString() : '';
    return `Date: ${dateStr}\nTopic: ${task.item.topic}\nGoals: ${task.item.goal.join(', ')}\nResources: ${task.item.resources.join(', ')}\n`;
  }).join('\n---\n');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: 'Your Review Tasks for Today',
    text: `Here are your review tasks for today:\n${taskList}`,
    html: `<h2>Your Review Tasks for Today</h2><ul>${todaysTasks.map(task => {
      const dateStr = task.item.startDay ? new Date(task.item.startDay).toLocaleDateString() : '';
      return `<li><strong>Date:</strong> ${dateStr}<br/><strong>Topic:</strong> ${task.item.topic}<br/><strong>Goals:</strong> ${task.item.goal.join(', ')}<br/><strong>Resources:</strong> ${task.item.resources.join(', ')}</li>`;
    }).join('')}</ul>`
  };

  await transporter.sendMail(mailOptions)
}

