import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  timeGroup: z.enum(["today", "tomorrow", "this_week"]).optional(),
  dueDate: z.string().optional(),
  listId: z.string().optional(),
});

export const stickyNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  color: z.enum(["yellow", "cyan", "pink", "orange"]).optional(),
});

export const listSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().optional(),
});

export const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type StickyNoteInput = z.infer<typeof stickyNoteSchema>;
export type ListInput = z.infer<typeof listSchema>;
export type TagInput = z.infer<typeof tagSchema>;
