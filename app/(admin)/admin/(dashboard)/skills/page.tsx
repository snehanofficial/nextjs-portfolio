import { deleteSkillAction } from "@/app/(admin)/admin/_actions/skills";
import { SkillForm } from "@/components/admin/skill-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminSkills } from "@/lib/dal/admin";

export default async function AdminSkillsPage() {
  const skills = await getAdminSkills();

  return (
    <div className="grid gap-6">
      <Card>
        <h2 className="text-2xl font-semibold text-neutral-950">Create skill</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Maintain a normalized skill catalog with asset-backed logos.
        </p>
        <div className="mt-6">
          <SkillForm />
        </div>
      </Card>
      <div className="grid gap-5">
        {skills.map((skill) => (
          <Card key={skill.id} className="grid gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-semibold text-neutral-950">{skill.name}</h3>
                <Badge tone={skill.status === "PUBLISHED" ? "success" : "warning"}>
                  {skill.status}
                </Badge>
              </div>
              <form action={deleteSkillAction}>
                <input name="id" type="hidden" value={skill.id} />
                <Button type="submit" variant="danger">
                  Delete
                </Button>
              </form>
            </div>
            <SkillForm skill={skill} />
          </Card>
        ))}
      </div>
    </div>
  );
}
