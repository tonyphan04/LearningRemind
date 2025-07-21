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
  // Query all LearningItems whose startDay is today (UTC), including their review tasks
  const items: LearningItem[] = await prisma.learningItem.findMany({
    where: {
      startDay: new Date(),
    },
    include: { reviews: true },
  });

  // Flatten all review tasks from today's items
  const tasks: ReviewTaskWithItem[] = items.flatMap(item =>
    item.reviews.map(review => ({
      ...review,
      item: {
        id: item.id,
        topic: item.topic,
        goal: item.goal,
        resources: item.resources,
        startDay: item.startDay,
        createdAt: item.createdAt,
        // add other fields if needed
      },
    }))
  );

  return tasks;
}
