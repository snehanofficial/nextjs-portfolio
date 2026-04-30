import { cacheLife, cacheTag } from "next/cache";

import { prisma } from "@/lib/prisma";
import { CACHE_TAGS, SITE_SETTINGS_ID } from "@/lib/constants";
import {
  defaultSiteSettings,
  toAssetDTO,
} from "@/lib/dal/shared";

export async function getPublishedProjects() {
  "use cache";

  cacheTag(CACHE_TAGS.projects);
  cacheLife("hours");

  try {
    const projects = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      include: { coverAsset: true },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { updatedAt: "desc" }],
    });

    return projects.map((project) => ({
      ...project,
      coverAsset: toAssetDTO(project.coverAsset),
    }));
  } catch {
    return [];
  }
}

export async function getFeaturedProjects() {
  "use cache";

  cacheTag(CACHE_TAGS.projects);
  cacheLife("hours");

  try {
    const projects = await prisma.project.findMany({
      where: { status: "PUBLISHED", featured: true },
      include: { coverAsset: true },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      take: 3,
    });

    return projects.map((project) => ({
      ...project,
      coverAsset: toAssetDTO(project.coverAsset),
    }));
  } catch {
    return [];
  }
}

export async function getPublishedProjectBySlug(slug: string) {
  "use cache";

  cacheTag(CACHE_TAGS.projects);
  cacheLife("hours");

  try {
    const project = await prisma.project.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: { coverAsset: true },
    });

    if (!project) {
      return null;
    }

    return {
      ...project,
      coverAsset: toAssetDTO(project.coverAsset),
    };
  } catch {
    return null;
  }
}

export async function getPublishedSkills() {
  "use cache";

  cacheTag(CACHE_TAGS.skills);
  cacheLife("hours");

  try {
    const skills = await prisma.skill.findMany({
      where: { status: "PUBLISHED" },
      include: { logoAsset: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return skills.map((skill) => ({
      ...skill,
      logoAsset: toAssetDTO(skill.logoAsset),
    }));
  } catch {
    return [];
  }
}

export async function getActiveResume() {
  "use cache";

  cacheTag(CACHE_TAGS.resume);
  cacheLife("hours");

  try {
    const resume = await prisma.resume.findFirst({
      where: { isActive: true },
      include: { asset: true },
      orderBy: { updatedAt: "desc" },
    });

    if (!resume) {
      return null;
    }

    return {
      ...resume,
      asset: toAssetDTO(resume.asset),
    };
  } catch {
    return null;
  }
}

export async function getSiteSettings() {
  "use cache";

  cacheTag(CACHE_TAGS.siteSettings);
  cacheLife("hours");

  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: SITE_SETTINGS_ID },
    });

    return settings ?? defaultSiteSettings();
  } catch {
    return defaultSiteSettings();
  }
}

export async function getPublishedSections() {
  "use cache";

  cacheTag(CACHE_TAGS.sections);
  cacheLife("hours");

  try {
    return await prisma.pageSection.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    });
  } catch {
    return [];
  }
}

export async function getHomePageData() {
  const [settings, projects, skills, sections, resume] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(),
    getPublishedSkills(),
    getPublishedSections(),
    getActiveResume(),
  ]);

  return {
    settings,
    projects,
    skills,
    sections,
    resume,
  };
}
