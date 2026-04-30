import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Your name is required."),
  email: z.email("Enter a valid email address."),
  subject: z.string().trim().min(3, "Add a subject."),
  message: z.string().trim().min(10, "Tell me a little more."),
});
