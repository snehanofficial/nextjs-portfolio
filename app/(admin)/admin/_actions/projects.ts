"use server";

import { updateTag } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { fromZodError } from "@/lib/actions/helpers";
import { CACHE_TAGS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { deleteAssetIfOrphaned, upsertAssetRecord } from "@/lib/services/assets";
import { uploadToCloudinary } from "@/lib/services/cloudinary";
import { getFileFromFormData, validateFile } from "@/lib/validation/files";
import { emptyActionState, type ActionResult } from "@/lib/validation/common";
import { projectSchema } from "@/lib/validation/admin";

function parseProjectFormData(formData: FormData) {
  return projectSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    repositoryUrl: formData.get("repositoryUrl") ?? "",
    liveUrl: formData.get("liveUrl") ?? "",
    featured: formData.get("featured") === "on",
    sortOrder: formData.get("sortOrder") ?? 0,
    status: formData.get("status") ?? "DRAFT",
    altText: formData.get("altText") || undefined,
  });
}

export async function upsertProjectAction(
  prevState: ActionResult = emptyActionState,
  formData: FormData,
): Promise<ActionResult> {
  void prevState;

  await requireAdmin();

  const parsed = parseProjectFormData(formData);

  if (!parsed.success) {
    return fromZodError(parsed.error);
  }

  const coverImage = getFileFromFormData(formData, "coverImage");
  const coverImageValidation = validateFile(coverImage, "coverImage", {
    required: false,
    maxSizeInBytes: 4 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
  });

  if (coverImageValidation) {
    return coverImageValidation;
  }

  const existing = parsed.data.id
    ? await prisma.project.findUnique({ where: { id: parsed.data.id } })
    : null;

  let nextCoverAssetId = existing?.coverAssetId ?? null;

  if (coverImage) {
    const uploaded = await uploadToCloudinary(coverImage, "image", "portfolio/projects");
    const asset = await upsertAssetRecord(uploaded, parsed.data.altText);
    nextCoverAssetId = asset.id;
  }

  const project = await prisma.project.upsert({
    where: {
      id: parsed.data.id ?? "__new-project__",
    },
    create: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      summary: parsed.data.summary,
      description: parsed.data.description,
      repositoryUrl: parsed.data.repositoryUrl,
      liveUrl: parsed.data.liveUrl,
      featured: parsed.data.featured,
      sortOrder: parsed.data.sortOrder,
      status: parsed.data.status,
      publishedAt:
        parsed.data.status === "PUBLISHED" ? new Date() : null,
      coverAssetId: nextCoverAssetId,
    },
    update: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      summary: parsed.data.summary,
      description: parsed.data.description,
      repositoryUrl: parsed.data.repositoryUrl,
      liveUrl: parsed.data.liveUrl,
      featured: parsed.data.featured,
      sortOrder: parsed.data.sortOrder,
      status: parsed.data.status,
      publishedAt:
        parsed.data.status === "PUBLISHED"
          ? existing?.publishedAt ?? new Date()
          : null,
      coverAssetId: nextCoverAssetId,
    },
  });

  if (existing?.coverAssetId && existing.coverAssetId !== nextCoverAssetId) {
    await deleteAssetIfOrphaned(existing.coverAssetId).catch(() => undefined);
  }

  updateTag(CACHE_TAGS.projects);

  return {
    status: "success",
    message: `${project.title} has been saved.`,
  };
}

export async function deleteProjectAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  const project = await prisma.project.delete({
    where: { id },
  });

  if (project.coverAssetId) {
    await deleteAssetIfOrphaned(project.coverAssetId).catch(() => undefined);
  }

  updateTag(CACHE_TAGS.projects);
}
