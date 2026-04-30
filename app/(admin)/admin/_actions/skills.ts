"use server";

import { updateTag } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { fromZodError } from "@/lib/actions/helpers";
import { CACHE_TAGS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { deleteAssetIfOrphaned, upsertAssetRecord } from "@/lib/services/assets";
import { uploadToCloudinary } from "@/lib/services/cloudinary";
import { skillSchema } from "@/lib/validation/admin";
import { emptyActionState, type ActionResult } from "@/lib/validation/common";
import { getFileFromFormData, validateFile } from "@/lib/validation/files";

export async function upsertSkillAction(
  prevState: ActionResult = emptyActionState,
  formData: FormData,
): Promise<ActionResult> {
  void prevState;

  await requireAdmin();

  const parsed = skillSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    proficiency: formData.get("proficiency") || undefined,
    sortOrder: formData.get("sortOrder") ?? 0,
    status: formData.get("status") ?? "DRAFT",
    altText: formData.get("altText") || undefined,
  });

  if (!parsed.success) {
    return fromZodError(parsed.error);
  }

  const logoFile = getFileFromFormData(formData, "logoFile");
  const logoValidation = validateFile(logoFile, "logoFile", {
    required: false,
    maxSizeInBytes: 2 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
  });

  if (logoValidation) {
    return logoValidation;
  }

  const existing = parsed.data.id
    ? await prisma.skill.findUnique({ where: { id: parsed.data.id } })
    : null;

  let nextLogoAssetId = existing?.logoAssetId ?? null;

  if (logoFile) {
    const uploaded = await uploadToCloudinary(logoFile, "image", "portfolio/skills");
    const asset = await upsertAssetRecord(uploaded, parsed.data.altText);
    nextLogoAssetId = asset.id;
  }

  const skill = await prisma.skill.upsert({
    where: {
      id: parsed.data.id ?? "__new-skill__",
    },
    create: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      category: parsed.data.category,
      proficiency: parsed.data.proficiency,
      sortOrder: parsed.data.sortOrder,
      status: parsed.data.status,
      logoAssetId: nextLogoAssetId,
    },
    update: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      category: parsed.data.category,
      proficiency: parsed.data.proficiency,
      sortOrder: parsed.data.sortOrder,
      status: parsed.data.status,
      logoAssetId: nextLogoAssetId,
    },
  });

  if (existing?.logoAssetId && existing.logoAssetId !== nextLogoAssetId) {
    await deleteAssetIfOrphaned(existing.logoAssetId).catch(() => undefined);
  }

  updateTag(CACHE_TAGS.skills);

  return {
    status: "success",
    message: `${skill.name} has been saved.`,
  };
}

export async function deleteSkillAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  const skill = await prisma.skill.delete({
    where: { id },
  });

  if (skill.logoAssetId) {
    await deleteAssetIfOrphaned(skill.logoAssetId).catch(() => undefined);
  }

  updateTag(CACHE_TAGS.skills);
}
