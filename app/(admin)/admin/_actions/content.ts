"use server";

import { updateTag } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { fromZodError } from "@/lib/actions/helpers";
import { CACHE_TAGS, SITE_SETTINGS_ID } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { emptyActionState, type ActionResult } from "@/lib/validation/common";
import { pageSectionSchema, siteSettingsSchema } from "@/lib/validation/admin";

export async function updateSiteSettingsAction(
  prevState: ActionResult = emptyActionState,
  formData: FormData,
): Promise<ActionResult> {
  void prevState;

  await requireAdmin();

  const parsed = siteSettingsSchema.safeParse({
    siteTitle: formData.get("siteTitle"),
    siteDescription: formData.get("siteDescription"),
    siteUrl: formData.get("siteUrl") ?? "",
    heroTitle: formData.get("heroTitle"),
    heroDescription: formData.get("heroDescription"),
    aboutTitle: formData.get("aboutTitle"),
    aboutBody: formData.get("aboutBody"),
    contactEmail: formData.get("contactEmail"),
    contactLocation: formData.get("contactLocation") || undefined,
    githubUrl: formData.get("githubUrl") ?? "",
    linkedinUrl: formData.get("linkedinUrl") ?? "",
    xUrl: formData.get("xUrl") ?? "",
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined,
    seoKeywords: formData.get("seoKeywords") || undefined,
  });

  if (!parsed.success) {
    return fromZodError(parsed.error);
  }

  await prisma.siteSettings.upsert({
    where: { id: SITE_SETTINGS_ID },
    create: {
      id: SITE_SETTINGS_ID,
      ...parsed.data,
      seoKeywords: parsed.data.seoKeywords
        ? parsed.data.seoKeywords
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean)
        : [],
    },
    update: {
      ...parsed.data,
      seoKeywords: parsed.data.seoKeywords
        ? parsed.data.seoKeywords
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean)
        : [],
    },
  });

  updateTag(CACHE_TAGS.siteSettings);

  return {
    status: "success",
    message: "Site settings have been updated.",
  };
}

export async function upsertSectionAction(
  prevState: ActionResult = emptyActionState,
  formData: FormData,
): Promise<ActionResult> {
  void prevState;

  await requireAdmin();

  const parsed = pageSectionSchema.safeParse({
    id: formData.get("id") || undefined,
    sectionKey: formData.get("sectionKey"),
    title: formData.get("title"),
    body: formData.get("body"),
    ctaLabel: formData.get("ctaLabel") || undefined,
    ctaHref: formData.get("ctaHref") ?? "",
    sortOrder: formData.get("sortOrder") ?? 0,
    status: formData.get("status") ?? "DRAFT",
  });

  if (!parsed.success) {
    return fromZodError(parsed.error);
  }

  await prisma.pageSection.upsert({
    where: {
      id: parsed.data.id ?? "__new-section__",
    },
    create: {
      sectionKey: parsed.data.sectionKey,
      title: parsed.data.title,
      sortOrder: parsed.data.sortOrder,
      status: parsed.data.status,
      content: {
        body: parsed.data.body,
        ctaLabel: parsed.data.ctaLabel,
        ctaHref: parsed.data.ctaHref,
      },
    },
    update: {
      sectionKey: parsed.data.sectionKey,
      title: parsed.data.title,
      sortOrder: parsed.data.sortOrder,
      status: parsed.data.status,
      content: {
        body: parsed.data.body,
        ctaLabel: parsed.data.ctaLabel,
        ctaHref: parsed.data.ctaHref,
      },
    },
  });

  updateTag(CACHE_TAGS.sections);

  return {
    status: "success",
    message: "Section saved.",
  };
}

export async function deleteSectionAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  await prisma.pageSection.delete({
    where: { id },
  });

  updateTag(CACHE_TAGS.sections);
}
