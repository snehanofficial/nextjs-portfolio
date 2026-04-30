"use server";

import { updateTag } from "next/cache";

import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/constants";
import { sendLeadNotificationEmail } from "@/lib/services/resend";
import { leadSchema } from "@/lib/validation/public";
import { emptyActionState, type ActionResult } from "@/lib/validation/common";
import { fromZodError } from "@/lib/actions/helpers";

export async function submitLeadAction(
  prevState: ActionResult = emptyActionState,
  formData: FormData,
): Promise<ActionResult> {
  void prevState;

  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return fromZodError(parsed.error);
  }

  const lead = await prisma.lead.create({
    data: parsed.data,
  });

  try {
    await sendLeadNotificationEmail(parsed.data);
    await prisma.lead.update({
      where: { id: lead.id },
      data: { notificationSentAt: new Date(), notificationError: null },
    });
  } catch (error) {
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        notificationError:
          error instanceof Error ? error.message : "Notification failed.",
      },
    });
  }

  updateTag(CACHE_TAGS.leads);

  return {
    status: "success",
    message: "Thanks for reaching out. Your message has been saved.",
  };
}
