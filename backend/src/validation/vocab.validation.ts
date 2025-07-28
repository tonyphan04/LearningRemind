import { z } from "zod";

export const createVocabSchema = z.object({
  collectionId: z.number().int(),
  word: z.string().min(1, "Word is required"),
  description: z.string().min(1, "Description is required"),
  example: z.string().min(1, "Example is required"),
});

export const updateVocabSchema = z.object({
  word: z.string().min(1, "Word is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  example: z.string().min(1, "Example is required").optional(),
});
