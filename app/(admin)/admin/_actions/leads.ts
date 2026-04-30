"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fromZodError } from "@/lib/actions/helpers";
import { emptyActionState, type ActionResult } from "@/lib/validation/common";
import { leadStatusUpdateSchema } from "@/lib/validation/admin";

export async function updateLeadStatusAction(
  prevState: ActionResult = emptyActionState,
  formData: FormData,
): Promise<ActionResult> {
  void prevState;

  await requireAdmin();

  const parsed = leadStatusUpdateSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return fromZodError(parsed.error);
  }

  await prisma.lead.update({
    where: { id: parsed.data.id },
    data: {
      status: parsed.data.status,
      notes: parsed.data.notes,
    },
  });

  return {
    status: "success",
    message: "Lead updated.",
  };
}
