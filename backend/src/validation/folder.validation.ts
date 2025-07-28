import { z } from "zod";

export const createFolderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const updateFolderSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
});
