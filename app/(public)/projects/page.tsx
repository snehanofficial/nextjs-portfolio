import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getPublishedProjects } from "@/lib/dal/public";

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 sm:px-10">
      <div className="grid gap-3">
        <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">Projects</p>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-950">Published work</h1>
        <p className="max-w-2xl text-base text-neutral-600">
          A server-rendered catalog of portfolio projects with draft and publish support.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id} className="grid gap-4">
            <Badge tone={project.featured ? "warning" : "neutral"}>
              {project.featured ? "Featured" : "Project"}
            </Badge>
            <div className="grid gap-2">
              <h2 className="text-2xl font-semibold text-neutral-950">{project.title}</h2>
              <p className="text-sm leading-7 text-neutral-600">{project.summary}</p>
            </div>
            <Link className="text-sm font-medium text-neutral-900" href={`/projects/${project.slug}`}>
              View details
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
