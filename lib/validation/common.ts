import { z } from "zod";

export const publishStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);
export const leadStatusSchema = z.enum(["NEW", "REVIEWED", "ARCHIVED"]);

export const optionalUrlSchema = z
  .string()
  .trim()
  .url("Enter a valid URL.")
  .or(z.literal(""))
  .transform((value) => value || undefined);

export const slugSchema = z
  .string()
  .trim()
  .min(2, "Slug must be at least 2 characters.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and dashes only.");

export const actionResultSchema = z.object({
  status: z.enum(["idle", "success", "error"]),
  message: z.string().optional(),
});

export type ActionResult = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const emptyActionState: ActionResult = {
  status: "idle",
};
