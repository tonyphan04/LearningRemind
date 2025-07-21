import { prisma } from "./prisma";

export type ReviewTaskWithItem = {
  id: number;
  intervalDay: number;
  itemId: number;
  item: {
    id: number;
    topic: string;
    goal: string[];
    resources: string[];
    startDay: Date;
    createdAt: Date;
    // add other fields if needed
  };
};

// Type for LearningItem and ReviewTask from Prisma
interface ReviewTask {
  id: number;
  intervalDay: number;
  itemId: number;
  // add other fields if needed
}
interface LearningItem {
  id: number;
  topic: string;
  goal: string[];
  resources: string[];
  startDay: Date;
  createdAt: Date;
  reviews: ReviewTask[];
  // add other fields if needed
}

export async function getTodayReviewTasks(): Promise<ReviewTaskWithItem[]> {
  // Get the start and end of today in UTC
  const now = new Date();
  const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
  const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

  // Query all ReviewTasks whose review date is today
  const reviewTasks = await prisma.reviewTask.findMany({
    where: {
      item: {
        startDay: now
      },
    },
    include: { item: true },
  });

  // Only include review tasks due today
  const tasks: ReviewTaskWithItem[] = reviewTasks.filter(task => {
    if (!task.item?.startDay || typeof task.intervalDay !== 'number') return false;
    const reviewDate = new Date(new Date(task.item.startDay).getTime() + task.intervalDay * 86400000);
    return reviewDate >= startOfDay && reviewDate <= endOfDay;
  }).map(task => ({
    id: task.id,
    intervalDay: task.intervalDay,
    itemId: task.itemId,
    item: {
      id: task.item.id,
      topic: task.item.topic,
      goal: task.item.goal,
      resources: task.item.resources,
      startDay: task.item.startDay,
      createdAt: task.item.createdAt,
      // add other fields if needed
    },
  }));

  return tasks;
}
