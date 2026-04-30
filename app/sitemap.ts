import type { MetadataRoute } from "next";

import { getPublishedProjects, getSiteSettings } from "@/lib/dal/public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, settings] = await Promise.all([
    getPublishedProjects(),
    getSiteSettings(),
  ]);
  const siteUrl = settings.siteUrl ?? "http://localhost:3000";

  return [
    "",
    "/projects",
    "/resume",
    ...projects.map((project) => `/projects/${project.slug}`),
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));
}
