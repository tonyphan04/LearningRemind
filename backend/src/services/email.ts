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

export async function sendReviewEmail(items: {
  id: number;
  topic: string;
  goal: string[];
  resources: string[];
  startDay: Date;
  createdAt: Date;
}[]) {
  // Configure your email transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const taskList = items.map(item => {
    const dateStr = item.startDay ? new Date(item.startDay).toLocaleDateString() : '';
    return `Date: ${dateStr}\nTopic: ${item.topic}\nGoals: ${item.goal.join(', ')}\nResources: ${item.resources.join(', ')}\n`;
  }).join('\n---\n');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: 'Your Review Tasks for Today',
    text: `Here are your review tasks for today:\n${taskList}`,
    html: `<h2>Your Review Tasks for Today</h2><ul>${items.map(item => {
      const dateStr = item.startDay ? new Date(item.startDay).toLocaleDateString() : '';
      return `<li><strong>Date:</strong> ${dateStr}<br/><strong>Topic:</strong> ${item.topic}<br/><strong>Goals:</strong> ${item.goal.join(', ')}<br/><strong>Resources:</strong> ${item.resources.join(', ')}</li>`;
    }).join('')}</ul>`
  };

  await transporter.sendMail(mailOptions)
}


