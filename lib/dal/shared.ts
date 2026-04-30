import type { Asset, PageSection, Project, Resume, SiteSettings, Skill } from "@prisma/client";

export type AssetDTO = {
  id: string;
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  format: string | null;
  resourceType: string;
};

export function toAssetDTO(asset: Asset | null | undefined): AssetDTO | null {
  if (!asset) {
    return null;
  }

  return {
    id: asset.id,
    url: asset.secureUrl || asset.url,
    altText: asset.altText,
    width: asset.width,
    height: asset.height,
    format: asset.format,
    resourceType: asset.resourceType,
  };
}

export function defaultSiteSettings(): Pick<
  SiteSettings,
  | "siteTitle"
  | "siteDescription"
  | "siteUrl"
  | "heroTitle"
  | "heroDescription"
  | "aboutTitle"
  | "aboutBody"
  | "contactEmail"
  | "contactLocation"
  | "githubUrl"
  | "linkedinUrl"
  | "xUrl"
  | "seoTitle"
  | "seoDescription"
  | "seoKeywords"
> {
  return {
    siteTitle: "Snehan Portfolio",
    siteDescription: "A developer portfolio and content dashboard.",
    siteUrl: null,
    heroTitle: "Building thoughtful full-stack products.",
    heroDescription:
      "This portfolio foundation is ready for projects, skills, resume management, and lead capture.",
    aboutTitle: "About",
    aboutBody:
      "Use the admin dashboard to update your intro, featured work, profile sections, and resume.",
    contactEmail: "hello@example.com",
    contactLocation: "Remote",
    githubUrl: null,
    linkedinUrl: null,
    xUrl: null,
    seoTitle: "Snehan Portfolio",
    seoDescription: "A modern portfolio built with Next.js, Prisma, and Auth.js.",
    seoKeywords: ["portfolio", "next.js", "prisma", "typescript"],
  };
}

export type ProjectWithAsset = Project & { coverAsset: Asset | null };
export type SkillWithAsset = Skill & { logoAsset: Asset | null };
export type ResumeWithAsset = Resume & { asset: Asset };
export type SectionRecord = PageSection;
