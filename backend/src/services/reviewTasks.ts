import { prisma } from "./prisma";
import type { LearningItem, ReviewTask } from "@prisma/client";

// Use Prisma-generated types with relations
type LearningItemWithReviews = LearningItem & {
  reviews: ReviewTask[];
};

export async function getTodayReviewTasks(): Promise<LearningItemWithReviews[]> {
  // Get the start and end of today in UTC
  const now = new Date();
  const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
  const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

  // Return items that started today (initial review day)
  const itemsToReview = await prisma.learningItem.findMany({
    where: {
      startDay: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: { reviews: true },
  });

  return itemsToReview;
}
