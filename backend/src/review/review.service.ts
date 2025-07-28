import { prisma } from "../services/prisma";

// Fixed interval sequence in days
export const INTERVALS = [1, 3, 7, 14, 30, 60, 90, 365];

export async function getTodayDueCollections(userId: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return prisma.collection.findMany({
    where: {
      userId,
      reviewTask: {
        nextReview: {
          lte: today,
        },
      },
    },
    include: { words: true, reviewTask: true },
  });
}

export function getNextReviewDate(currentIntervalIndex: number): Date {
  const days = INTERVALS[Math.min(currentIntervalIndex, INTERVALS.length - 1)];
  const next = new Date();
  next.setDate(next.getDate() + days);
  return next;
}
