"use server";

import { updateTag } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { fromZodError } from "@/lib/actions/helpers";
import { CACHE_TAGS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { deleteAssetIfOrphaned, upsertAssetRecord } from "@/lib/services/assets";
import { uploadToCloudinary } from "@/lib/services/cloudinary";
import { emptyActionState, type ActionResult } from "@/lib/validation/common";
import { getFileFromFormData, validateFile } from "@/lib/validation/files";
import { resumeSchema } from "@/lib/validation/admin";

export async function replaceResumeAction(
  prevState: ActionResult = emptyActionState,
  formData: FormData,
): Promise<ActionResult> {
  void prevState;

  await requireAdmin();

  const parsed = resumeSchema.safeParse({
    version: formData.get("version"),
    altText: formData.get("altText") || undefined,
  });

  if (!parsed.success) {
    return fromZodError(parsed.error);
  }

  const resumeFile = getFileFromFormData(formData, "resumeFile");
  const fileValidation = validateFile(resumeFile, "resumeFile", {
    required: true,
    maxSizeInBytes: 8 * 1024 * 1024,
    allowedTypes: ["application/pdf"],
  });

  if (fileValidation) {
    return fileValidation;
  }

  if (!resumeFile) {
    return {
      status: "error",
      message: "Resume file is required.",
    };
  }

  const uploaded = await uploadToCloudinary(resumeFile, "raw", "portfolio/resume");
  const asset = await upsertAssetRecord(uploaded, parsed.data.altText);
  const previous = await prisma.resume.findFirst({
    where: { isActive: true },
  });

  await prisma.$transaction(async (tx) => {
    await tx.resume.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    if (previous) {
      await tx.resume.update({
        where: { id: previous.id },
        data: {
          version: parsed.data.version,
          assetId: asset.id,
          isActive: true,
        },
      });
    } else {
      await tx.resume.create({
        data: {
          version: parsed.data.version,
          assetId: asset.id,
          isActive: true,
        },
      });
    }
  });

  if (previous?.assetId && previous.assetId !== asset.id) {
    await deleteAssetIfOrphaned(previous.assetId).catch(() => undefined);
  }

  updateTag(CACHE_TAGS.resume);

  return {
    status: "success",
    message: "Resume has been replaced.",
  };
}
