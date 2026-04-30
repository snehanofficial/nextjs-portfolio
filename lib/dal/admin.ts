import { prisma } from "@/lib/prisma";
import { SITE_SETTINGS_ID } from "@/lib/constants";
import { defaultSiteSettings, toAssetDTO } from "@/lib/dal/shared";

export async function getAdminOverview() {
  const [projectCount, skillCount, leadCount, publishedCount] = await Promise.all([
    prisma.project.count(),
    prisma.skill.count(),
    prisma.lead.count(),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
  ]);

  return {
    projectCount,
    skillCount,
    leadCount,
    publishedCount,
  };
}

export async function getAdminProjects() {
  const projects = await prisma.project.findMany({
    include: { coverAsset: true },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  });

  return projects.map((project) => ({
    ...project,
    coverAsset: toAssetDTO(project.coverAsset),
  }));
}

export async function getAdminSkills() {
  const skills = await prisma.skill.findMany({
    include: { logoAsset: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return skills.map((skill) => ({
    ...skill,
    logoAsset: toAssetDTO(skill.logoAsset),
  }));
}

export async function getAdminContent() {
  const [settings, sections] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: SITE_SETTINGS_ID } }),
    prisma.pageSection.findMany({
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    }),
  ]);

  return {
    settings: settings ?? defaultSiteSettings(),
    sections,
  };
}

export async function getAdminResume() {
  const activeResume = await prisma.resume.findFirst({
    where: { isActive: true },
    include: { asset: true },
    orderBy: { updatedAt: "desc" },
  });

  if (!activeResume) {
    return null;
  }

  return {
    ...activeResume,
    asset: toAssetDTO(activeResume.asset),
  };
}

export async function getAdminLeads() {
  return prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });
}
