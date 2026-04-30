import type { ZodError } from "zod";

import type { ActionResult } from "@/lib/validation/common";

export function fromZodError(error: ZodError): ActionResult {
  return {
    status: "error",
    message: "Please correct the highlighted fields.",
    fieldErrors: error.flatten().fieldErrors,
  };
}
