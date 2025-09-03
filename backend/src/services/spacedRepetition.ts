import { prisma } from "./prisma";

/**
 * The spaced repetition intervals in days
 * This follows a common spaced repetition pattern:
 * 1 day, 3 days, 7 days, 14 days, 30 days, 60 days, 90 days, 180 days, 365 days
 */
export const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 60, 90, 180, 365];

/**
 * Creates a new review task for a collection
 * @param collectionId The ID of the collection to create a review task for
 * @returns The created review task
 */
export async function createInitialReviewTask(collectionId: number) {
  // Set the initial review for tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return prisma.reviewTask.create({
    data: {
      collectionId,
      intervalIndex: 0, // Start with the first interval (1 day)
      nextReview: tomorrow,
      lastReviewed: today,
      reviewCount: 0,
    },
  });
}

/**
 * Get the next review date based on the current interval index
 * @param currentIntervalIndex The current position in the interval sequence
 * @returns The next review date
 */
export function getNextReviewDate(currentIntervalIndex: number): Date {
  const intervalIndex = Math.min(currentIntervalIndex, REVIEW_INTERVALS.length - 1);
  const days = REVIEW_INTERVALS[intervalIndex];
  
  const next = new Date();
  next.setDate(next.getDate() + days);
  next.setHours(0, 0, 0, 0);
  
  return next;
}

/**
 * Get all collections that are due for review today for a specific user
 * @param userId The user ID to get due collections for
 * @returns Collections due for review today with their words and review task
 */
export async function getTodayDueCollections(userId: number) {
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  
  return prisma.collection.findMany({
    where: {
      userId,
      reviewTask: {
        nextReview: {
          lte: today,
        },
      },
    },
    include: { 
      words: true, 
      reviewTask: true 
    },
  });
}

/**
 * Get all collections that are due for review today across all users
 * @returns Collections due for review today with their words, review task, and user info
 */
export async function getAllDueCollections() {
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  
  return prisma.collection.findMany({
    where: {
      reviewTask: {
        nextReview: {
          lte: today,
        },
      },
    },
    include: { 
      words: true, 
      reviewTask: true,
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
}

/**
 * Update a review task after a user has completed a review
 * @param taskId The ID of the review task to update
 * @returns The updated review task
 */
export async function completeReview(taskId: number) {
  // Get the current review task
  const task = await prisma.reviewTask.findUnique({
    where: { id: taskId },
  });
  
  if (!task) {
    throw new Error('Review task not found');
  }
  
  // Calculate the next interval and review date
  const nextIntervalIndex = Math.min(task.intervalIndex + 1, REVIEW_INTERVALS.length - 1);
  const nextReviewDate = getNextReviewDate(nextIntervalIndex);
  
  // Update the review task
  return prisma.reviewTask.update({
    where: { id: taskId },
    data: {
      intervalIndex: nextIntervalIndex,
      nextReview: nextReviewDate,
      lastReviewed: new Date(),
      reviewCount: task.reviewCount + 1,
    },
  });
}

/**
 * Reset a review task to start the spaced repetition sequence from the beginning
 * @param taskId The ID of the review task to reset
 * @returns The updated review task
 */
export async function resetReviewProgress(taskId: number) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  return prisma.reviewTask.update({
    where: { id: taskId },
    data: {
      intervalIndex: 0, // Start with the first interval again
      nextReview: tomorrow,
      lastReviewed: new Date(),
    },
  });
}
