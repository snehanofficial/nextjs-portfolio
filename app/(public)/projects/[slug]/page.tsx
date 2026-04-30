import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/card";
import { getPublishedProjectBySlug, getSiteSettings } from "@/lib/dal/public";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [project, settings] = await Promise.all([
    getPublishedProjectBySlug(slug),
    getSiteSettings(),
  ]);

  if (!project) {
    return {
      title: "Project not found",
    };
  }

  return {
    title: `${project.title} | ${settings.seoTitle ?? settings.siteTitle}`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  return (
    <Suspense fallback={<ProjectFallback />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

async function ProjectContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10 sm:px-10">
      <Link className="text-sm font-medium text-neutral-600" href="/projects">
        Back to projects
      </Link>
      <Card className="grid gap-6">
        <div className="grid gap-3">
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-950">{project.title}</h1>
          <p className="text-base text-neutral-600">{project.summary}</p>
        </div>
        <div className="grid gap-3 text-sm leading-7 text-neutral-700">
          {project.description.split("\n").map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-medium text-neutral-900">
          {project.liveUrl ? (
            <a href={project.liveUrl} rel="noreferrer" target="_blank">
              Visit live project
            </a>
          ) : null}
          {project.repositoryUrl ? (
            <a href={project.repositoryUrl} rel="noreferrer" target="_blank">
              View repository
            </a>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

function ProjectFallback() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10 sm:px-10">
      <Card className="h-72 animate-pulse bg-neutral-100" />
    </div>
  );
}
