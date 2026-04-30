import { deleteProjectAction } from "@/app/(admin)/admin/_actions/projects";
import { ProjectForm } from "@/components/admin/project-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminProjects } from "@/lib/dal/admin";

export default async function AdminProjectsPage() {
  const projects = await getAdminProjects();

  return (
    <div className="grid gap-6">
      <Card>
        <h2 className="text-2xl font-semibold text-neutral-950">Create project</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Draft or publish portfolio entries with optional Cloudinary-backed cover assets.
        </p>
        <div className="mt-6">
          <ProjectForm />
        </div>
      </Card>
      <div className="grid gap-5">
        {projects.map((project) => (
          <Card key={project.id} className="grid gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-semibold text-neutral-950">{project.title}</h3>
                <Badge tone={project.status === "PUBLISHED" ? "success" : "warning"}>
                  {project.status}
                </Badge>
              </div>
              <form action={deleteProjectAction}>
                <input name="id" type="hidden" value={project.id} />
                <Button type="submit" variant="danger">
                  Delete
                </Button>
              </form>
            </div>
            <ProjectForm project={project} />
          </Card>
        ))}
      </div>
    </div>
  );
}
